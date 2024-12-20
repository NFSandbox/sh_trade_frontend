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
import { useGetMe } from "@/api/auth";
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
import { LoadingSkeleton } from "@/components/error";

export function LayoutTests() {
  useHeaderTitle(undefined);

  const { data: recentItems, isLoading: recentItemsIsLoading } =
    useRecentlyPublished();

  const { tags, isLoading: recentTagIsLoading } = useRecentlyActiveTags();

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
        {/* Quick Action Bar  */}
        <FlexDiv className={classNames("w-full flex-none flex-row gap-4")}>
          <QuickActionBlock
            text="搜索物品"
            icon={<AiOutlineSearch size={20}></AiOutlineSearch>}
            href="/search"
            className="bg-primary/20"
          ></QuickActionBlock>

          <QuickActionBlock
            text="发布物品"
            icon={<RiInboxUnarchiveLine size={20}></RiInboxUnarchiveLine>}
            href="/user/published/add"
            className="bg-yellow-500/20"
          ></QuickActionBlock>
        </FlexDiv>

        {/* Popular Tags  */}
        <Title>热门标签</Title>
        {recentTagIsLoading && <LoadingSkeleton></LoadingSkeleton>}
        {tags && <ItemTagsGrid tags={tags}></ItemTagsGrid>}

        {/* Recently Published  */}
        <Title>近期发布</Title>
        {recentItemsIsLoading && <LoadingSkeleton></LoadingSkeleton>}
        {recentItems && (
          <AdaptiveItemGrid itemInfoList={recentItems}></AdaptiveItemGrid>
        )}
      </FlexDiv>
    </FlexDiv>
  );
}

interface QuickActionBlockProps {
  text: string;
  icon: React.ReactNode;
  className?: string;
  href: string;
}

function QuickActionBlock(props: QuickActionBlockProps) {
  return (
    <Link href={props.href} className="flex w-full">
      <FlexDiv
        className={classNames(
          "flex-none",
          "min-h-[5rem] w-full px-4 hover:opacity-80",
          "items-center justify-center",
          "text-lg font-bold",
          "rounded-2xl transition-all",
          "hover:scale-[0.98]",
          props.className ?? "",
        )}
      >
        <p className="pr-2">{props.icon}</p>
        <p>{props.text}</p>
      </FlexDiv>
    </Link>
  );
}
