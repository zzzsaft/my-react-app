import { useCallback, useState } from "react";
import { modalStore } from "../store/modalStore";
import { useQuoteStore } from "../store/useQuoteStore";
import { QuoteItem } from "../types/types";

interface PartAddingProps {
  method: "add";
  isChild?: boolean;
  quoteItems?: QuoteItem[];
  quoteId: number;
  productCategory: string[];
  productName: string;
  linkId: number;
  source: {
    name: string;
    value: boolean | string;
    key: string;
  };
}

interface PartDeletingProps {
  method: "delete";
  productCategory?: string[];
  quoteItems?: QuoteItem[];
  linkId: number;
  items: {
    itemId?: number;
    name: string;
    source?: {
      key: string;
      name: string;
      value: string | boolean;
    };
  }[];
  quoteId: number;
}

type PartActionProps = PartAddingProps | PartDeletingProps;

const useProductActionModal = () => {
  const { openModal, isLoading, setIsLoading } = modalStore();
  const {
    addQuoteItem,
    addChildQuoteItem,
    deleteQuoteItem,
    updateQuoteItemConfig,
  } = useQuoteStore();

  const showProductActionModal = useCallback(
    (prop: PartActionProps): Promise<{ result: boolean; id?: number }> => {
      return new Promise((resolve) => {
        let addedId: number | undefined;
        let deletingId: number;
        if (prop.method == "add") {
          const exist = prop.quoteItems?.find(
            (item) =>
              item.linkId == prop.linkId &&
              item.productCategory?.at(-1) == prop.productCategory.at(-1)
          );
          if (exist) {
            resolve({ result: true });
            return;
          }
        } else if (prop.productCategory) {
          const exist = prop.quoteItems?.find(
            (item) =>
              item.linkId == prop.linkId &&
              item.productCategory?.at(-1) == prop.productCategory?.at(-1)
          );
          if (!exist) {
            resolve({ result: true });
            return;
          }
          deletingId = exist.id;
        }
        const handleAction = async () => {
          if (prop.method === "add") {
            const { quoteId, productCategory, productName, linkId, source } =
              prop;

            setIsLoading(true);
            if (prop.isChild) {
              addedId = await addChildQuoteItem(quoteId, linkId, {
                productCategory,
                productName,
                linkId,
                source,
              });
            } else
              addedId = await addQuoteItem(quoteId, {
                productCategory,
                productName,
                linkId,
                source,
              });
            setIsLoading(false);
            resolve({ id: addedId, result: true });
          } else if (prop.method === "delete") {
            setIsLoading(true);
            for (const item of prop.items) {
              if (!item.itemId && !deletingId) continue;
              await deleteQuoteItem(prop.quoteId, item.itemId ?? deletingId);

              if (item.source) {
                const newConfig = {
                  [item.source.key]: item.source.value,
                };

                updateQuoteItemConfig(prop.quoteId, prop.linkId, newConfig);
              }
            }
            setIsLoading(false);
            resolve({ result: true });
          }
        };

        const getModalContent = () => {
          if (prop.method === "add") {
            return (
              <div>
                <p>您勾选了这个选项，点击确认后，会往产品列表中添加：</p>
                <p style={{ fontWeight: "bold", margin: "8px 0" }}>
                  {prop.productName}
                </p>
                <p>添加后可在报价单中查看。</p>
              </div>
            );
          } else {
            return (
              <div>
                <p>以下产品将从产品列表中删去：</p>
                <ul
                  style={{
                    margin: "8px 0",
                    paddingLeft: "16px",
                    listStyleType: "disc",
                  }}
                >
                  {prop.items.map((item) => (
                    <li
                      key={item.itemId ?? `temp_${item.name}`} // 确保 key 唯一
                      style={{ marginBottom: "4px" }}
                    >
                      {item.name}
                      {item.source && (
                        <div style={{ marginTop: "4px", fontSize: "0.9em" }}>
                          产品配置表中 <strong>{item.source.name}</strong>{" "}
                          将会改为 <strong>{String(item.source.value)}</strong>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
                <p style={{ color: "#ff4d4f" }}>删除后无法恢复，请确认！</p>
              </div>
            );
          }
        };

        openModal({
          title: prop.method === "add" ? "添加产品确认" : "删除产品确认",
          content: getModalContent(),
          onOk: handleAction,
          onCancel: () => resolve({ result: false }),
        });
      });
    },
    [addQuoteItem, deleteQuoteItem, openModal]
  );

  return { showProductActionModal };
};

export default useProductActionModal;
