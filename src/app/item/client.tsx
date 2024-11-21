"use client";
import { useEffect, useLayoutEffect } from "react";
import { useSearchParams } from "next/navigation";

// Components
import { FlexDiv, Center } from "@/components/container";
import { Title } from "@/components/title";
import { Button, Input } from "antd";
import { ErrorCard, LoadingPage } from "@/components/error";

// States
import { useLayoutState, useHeaderTitle } from "@/states/layoutState";
import { useSettingsState } from "@/states/settingsState";
import { useStore } from "@/tools/use_store";

// Api
import { useItemDetailedInfo, ItemDetailedIn, ItemIn } from "@/api/item";

// Tools
import { classNames } from "@/tools/css_tools";
import { errorPopper } from "@/exceptions/error";

export function Client() {
  const params = useSearchParams();
  const itemId = params.get("item_id");

  // Invalid Item ID
  if (itemId === null || itemId === undefined) {
    return (
      <ErrorCard
        title="无效物品"
        description="请确认访问的链接中是否包含有效的物品编号"
      ></ErrorCard>
    );
  }

  let { data, isLoading, error } = useItemDetailedInfo(itemId);

  // Loading...
  if (isLoading) {
    return <LoadingPage></LoadingPage>;
  }

  if (error) {
    errorPopper(error);
  }

  // Not loading, not error, then data must be valid after this point
  data = data!;

  return (
    // Root FlexDiv (Auto Scroll)
    <FlexDiv
      expand
      className={classNames(
        "flex-col gap-4 justify-start items-center",
        "bg-fgcolor dark:bg-fgcolor-dark",
        "overflow-auto",
        "pt-4" // Initial top padding to avoid content too close to header bar.
      )}
    >
      <FlexDiv
        className={classNames(
          "flex-col gap-4 justify-start items-start",
          "w-full max-w-[50rem]"
        )}
      >
        {/* Header */}
        <ItemPageHeaderPart itemInfo={data}></ItemPageHeaderPart>
      </FlexDiv>
    </FlexDiv>
  );
}

interface ItemInfoProps {
  itemInfo: ItemIn;
}

/**
 * Internal component.
 *
 * Show series of basic header info of an item, for example
 * the publish time, item name, tag, publisher etc.
 */
function ItemPageHeaderPart(props: ItemInfoProps) {
  const { itemInfo } = props;

  return (
    // Header Root Flex Div
    <FlexDiv
      className={classNames(
        "flex-col gap-y-2 justify-start items-start",
        "mark-item-info-header"
      )}
    >
      <Title>{itemInfo.name}</Title>
    </FlexDiv>
  );
}
