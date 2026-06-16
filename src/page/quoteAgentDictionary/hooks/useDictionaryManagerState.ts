import { useCallback, useEffect, useMemo, useState } from "react";
import { usePersistentFilterState } from "@/hook/usePersistentFilterState";
import { quoteAgentService } from "../../quoteAgent/services/quoteAgent.service";
import {
  isDictionaryOptionsCacheFresh,
  readDictionaryOptionsCache,
  writeDictionaryOptionsCache,
} from "../dictionaryCache";
import type { DictionaryTermType, DictionaryValue, ProductTypeOption } from "../../quoteAgent/types";
import type {
  DictionaryEditorState,
  DictionaryValueFormValues,
  TermTypeFormValues,
} from "../types";
import {
  dedupeDictionaryValues,
  dictionaryValueForm,
  dictionaryValuePayload,
  errorText,
  filterAliasList,
  includesKeyword,
  termTypeForm,
  termTypePayload,
} from "../utils";

const defaultDictionaryFilters = {
  keyword: "",
};

export function useDictionaryManagerState() {
  const [initialCache] = useState(() => readDictionaryOptionsCache());
  const { filters, setFilters } = usePersistentFilterState(
    "quoteAgent.dictionaryManager",
    defaultDictionaryFilters,
  );
  const keyword = filters.keyword;
  const [termTypes, setTermTypes] = useState<DictionaryTermType[]>(initialCache?.options.termTypes ?? []);
  const [values, setValues] = useState<DictionaryValue[]>(
    dedupeDictionaryValues(initialCache?.options.values ?? []),
  );
  const [productTypes, setProductTypes] = useState<ProductTypeOption[]>(initialCache?.options.productTypes ?? []);
  const [editor, setEditor] = useState<DictionaryEditorState>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const cacheDictionaryOptions = useCallback(
    (nextTermTypes: DictionaryTermType[], nextValues: DictionaryValue[], nextProductTypes = productTypes) => {
      writeDictionaryOptionsCache({
        termTypes: nextTermTypes,
        values: dedupeDictionaryValues(nextValues),
        productTypes: nextProductTypes,
      });
    },
    [productTypes],
  );

  const reload = useCallback(async (options?: { force?: boolean }) => {
    const cached = readDictionaryOptionsCache();
    if (!options?.force && isDictionaryOptionsCacheFresh(cached)) {
      setTermTypes(cached?.options.termTypes ?? []);
      setValues(dedupeDictionaryValues(cached?.options.values ?? []));
      setProductTypes(cached?.options.productTypes ?? []);
    }

    setLoading(true);
    setError("");
    try {
      const dictionaryOptions = await quoteAgentService.getDictionaryOptions();
      const nextTermTypes = dictionaryOptions.termTypes ?? [];
      const nextValues = dedupeDictionaryValues(dictionaryOptions.values ?? []);
      const nextProductTypes = dictionaryOptions.productTypes ?? [];
      setTermTypes(nextTermTypes);
      setValues(nextValues);
      setProductTypes(nextProductTypes);
      writeDictionaryOptionsCache({
        termTypes: nextTermTypes,
        values: nextValues,
        productTypes: nextProductTypes,
      });
    } catch (error) {
      setError(errorText(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const filteredTermTypes = useMemo(
    () =>
      termTypes.filter((item) =>
        includesKeyword(
          [
            item.termType,
            item.displayName,
            item.quoteDisplayName,
            item.category,
            item.valueKind,
            ...(item.aliasNames ?? item.aliases ?? []),
          ],
          keyword,
        ),
      ),
    [keyword, termTypes],
  );

  const openCreateTermType = () => setEditor({ kind: "termType", mode: "create", values: termTypeForm() });
  const openEditTermType = (record: DictionaryTermType) =>
    setEditor({ kind: "termType", mode: "edit", record, values: termTypeForm(record) });
  const openCreateValue = (termType?: string) =>
    setEditor({
      kind: "value",
      mode: "create",
      values: dictionaryValueForm(undefined, termType || termTypes[0]?.termType || ""),
    });
  const openEditValue = (record: DictionaryValue) =>
    setEditor({ kind: "value", mode: "edit", record, values: dictionaryValueForm(record) });

  const updateDictionaryTermTypeField = async (
    record: DictionaryTermType,
    patch: Partial<DictionaryTermType>,
  ) => {
    const id = record.id;
    if (id == null || id === "") throw new Error("缺少字典字段 id，无法保存");

    setSaving(true);
    setError("");
    setMessage("");
    try {
      const payload = {
        termType: String(patch.termType ?? record.termType ?? "").trim(),
        displayName: String(patch.displayName ?? record.displayName ?? "").trim(),
        quoteDisplayName: String(patch.quoteDisplayName ?? record.quoteDisplayName ?? "").trim(),
        category: String(patch.category ?? record.category ?? "").trim(),
        valueKind: String(patch.valueKind ?? record.valueKind ?? "").trim(),
        applicableProductTypes: patch.applicableProductTypes ?? record.applicableProductTypes ?? [],
        aliasNames: patch.aliasNames ?? record.aliasNames ?? record.aliases ?? [],
        sortOrder: patch.sortOrder ?? record.sortOrder,
      };
      const saved = await quoteAgentService.updateTermType(id, payload);
      setTermTypes((current) => {
        const nextTermTypes = current.map((item) =>
          String(item.id) === String(id) ? { ...item, ...payload, ...saved } : item,
        );
        cacheDictionaryOptions(nextTermTypes, values);
        return nextTermTypes;
      });
      setMessage("保存成功");
    } catch (error) {
      setError(errorText(error));
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const updateDictionaryValueField = async (
    record: DictionaryValue,
    patch: Partial<DictionaryValue>,
  ) => {
    const id = record.id;
    if (id == null || id === "") throw new Error("缺少字典标准值 id，无法保存");

    setSaving(true);
    setError("");
    setMessage("");
    try {
      const payload = {
        termType: String(record.termType ?? ""),
        canonicalValue: String(patch.canonicalValue ?? record.canonicalValue ?? "").trim(),
        displayName: String(patch.displayName ?? record.displayName ?? "").trim(),
        aliasNames: filterAliasList(patch.aliasNames ?? record.aliasNames ?? record.aliases ?? [], [
          patch.canonicalValue ?? record.canonicalValue,
        ]),
      };
      const saved = await quoteAgentService.updateDictionaryValue(id, payload);
      setValues((current) => {
        const nextValues = current.map((item) =>
          String(item.id) === String(id) ? { ...item, ...payload, ...saved } : item,
        );
        cacheDictionaryOptions(termTypes, nextValues);
        return nextValues;
      });
      setMessage("保存成功");
    } catch (error) {
      setError(errorText(error));
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const deleteDictionaryValue = async (record: DictionaryValue) => {
    const id = record.id;
    if (id == null || id === "") throw new Error("缺少字典标准值 id，无法删除");

    setSaving(true);
    setError("");
    setMessage("");
    try {
      await quoteAgentService.deleteDictionaryValue(id);
      setValues((current) => {
        const nextValues = current.filter((item) => String(item.id) !== String(id));
        cacheDictionaryOptions(termTypes, nextValues);
        return nextValues;
      });
      setMessage("删除成功");
    } catch (error) {
      setError(errorText(error));
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const updateEditorValues = (values: Partial<TermTypeFormValues> | Partial<DictionaryValueFormValues>) => {
    setEditor((current) => current ? { ...current, values: { ...current.values, ...values } as any } : current);
  };

  const submitEditor = async () => {
    if (!editor) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      if (editor.kind === "termType") {
        const payload = termTypePayload(editor.values);
        if (!payload.termType) throw new Error("请填写 termType");
        if (editor.mode === "create") await quoteAgentService.createTermType(payload);
        else {
          const id = editor.record?.id;
          if (id == null || id === "") throw new Error("缺少字典字段 id，无法调用编辑接口。");
          await quoteAgentService.updateTermType(id, payload);
        }
      } else {
        const payload = dictionaryValuePayload(editor.values);
        if (!payload.termType || !payload.canonicalValue) throw new Error("请填写 termType 和 canonicalValue");
        if (editor.mode === "create") await quoteAgentService.createDictionaryValue(payload);
        else {
          const id = editor.record?.id;
          if (id == null || id === "") throw new Error("缺少字典标准值 id，无法调用编辑接口。");
          await quoteAgentService.updateDictionaryValue(id, payload);
        }
      }
      setEditor(null);
      setMessage("保存成功");
      await reload({ force: true });
    } catch (error) {
      setError(errorText(error));
    } finally {
      setSaving(false);
    }
  };

  return {
    keyword,
    loading,
    saving,
    error,
    message,
    termTypes,
    values,
    productTypes,
    filteredTermTypes,
    editor,
    setKeyword: (value: string) => setFilters({ keyword: value }),
    reload,
    openCreateTermType,
    openEditTermType,
    openCreateValue,
    openEditValue,
    updateDictionaryTermTypeField,
    updateDictionaryValueField,
    deleteDictionaryValue,
    closeEditor: () => setEditor(null),
    updateEditorValues,
    submitEditor,
  };
}
