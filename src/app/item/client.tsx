"use client";
import { useEffect, useLayoutEffect } from "react";
import { useSearchParams } from "next/navigation";

// Components
import { FlexDiv, Center } from "@/components/container";
import { Title } from "@/components/title";
import { Button, Input } from "antd";
import { CusUserBar } from "@/cus_components/user";
import { ErrorCard, LoadingPage } from "@/components/error";
import {
  AiOutlineTag,
  AiOutlineShoppingCart,
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineWarning,
} from "react-icons/ai";
import { Divider } from "antd";

// States
import { useLayoutState, useHeaderTitle } from "@/states/layoutState";
import { useSettingsState } from "@/states/settingsState";
import { useStore } from "@/tools/use_store";

// Api
import { useItemDetailedInfo, ItemDetailedIn, ItemIn, TagIn } from "@/api/item";
import { UserIn } from "@/api/auth";

// Tools
import { classNames } from "@/tools/css_tools";
import { errorPopper } from "@/exceptions/error";
import * as dayjs from "dayjs";

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
        "flex-col items-center justify-start gap-4",
        "bg-fgcolor dark:bg-fgcolor-dark",
        "overflow-auto",
        "pt-4", // Initial top padding to avoid content too close to header bar.
      )}
    >
      <FlexDiv
        className={classNames(
          "p-4",
          "flex-col items-start justify-start gap-4",
          "w-full max-w-[50rem]",
        )}
      >
        {/* Header */}
        <ItemPageHeaderPart itemInfo={data}></ItemPageHeaderPart>

        {/* Item Desc  */}
        <ItemDescPart itemInfo={data}></ItemDescPart>

        {/* Action Bar  */}
        <ActionBarPart></ActionBarPart>
      </FlexDiv>
    </FlexDiv>
  );
}

interface ItemInfoProps {
  itemInfo: ItemDetailedIn;
}

/**
 * Internal component.
 *
 * Show series of basic header info of an item, for example
 * the publish time, item name, tag, publisher etc.
 */
function ItemPageHeaderPart(props: ItemInfoProps) {
  const { itemInfo } = props;
  const { seller, fav_count } = itemInfo;
  const publishedDayJs: dayjs.Dayjs = (dayjs as any)(itemInfo.created_time);
  const pubTimeStr = publishedDayJs.format("YYYY/MM/DD hh:mm");

  return (
    // Header Root Flex Div
    <FlexDiv
      className={classNames(
        "w-full",
        "flex-col items-start justify-start gap-y-2",
        "mark-item-info-header",
      )}
    >
      {/* Item Name  */}
      <Title>{itemInfo.name}</Title>

      {/* Row Display For Pub Time and Seller  */}
      <FlexDiv className="w-full flex-row items-center justify-between">
        {/* Published Time  */}
        <h2 className={classNames("opacity-50")}>发布于: {pubTimeStr}</h2>

        {/* Seller Info  */}
        <HeaderUserInfoPart user={seller}></HeaderUserInfoPart>
      </FlexDiv>

      {/* Tags  */}
      <HeaderTagsPart tagList={itemInfo.tags}></HeaderTagsPart>
    </FlexDiv>
  );
}

interface HeaderUserInfoPartProps {
  user: UserIn;
}

function HeaderUserInfoPart(props: HeaderUserInfoPartProps) {
  const { user } = props;

  return <CusUserBar user={user}></CusUserBar>;
}

interface HeaderTagsPartProps {
  tagList: TagIn[];
}

function HeaderTagsPart(props: HeaderTagsPartProps) {
  const { tagList } = props;

  if (tagList === null) {
    return (
      <p className={classNames("opacity-50")}>
        <AiOutlineTag size={20} className="inline-block"></AiOutlineTag>{" "}
        此物品暂无标签
      </p>
    );
  }

  return <pre>{JSON.stringify(tagList)}</pre>;
}

interface ItemDescPartProps {
  itemInfo: ItemDetailedIn;
}

function ItemDescPart(props: ItemDescPartProps) {
  const { itemInfo } = props;

  return (
    <FlexDiv className="w-full flex-col items-start justify-start gap-1">
      <Divider></Divider>
      <p>{itemInfo.description ?? "此物品暂无描述。"}</p>
    </FlexDiv>
  );
}

function ActionBarPart() {
  return (
    <FlexDiv className="w-full flex-row items-center justify-between gap-2">
      <FlexDiv className="w-full flex-row items-center gap-2">
        <Button
          style={{ width: "100%" }}
          type="primary"
          icon={<AiOutlineShoppingCart size={18}></AiOutlineShoppingCart>}
        >
          购买
        </Button>
        <Button icon={<AiOutlineHeart size={18}></AiOutlineHeart>}>收藏</Button>
      </FlexDiv>

      <Button danger icon={<AiOutlineWarning size={18}></AiOutlineWarning>}>
        举报
      </Button>
    </FlexDiv>
  );
}
