"use client";
import { useEffect, useLayoutEffect } from "react";
import { useSearchParams } from "next/navigation";

// Components
import { FlexDiv, Center } from "@/components/container";
import { Title } from "@/components/title";
import { Alert, Button, Input, Tooltip } from "antd";
import { CusUserBar } from "@/cus_components/user";
import { ItemTagsGrid } from "@/cus_components/item";
import { ErrorCard, LoadingPage } from "@/components/error";
import {
  AiOutlineTag,
  AiOutlineShoppingCart,
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineEdit,
  AiOutlineWarning,
} from "react-icons/ai";
import { Divider } from "antd";

// States
import { useLayoutState, useHeaderTitle } from "@/states/layoutState";
import { useSettingsState } from "@/states/settingsState";
import { useStore } from "@/tools/use_store";

// Api
import { useItemDetailedInfo, ItemDetailedIn, ItemIn, TagIn } from "@/api/item";
import { useGetMe, UserIn } from "@/api/auth";
import { startTransaction } from "@/api/trade";

// Tools
import { classNames } from "@/tools/css_tools";
import { errorPopper } from "@/exceptions/error";
import * as dayjs from "dayjs";
import { promiseToastWithBaseErrorHandling } from "@/tools/general";

export function Client() {
  const params = useSearchParams();
  const itemId = params.get("item_id");
  const setTitle = useHeaderTitle("物品详情");

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

  if (error || data === undefined) {
    if (error.name == "permission_required") {
      return (
        <ErrorCard
          title="未登录账号"
          description="登录AHUER.COM账号以查看详细物品信息"
        ></ErrorCard>
      );
    }
    errorPopper(error);
    return (
      <ErrorCard
        title="无法获取物品信息"
        description={JSON.stringify(error)}
      ></ErrorCard>
    );
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
        <ActionBarPart itemInfo={data}></ActionBarPart>
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

  return <ItemTagsGrid tags={tagList}></ItemTagsGrid>;
}

interface ItemDescPartProps {
  itemInfo: ItemDetailedIn;
}

function ItemDescPart(props: ItemDescPartProps) {
  const { itemInfo } = props;
  const isSold = itemInfo.state === "sold";

  return (
    <FlexDiv className="w-full flex-col items-start justify-start gap-x-2 gap-y-4">
      <Divider></Divider>
      {isSold && (
        <FlexDiv className="w-full flex-none flex-col items-center justify-start">
          <Alert
            closable
            className="w-full self-center"
            message="商品已售出"
            description="该商品已被售出，此页面仅用于归档原物品发布信息。"
            type="info"
            showIcon
          />
        </FlexDiv>
      )}
      <p>{itemInfo.description ?? "此物品暂无描述。"}</p>
    </FlexDiv>
  );
}

interface ActionBarPartProps {
  itemInfo: ItemDetailedIn;
}

function ActionBarPart(props: ActionBarPartProps) {
  const { data: userData } = useGetMe();
  const itemData = props.itemInfo;

  const isSeller = userData?.user_id === itemData.seller.user_id;
  const isItemSold = itemData.state === "sold";
  const isItemValid = itemData.state === "valid";

  let purchaseButtonText = "";
  let purchaseButtonTooptip = "";
  let shouldPurchaseButtonBeDisabled = true;

  if (isSeller) {
    purchaseButtonText = "购买";
    purchaseButtonTooptip = "您是该商品的卖家，无法购买";
  } else if (isItemSold) {
    purchaseButtonText = "物品已售出";
    purchaseButtonTooptip = "该商品已被售出";
  } else if (isItemValid) {
    purchaseButtonText = "购买";
    purchaseButtonTooptip = "向卖家请求购买此物品，卖家同意后即可进行交易";
    shouldPurchaseButtonBeDisabled = false;
  } else {
    purchaseButtonText = "购买";
    purchaseButtonTooptip = "当前物品状态无效，无法购买";
  }

  async function handleStartTransaction() {
    await promiseToastWithBaseErrorHandling(
      startTransaction(itemData.item_id),
      "发起请求中...",
      "购买请求已发出",
    );
  }

  return (
    <FlexDiv className="w-full flex-row items-center justify-between gap-2">
      <FlexDiv className="w-full flex-row items-center gap-2">
        <Tooltip title={purchaseButtonTooptip}>
          <Button
            style={{ width: "100%" }}
            type="primary"
            disabled={shouldPurchaseButtonBeDisabled}
            icon={<AiOutlineShoppingCart size={18}></AiOutlineShoppingCart>}
            onClick={handleStartTransaction}
          >
            {purchaseButtonText}
          </Button>
        </Tooltip>
      </FlexDiv>

      <Button
        disabled={shouldPurchaseButtonBeDisabled}
        icon={<AiOutlineHeart size={18}></AiOutlineHeart>}
      >
        收藏
      </Button>
      {isSeller && (
        <Button
          href={`/user/published/add?item_id=${itemData.item_id}`}
          icon={<AiOutlineEdit size={18}></AiOutlineEdit>}
        >
          编辑
        </Button>
      )}
      <Button danger icon={<AiOutlineWarning size={18}></AiOutlineWarning>}>
        举报
      </Button>
    </FlexDiv>
  );
}
