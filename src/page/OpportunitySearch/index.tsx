import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Input,
  Select,
  Button,
  Space,
  Typography,
  Divider,
  Empty,
  Tag,
  message,
  Spin,
} from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import OpportunityCard from "@/components/OpportunityCard";
import styles from "./OpportunitySearchPage.module.less";
import StatusSelector from "@/components/StatusSelector";
import { DebounceSelect } from "@/components/general/DebounceSelect";
import { CustomerService } from "@/api/services/customer.service";
import { set } from "lodash-es";
import { OpportunityService } from "@/api/services/opportunity.service";
import { useQuoteStore } from "@/store/useQuoteStore";

const { Title, Text } = Typography;
const { Option } = Select;

// 状态选项配置
const statusOptions = [
  { value: "none", label: "未报价" },
  { value: "quoting", label: "报价中" },
  { value: "reviewing", label: "审核中" },
  { value: "completed", label: "报价完成" },
];

// [
//   {
//     id: "opp-001",
//     name: "年度服务器采购项目",
//     latestQuoteStatus: "none",
//     quoteCount: 0,
//     charger: "张三",
//     chargerId: "user-001",
//     createdAt: "2023-08-01T10:00:00",
//     customer: {
//       id: "cust-001",
//       name: "ABC科技有限公司",
//       charger: "李四",
//       collaborator: ["王五", "赵六"],
//     },
//     products: [

//     ],
//   },
//   {
//     id: "opp-002",
//     name: "办公室设备升级",
//     latestQuoteStatus: "quoting",
//     quoteCount: 1,
//     charger: "王五",
//     chargerId: "user-003",
//     createdAt: "2023-08-05T14:30:00",
//     lastQuoteDate: "2023-08-10T09:15:00",
//     customer: {
//       id: "cust-002",
//       name: "XYZ企业集团",
//       charger: "王五", // 与商机负责人相同
//       collaborator: ["张三"],
//     },
//     products: [

//     ],
//   },
//   {
//     id: "opp-003",
//     name: "数据中心建设项目",
//     latestQuoteStatus: "reviewing",
//     quoteCount: 2,
//     charger: "赵六",
//     chargerId: "user-004",
//     createdAt: "2023-08-10T09:00:00",
//     lastQuoteDate: "2023-08-15T16:45:00",
//     customer: {
//       id: "cust-003",
//       name: "数据无限公司",
//       charger: "钱七",
//       collaborator: ["张三", "李四"],
//     },
//     products: [
//       {
//         productName: "机柜",
//         productCategory: ["基础设施"],
//       },
//       {
//         productName: "UPS电源",
//         productCategory: ["电力设备"],
//       },
//       {
//         productName: "空调系统",
//         productCategory: ["温控"],
//       },
//       {
//         productName: "消防系统",
//         productCategory: ["安全"],
//       },
//     ],
//   },
//   {
//     id: "opp-004",
//     name: "员工电脑批量采购",
//     latestQuoteStatus: "completed",
//     quoteCount: 3,
//     charger: "张三",
//     chargerId: "user-001",
//     createdAt: "2023-08-15T13:20:00",
//     lastQuoteDate: "2023-08-20T11:10:00",
//     customer: {
//       id: "cust-004",
//       name: "创新未来有限公司",
//       charger: "李四",
//       collaborator: ["王五", "赵六"],
//     },
//     products: [
//       {
//         productName: "台式电脑",
//         productCategory: ["办公设备"],
//       },
//       {
//         productName: "键盘鼠标套装",
//         productCategory: ["外设"],
//       },
//       {
//         productName: "耳机",
//         productCategory: ["外设"],
//       },
//     ],
//   },
// ];

const OpportunitySearchPage = () => {
  const navigate = useNavigate();
  const [selectedCustomer, setSelectedCustomer] = useState<
    | {
        label: string;
        value: string;
      }[]
    | null
  >(null);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const { fetchQuotes } = useQuoteStore();

  const handleSearch = async () => {
    setLoading(true);
    try {
      // const opportunity = await OpportunityService.getOpportunity(
      //   selectedCustomer?.map((c) => c.label),
      //   selectedStatus
      // );
      // 模拟API延迟
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 过滤逻辑
      // const filtered = mockOpportunities.filter((opp) => {
      //   const matchesCustomer = selectedCustomer
      //     ? opp.id === selectedCustomer[0].value
      //     : true;

      //   const matchesStatus =
      //     selectedStatus.length > 0
      //       ? selectedStatus[0].includes(opp.latestQuoteStatus)
      //       : true;
      //   console.log("opp", selectedCustomer);
      //   return matchesCustomer && matchesStatus;
      // });

      // setOpportunities(filtered);

      // if (filtered.length === 0) {
      //   message.info("没有找到匹配的商机");
      // }
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载数据
  useEffect(() => {
    handleSearch();
  }, []);

  const handleCreateOpportunity = () => {
    window.open("/opportunities/new", "_blank");
  };

  const handleCardClick = async (opportunity: any) => {
    try {
      // 1. 在store中设置商机
      // selectOpportunity(opportunity);
      // 2. 获取或创建第一个报价单
      // const firstQuoteId = await fetchQuotes(opportunity.id);
      // 3. 导航到包含quoteId的URL
      // navigate(`/opportunities/${opportunity.id}/quotes/${firstQuoteId}`);
    } catch (error) {
      message.error("初始化商机失败");
    }
  };

  return (
    <div className={styles.opportunitySearchContainer}>
      <Title level={3} className={styles.searchTitle}>
        商机搜索
      </Title>

      <div className={styles.searchControls}>
        <Space size="middle" className={styles.searchInputGroup}>
          <DebounceSelect
            mode="multiple"
            maxCount={5}
            fetchOptions={CustomerService.searchCompanies}
            value={selectedCustomer}
            onChange={(newValue) => {
              if (Array.isArray(newValue)) {
                setSelectedCustomer(
                  newValue as { label: string; value: string }[] | null
                );
              } else {
                setSelectedCustomer(null);
              }
            }}
            showSearch
            placeholder="搜索并选择公司"
            className={styles.searchInput}
            suffixIcon={<SearchOutlined />}
          />

          <StatusSelector value={selectedStatus} onChange={setSelectedStatus} />
          <Space size={16}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              loading={loading}
              className={styles.searchButton}
            >
              搜索
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateOpportunity}
            >
              创建商机
            </Button>
          </Space>
        </Space>
      </div>

      <Divider className={styles.searchDivider} />

      {loading ? (
        <div className={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      ) : opportunities.length > 0 ? (
        <div className={styles.opportunityGrid}>
          {opportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              onClick={() => handleCardClick(opportunity)}
            />
          ))}
        </div>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span>
              没有搜索到商机
              <br />
              <Button
                type="link"
                icon={<PlusOutlined />}
                onClick={handleCreateOpportunity}
                className={styles.createButton}
              >
                点击创建商机
              </Button>
            </span>
          }
          className={styles.emptyContainer}
        />
      )}
    </div>
  );
};

export default OpportunitySearchPage;
