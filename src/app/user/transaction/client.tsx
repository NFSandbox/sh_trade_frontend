"use client";
import { useEffect, useState, useLayoutEffect, CSSProperties } from "react";

// Components
import { FlexDiv, Center } from "@/components/container";
import { LoadingPage, LoadingSkeleton } from "@/components/error";
import { Title as CusTitle } from "@/components/title";
import { PageSegment } from "@/cus_components/pages";
import { ContactInfoItem } from "@/cus_components/contact_info";
import { ItemCard, AdaptiveItemGrid } from "@/cus_components/item";
const { Title } = Typography;
import {
  Avatar,
  Typography,
  Form,
  Button,
  Input,
  Select,
  Space,
  Radio,
  Table,
  FloatButton,
} from "antd";
const { useForm } = Form;
const { Paragraph } = Typography;
import {
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineQq,
  AiOutlineWechat,
  AiOutlineDelete,
  AiOutlinePlusCircle,
} from "react-icons/ai";

// States
import { useLayoutState, useHeaderTitle } from "@/states/layoutState";
import { useSettingsState } from "@/states/settingsState";
import { useStore } from "@/tools/use_store";
import { useTriggerState } from "@/tools/use_trigger_state";

// Tools
import { classNames } from "@/tools/css_tools";
import { asyncSleep, useAsyncTaskWithLoadingState } from "@/tools/general";
import { errorPopper } from "@/exceptions/error";
import { useMinBreakPoint } from "@/tools/use_breakpoints";
import toast from "react-hot-toast";

// Apis
import { useGetMeForce } from "@/api/auth";
import {
  updateUserDescription,
  useContactInfo,
  removeContactInfo,
  addContactInfo,
  ContactInfoIn,
  ContactInfoOutNew,
} from "@/api/user";
import { useUserItems } from "@/api/item";

import {
  useTradeRecords,
  acceptTransaction,
  cancelTransaction,
  confirmTransaction,
} from "@/api/trade";

export function Client() {
  const { data: userItems, isLoading } = useUserItems();

  const [clickable, setClickable] = useState(false);

  if (isLoading) {
    return <LoadingPage></LoadingPage>;
  }

  return (
    <FlexDiv
      expand
      className="w-full flex-col items-center justify-start gap-4 py-4 pr-4"
    >
      <TransactionTable></TransactionTable>
    </FlexDiv>
  );
}
import type { ColumnsType } from "antd/es/table";

interface FilterOptions {
  role: "buyer" | "seller";
  type: "active" | "completed" | "pending";
}

function TransactionTable() {
  const [role, setRole] = useState<FilterOptions["role"]>("buyer");
  const [type, setType] = useState<FilterOptions["type"]>("active");
  const { data: transactions, mutate } = useTradeRecords([type]);

  const handleAccept = async (trade_id: number) => {
    await acceptTransaction(trade_id);
    mutate();
  };

  const handleConfirm = async (trade_id: number) => {
    await confirmTransaction(trade_id);
    mutate();
  };

  const handleReject = async (trade_id: number) => {
    await cancelTransaction(trade_id);
    mutate();
  };

  // Define table columns
  const columns: ColumnsType<any> = [
    {
      title: "交易ID",
      dataIndex: "trade_id",
      key: "trade_id",
    },
    {
      title: "物品ID",
      dataIndex: "item_id",
      key: "item_id",
    },
    {
      title: "状态",
      dataIndex: "state",
      key: "state",
    },
    {
      title: "创建时间",
      dataIndex: "created_time",
      key: "created_time",
      render: (timestamp) => new Date(timestamp).toLocaleString(),
    },
    {
      title: "更新时间",
      dataIndex: "updated_time",
      key: "updated_time",
      render: (timestamp) => new Date(timestamp).toLocaleString(),
    },
    {
      title: "操作",
      key: "actions",
      render: (_, record) => (
        <Space>
          {role === "seller" && type === "pending" && (
            <>
              <Button
                type="primary"
                onClick={() => handleAccept(record.trade_id)}
              >
                接受
              </Button>
              <Button danger onClick={() => handleReject(record.trade_id)}>
                拒绝
              </Button>
            </>
          )}
          {role === "buyer" && type === "active" && (
            <Button
              type="primary"
              onClick={() => handleConfirm(record.trade_id)}
            >
              确认
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <FlexDiv className={classNames("w-full flex-col")}>
      {/* Filters */}
      <Space direction="vertical" style={{ marginBottom: 16 }}>
        <Space>
          <span>角色:</span>
          <Radio.Group
            value={role}
            onChange={(e) => setRole(e.target.value)}
            options={[
              { label: "买家", value: "buyer" },
              { label: "卖家", value: "seller" },
            ]}
            optionType="button"
          />
        </Space>

        <Space>
          <span>交易类型:</span>
          <Radio.Group
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={[
              { label: "进行中", value: "active" },
              { label: "已完成", value: "completed" },
              { label: "待处理", value: "pending" },
            ]}
            optionType="button"
          />
        </Space>
      </Space>

      {/* Transactions Table */}
      <Table
        columns={columns}
        dataSource={transactions?.filter((tx) =>
          role === "buyer" ? tx.buyer_id : tx.seller_id,
        )}
        rowKey="trade_id"
        pagination={{
          pageSize: 10,
        }}
      />
    </FlexDiv>
  );
}
