import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Select,
  Button,
  Avatar,
  Card,
  Row,
  Col,
  message,
  Spin,
  Switch,
  Radio,
  Checkbox,
} from "antd";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import "./style.less";
import * as ww from "@wecom/jssdk";
import Layout, { Content } from "antd/es/layout/layout";
import { CustomerService } from "../../api/services/customer.service";
import { DebounceSelect } from "../../components/general/DebounceSelect";
import { AuthService } from "../../api/services/auth.service";
import { values } from "lodash";
import { useAuthStore } from "../../store/useAuthStore";
import { getContext, register } from "../../util/wecom";

const { Option } = Select;

interface Company {
  id: string;
  name: string;
}

const ExternalContactBindingPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [userContext, setUserContext] = useState<any>();
  const [text, setText] = useState("1234");
  const location = useLocation();
  const [externalId, setExternalId] = useState(
    "wmPE-hBwAAXgxua0L255oBrIY0K_I9iA"
  );
  const { isAuthenticated } = useAuthStore();
  // 模拟企业微信环境检测
  useEffect(() => {
    const fetchUserContext = async (userId: string) => {
      try {
        const res = await CustomerService.getInfo(userId);
        // console.log("获取用户信息成功:", res);
        setUserContext(res);
        form.setFieldsValue({
          name: res.name,
          phone: res.phone,
          gender:
            res["gender"] == 1 ? "male" : res["gender"] == 2 ? "female" : "",
        });
      } catch (error) {
        console.error("获取用户信息失败:", error);
        message.error("获取用户信息失败");
      }
    };
    const checkQywxContext = async () => {
      // let text1 = "123";
      try {
        // 测试阶段直接显示表单;
        // if (process.env.NODE_ENV === "development") {
        //   setShowForm(true);
        //   const link = await CustomerService.getJdyId(externalId);
        //   if (!link) {
        //     await fetchUserContext(externalId);
        //   } else {
        //     window.location.href = link;
        //   }
        //   // mockUserContext();
        //   return;
        // }
        // register();
        ww.register({
          corpId: import.meta.env.VITE_CORP_ID,
          agentId: import.meta.env.VITE_AGENT_ID,
          jsApiList: ["getContext", "getCurExternalContact", "checkJsApi"],
          getConfigSignature: AuthService.getConfigSignature,
          getAgentConfigSignature: AuthService.getAgentSignature,
        });
        const context = await getContext();
        // const context = await ww.getContext();
        if (context.entry == "single_chat_tools") {
          setText(context.entry);
          setShowForm(true);
          const external = await ww.getCurExternalContact();
          setExternalId(external.userId);
          const link = await CustomerService.getJdyId(external.userId);
          if (link) {
            window.location.href = link;
          } else {
            await fetchUserContext(external.userId);
          }
        }
      } catch (error) {
        message.error(`检测企业微信上下文失败:${JSON.stringify(error)}`);
        // message.error("请在企微客户端打开此页面");
      } finally {
        setLoading(false);
      }
    };
    async function checkIsInWeChat() {
      try {
        const context = await ww.getContext();
        // 如果能成功获取到context，说明在企业微信/微信环境中
        return true;
      } catch (error) {
        // 获取失败说明不在企业微信/微信环境中
        console.error("不在企业微信/微信环境中:", error);
        return false;
      }
    }
    checkQywxContext();
    checkIsInWeChat();
    // 1. 添加监听
    window.addEventListener("hashchange", checkQywxContext);

    // 2. 返回清理函数
    return () => {
      window.removeEventListener("hashchange", checkQywxContext);
    };
  }, [location.search, externalId, form, isAuthenticated]);

  const handleSubmit = async (values: any) => {
    try {
      const link = (
        await CustomerService.matchCustomer({
          externalUserId: externalId,
          corpName: values.company.value,
          jdyId: values.company.key.id,
          name: values.name,
          position: values.position,
          remark: values.remark,
          mobile: values.phone,
          isKeyDecisionMaker: values.isKeyDecisionMaker,
          updateQywxRemark: values.updateQywxRemark,
        })
      ).link;
      message.success("客户绑定成功");
      // 跳转到CRM客户链接
      window.location.href = link;
    } catch (error) {
      message.error("客户绑定失败");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  if (!showForm) {
    return <div className="unauthorized-container">{<h2>{text}</h2>}</div>;
  }

  return (
    <Layout className="qywx-layout">
      <Content className="form-content-container">
        <Card className="form-card">
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            {/* 用户信息行 */}
            <Row gutter={16} align="middle" className="user-info-row">
              <Col>
                <Avatar
                  size={64}
                  src={userContext.avatar}
                  icon={<UserOutlined />}
                />
              </Col>
              <Col>
                <div className="user-info">
                  <div className="user-name">
                    {userContext.name || "未知用户"}
                  </div>
                  {userContext.corp_name && (
                    <div className="corp-name">@{userContext.corp_name}</div>
                  )}
                </div>
              </Col>
            </Row>

            {/* 公司搜索选择器 */}
            <Form.Item
              name="company"
              label="所属公司"
              rules={[{ required: true, message: "请选择公司" }]}
            >
              <DebounceSelect
                // mode="multiple"
                // maxCount={1}
                fetchOptions={CustomerService.searchCompanies}
                showSearch
                placeholder="搜索并选择公司"
                // defaultActiveFirstOption={false}
                // filterOption={false}
                suffixIcon={<SearchOutlined />}
              />
            </Form.Item>

            {/* 客户姓名 */}
            <Form.Item
              name="name"
              label="客户姓名"
              rules={[{ required: true, message: "请输入客户姓名" }]}
            >
              <Input placeholder="请输入客户姓名" />
            </Form.Item>
            {/* 性别 */}
            <Form.Item
              name="gender"
              label="性别"
              rules={[{ required: true, message: "请选择性别" }]}
            >
              <Radio.Group>
                <Radio value="male">男</Radio>
                <Radio value="female">女</Radio>
              </Radio.Group>
            </Form.Item>
            {/* 手机号 */}
            <Form.Item
              name="phone"
              label="手机号"
              rules={[
                // 非必填，但如果填写则必须符合手机号格式
                {
                  pattern: /^1[3-9]\d{9}$/,
                  message: "请输入正确的手机号",
                  // 关键：设置 validateTrigger 并允许空值
                  validator: (_, value) =>
                    !value || /^1[3-9]\d{9}$/.test(value) || value == ""
                      ? Promise.resolve()
                      : Promise.reject(new Error("请输入正确的手机号")),
                },
              ]}
            >
              <Input placeholder="请输入手机号" />
            </Form.Item>

            {/* 选项组容器 - 无交互关联，仅视觉分组 */}
            <Form.Item style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {/* 关键决策人选项 */}
                <Form.Item
                  name="isKeyDecisionMaker"
                  valuePropName="checked"
                  noStyle
                >
                  <Checkbox>是否关键决策人</Checkbox>
                </Form.Item>

                {/* 企微备注选项 */}
                <Form.Item
                  name="updateQywxRemark"
                  valuePropName="checked"
                  initialValue={true}
                  noStyle
                >
                  <Checkbox>是否更新企微备注</Checkbox>
                </Form.Item>
              </div>
            </Form.Item>

            {/* 岗位 */}
            <Form.Item name="position" label="职位">
              <Input placeholder="请输入职位" />
            </Form.Item>

            {/* 备注 */}
            <Form.Item name="remark" label="备注">
              <Input.TextArea rows={3} placeholder="请输入备注信息" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large">
                绑定客户
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default ExternalContactBindingPage;
