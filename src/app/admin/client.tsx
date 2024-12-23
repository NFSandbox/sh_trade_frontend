"use client";

// Components
import { FlexDiv, Center } from "@/components/container";
import { Button, Input } from "antd";
import { AiOutlineSearch } from "react-icons/ai";
import { RiInboxUnarchiveLine } from "react-icons/ri";

// States
import { useLayoutState } from "@/states/layoutState";
import { useEffect, useLayoutEffect } from "react";
import { useHeaderTitle } from "@/states/layoutState";

// Api
import { useGetMe, useGetMeForce } from "@/api/auth";
import toast from "react-hot-toast";
import {
  getRecentlyPublished,
  useRecentlyActiveTags,
  useRecentlyPublished,
} from "@/api/item";

// Err
import { errorPopper } from "@/exceptions/error";

// Tools
import { classNames } from "@/tools/css_tools";
import Link from "next/link";
import { Title } from "@/components/title";
import { AdaptiveItemGrid, ItemTagsGrid } from "@/cus_components/item";
import { ErrorCard, LoadingSkeleton } from "@/components/error";

export function LayoutTests() {
  useHeaderTitle("系统管理");

  const { data: meInfo, isLoading: meInfoIsLoading } = useGetMe();

  const { data: recentItems, isLoading: recentItemsIsLoading } =
    useRecentlyPublished();

  if (meInfoIsLoading) {
    return <LoadingSkeleton></LoadingSkeleton>;
  }

  // No admin role, error
  if (!meInfo?.role_name_list.some((roleName) => roleName === "admin")) {
    return (
      <ErrorCard
        title="无访问权限"
        description="您的账户暂无权限访问此页面"
      ></ErrorCard>
    );
  }

  return (
    <FlexDiv
      expand
      className={classNames(
        "flex-col items-center justify-start gap-4 p-2",
        "bg-fgcolor dark:bg-fgcolor-dark",
        "overflow-auto",
        "pt-4", // Initial top padding to avoid content too close to header bar.
      )}
    >
      <FlexDiv expand className="max-w-[50rem] flex-none flex-col gap-4">
        {/* Recently Published  */}
        <Title>审查最近发布的物品</Title>
        {recentItemsIsLoading && <LoadingSkeleton></LoadingSkeleton>}
        {recentItems && (
          <AdaptiveItemGrid itemInfoList={recentItems}></AdaptiveItemGrid>
        )}
      </FlexDiv>
    </FlexDiv>
  );
}
