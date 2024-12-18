"use client";
import { useEffect, useState, useLayoutEffect, CSSProperties } from "react";
import * as dayjs from "dayjs";

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
import { TransactionStateTag } from "@/cus_components/tag";

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
import { useGetMe, useGetMeForce } from "@/api/auth";
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
  TradeRecordIn,
  TradeRecordOut,
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
  type: "active" | "success" | "pending";
}

function TransactionTable() {
  const [role, setRole] = useState<FilterOptions["role"]>("buyer");
  const [type, setType] = useState<FilterOptions["type"]>("active");
  const { data: transactions, mutate } = useTradeRecords([type]);

  const { data: myInfo } = useGetMeForce();

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
  const columns: ColumnsType<TradeRecordIn> = [
    {
      title: "交易ID",
      dataIndex: "trade_id",
      key: "trade_id",
      render: (_) => <p className="font-mono">{_}</p>,
    },
    {
      title: "物品ID",
      dataIndex: "item.item_id",
      key: "item_id",
      render: (_, rec) => <p className="font-mono">{rec.item.item_id}</p>,
    },
    {
      title: "状态",
      dataIndex: "state",
      align: "center",
      key: "state",
      render: (value, record) => {
        return (
          <FlexDiv className="w-full items-center justify-center">
            <TransactionStateTag state={record.state}></TransactionStateTag>
          </FlexDiv>
        );
      },
    },
    {
      title: "创建时间",
      dataIndex: "created_time",
      key: "created_time",
      render: (timestamp) =>
        (dayjs as any)(timestamp).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "更新时间",
      dataIndex: "updated_time",
      key: "updated_time",
      render: (timestamp) =>
        (dayjs as any)(timestamp).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "操作",
      key: "actions",
      dataIndex: "item",
      render: (_, record) => (
        <Space>
          {role === "seller" && record.state === "pending" && (
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
          {role === "buyer" && record.state === "processing" && (
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
              { label: "已完成", value: "success" },
              { label: "待处理", value: "pending" },
            ]}
            optionType="button"
          />
        </Space>
      </Space>

      {/* Transactions Table */}
      <Table
        columns={columns}
        dataSource={transactions?.filter(function (tx) {
          let roleFilterRes: boolean = false;
          let typeFilterRes: boolean = false;

          if (role === "buyer") {
            roleFilterRes = tx.buyer.user_id === myInfo?.user_id;
          } else {
            roleFilterRes = tx.buyer.user_id !== myInfo?.user_id;
          }

          if (type === "pending") {
            typeFilterRes = tx.state === "pending";
          } else if (type === "active") {
            typeFilterRes = tx.state === "pending" || tx.state === "processing";
          } else {
            typeFilterRes = tx.state === "success";
          }

          return roleFilterRes && typeFilterRes;
        })}
        rowKey="trade_id"
        pagination={{
          pageSize: 10,
        }}
      />
    </FlexDiv>
  );
}
