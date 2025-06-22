import {
  AutoComplete,
  Col,
  Form,
  FormInstance,
  InputNumber,
  Row,
  Select,
  Typography,
} from "antd";
import ProForm, { ProFormList, ProFormDependency } from "@ant-design/pro-form";
import { forwardRef, useImperativeHandle, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { DefaultOptionType } from "antd/es/select";
import { PartService } from "@/api/services/part.service";
import { PartSearchResult } from "@/types/types";
import { formatPrice } from "@/util/valueUtil";

interface PartFormRef {
  form: FormInstance;
}

interface PartFormProps {
  readOnly?: boolean;
}

const PartForm = forwardRef<PartFormRef, PartFormProps>(
  ({ readOnly = false }, ref) => {
    const [form] = Form.useForm();

    const PartAutoComplete: React.FC<{ index: number }> = ({ index }) => {
      const [search, setSearch] = useState("");
      const [debouncedSearch] = useDebounce(search, 300);
      const [options, setOptions] = useState<DefaultOptionType[]>([]);

      useEffect(() => {
        if (!debouncedSearch) {
          setOptions([]);
          return;
        }
        let cancelled = false;
        PartService.searchParts(debouncedSearch).then((data) => {
          if (cancelled) return;
          const groups: Record<string, DefaultOptionType> = {};
          data.forEach((p) => {
            if (!groups[p.category]) {
              groups[p.category] = { label: p.category, options: [] } as any;
            }
            (groups[p.category].options as DefaultOptionType[]).push({
              label: (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{p.name}</span>
                  <span>
                    {`${formatPrice(p.price)} / ${p.unit}${
                      p.type === "M" ? " 自制件" : ""
                    }`}
                  </span>
                </div>
              ),
              value: p.name,
              item: p,
            });
          });
          setOptions(Object.values(groups));
        });
        return () => {
          cancelled = true;
        };
      }, [debouncedSearch]);

      return (
        <AutoComplete
          options={options}
          onSearch={setSearch}
          onSelect={(_, option) => {
            const item = (option as any).item as PartSearchResult;
            form.setFieldValue(["parts", index, "unitPrice"], item.price);
            form.setFieldValue(["parts", index, "unit"], item.unit);
          }}
          style={{ width: "100%" }}
          placeholder="物料名称"
        />
      );
    };

    useImperativeHandle(ref, () => ({
      form,
    }));

    return (
      <ProForm
        layout="vertical"
        form={form}
        submitter={false}
        readonly={readOnly}
      >
        <ProFormList
          name="parts"
          label="配件明细"
          creatorButtonProps={{ creatorButtonText: "新增物料" }}
          deleteIconProps={readOnly ? false : undefined}
          copyIconProps={readOnly ? false : undefined}
          alwaysShowItemLabel
          rules={[
            {
              required: true,
              message: "请至少输入一个配件",
              validator: (_, value) => {
                if (!value || value.length == 0) {
                  return Promise.reject(new Error("请至少输入一个配件"));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          {(f, index, action) => (
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <ProForm.Item
                  name={"name"}
                  label="名称"
                  rules={[{ required: true, message: "请输入物料名称" }]}
                  readonly={readOnly}
                >
                  <PartAutoComplete index={index} />
                </ProForm.Item>
              </Col>
              <Col xs={12} md={3}>
                <ProForm.Item
                  name="quantity"
                  label="数量"
                  rules={[{ required: true, message: "请输入数量" }]}
                  initialValue={1}
                >
                  <InputNumber
                    min={1}
                    style={{ width: "100%" }}
                    controls={false}
                  />
                </ProForm.Item>
              </Col>
              <Col xs={12} md={3}>
                <ProForm.Item
                  name="unit"
                  label="单位"
                  rules={[{ required: true, message: "请选择单位" }]}
                  initialValue="件"
                >
                  <Select style={{ width: "100%" }}>
                    <Select.Option value="件">件</Select.Option>
                    <Select.Option value="套">套</Select.Option>
                    <Select.Option value="个">个</Select.Option>
                  </Select>
                </ProForm.Item>
              </Col>
              <Col xs={12} md={4}>
                <ProForm.Item
                  name="unitPrice"
                  label="单价"
                  rules={[{ required: true, message: "请输入单价" }]}
                >
                  <InputNumber
                    min={0}
                    precision={2}
                    controls={false}
                    style={{ width: "100%" }}
                  />
                </ProForm.Item>
              </Col>
              <Col xs={12} md={6}>
                <ProFormDependency name={["quantity", "unitPrice"]}>
                  {({ quantity, unitPrice }) => (
                    <Form.Item label="合计">
                      <Typography.Text strong>
                        {quantity && unitPrice
                          ? `¥ ${formatPrice(quantity * unitPrice)}`
                          : 0}
                      </Typography.Text>
                    </Form.Item>
                  )}
                </ProFormDependency>
              </Col>
            </Row>
          )}
        </ProFormList>
        <Form.Item shouldUpdate>
          {({ getFieldValue }) => {
            const parts = getFieldValue("parts") || [];
            const total = parts.reduce((sum: number, g: any) => {
              const q = g?.quantity;
              const p = g?.unitPrice;
              if (q && p) return sum + q * p;
              return sum;
            }, 0);
            return (
              <Typography.Text strong>
                总计：¥ {formatPrice(total || 0)}
              </Typography.Text>
            );
          }}
        </Form.Item>
      </ProForm>
    );
  }
);

export default PartForm;
