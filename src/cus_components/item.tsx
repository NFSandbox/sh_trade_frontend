"use client";

import React, { CSSProperties } from "react";
import Link from "next/link";

// Components
import { FlexDiv } from "@/components/container";
import { Button } from "antd";

// Icons
import { IoIosMore } from "react-icons/io";
import { AiOutlineClockCircle } from "react-icons/ai";

// Apis
import { ItemIn, TagIn } from "@/api/item";

// Tools
import { classNames } from "@/tools/css_tools";
import { setDefault } from "@/tools/set_default";

import * as dayjs from "dayjs";

interface ItemCardProps {
  itemInfo: ItemIn;

  /**
   * Fix the size of the ItemCard component.
   *
   * Set to false to get a flexible item card which fit the size of
   * it's parent component.
   */
  fixedWidth?: boolean;

  /**
   * If this item card is clickable.
   */
  clickable?: boolean;
}

/**
 * A React component that shows an Item info
 */
export function ItemCard(props: ItemCardProps) {
  const fixedWidthTw = "flex-none w-[15rem]";
  const dynamicWidthTw = "flex-auto w-full";

  let { itemInfo, fixedWidth, clickable } = props;
  fixedWidth = setDefault(fixedWidth, true);
  clickable = setDefault(clickable, true);

  // Final width tailwind to use
  const widthTw = fixedWidth === true ? fixedWidthTw : dynamicWidthTw;

  // dayjs object to display
  const pubTimeDayJs = (dayjs as any)(itemInfo.created_time);
  const pubTimeStr = pubTimeDayJs.format("M/DD");
  const pubTimeToNowDiffDays = 0 - pubTimeDayJs.diff((dayjs as any)(), "day");

  let content = (
    <FlexDiv
      className={classNames(
        "mark-item-flex-box",
        widthTw,
        // Spacing
        "flex-col items-start justify-start text-start",
        // Rounded
        "rounded-2xl",
        // Hover effect when clickable
        clickable
          ? "transition-all hover:bg-bgcolor/50 dark:hover:bg-bgcolor-dark/50"
          : "",
        // Border
        // "border-bgcolor dark:bg-bgcolor-dark border-2"
      )}
    >
      {/* Picture Part */}
      <ItemCardPicture></ItemCardPicture>

      {/* Text Content Part */}
      <FlexDiv className="w-full flex-col px-1 py-2">
        {/* Item Name  */}
        <h2 className="font-bold">{itemInfo.name ?? "暂无物品标题"}</h2>

        {/* Item Price & More Button */}
        <FlexDiv className="flex-none flex-row items-center justify-between">
          {/* Price  */}
          <FlexDiv className="flex-none flex-row items-baseline justify-start">
            {/* Price Symbol  */}
            <FlexDiv className="w-4 flex-none items-center justify-center">
              <p className="text-sm opacity-50">$</p>
            </FlexDiv>
            {/* Price Number  */}
            <span className="text-xl text-primary dark:text-primary-light">
              {itemInfo.price.toFixed(2)}
            </span>
          </FlexDiv>

          {/* More Button  */}
          <div>
            <Button size="small" type="text">
              <IoIosMore size={20}></IoIosMore>
            </Button>
          </div>
        </FlexDiv>

        {/* Published Time  */}
        <FlexDiv className="flex-none flex-row items-center opacity-50">
          {/* Clock Icon  */}
          <FlexDiv className="w-4 flex-none justify-center">
            <AiOutlineClockCircle className="inline"></AiOutlineClockCircle>
          </FlexDiv>

          {/* Days Count  */}
          <p>
            {pubTimeStr} ({pubTimeToNowDiffDays} 天前)
          </p>
        </FlexDiv>
      </FlexDiv>
    </FlexDiv>
  );

  // Add button wrapper if clickable
  if (clickable) {
    // determine url str to item page. do nothing if item-id undefined
    let itemPageLinkStr = "#";
    if (itemInfo.item_id !== undefined) {
      itemPageLinkStr = `/item?item_id=${itemInfo.item_id}`;
    }

    // wrap by link
    content = (
      <Link href={itemPageLinkStr} className={widthTw}>
        {content}
      </Link>
    );
  }

  return content;
}

interface AdaptiveItemGridProps {
  itemInfoList: ItemIn[];
}

/**
 * Components that shows items, which controls the columns count automatically
 * based on the screen size.
 *
 * The auto column number control part use CSS grid auto-
 */
export function AdaptiveItemGrid(props: AdaptiveItemGridProps) {
  const autoItemGridCss: CSSProperties = {
    width: "100%",
    alignItems: "start",
    justifyItems: "center",
    display: "grid",
    gap: "1rem",
    justifyContent: "center",
    gridTemplateColumns: "repeat(auto-fit, 15rem)",
  };

  const { itemInfoList } = props;

  return (
    <FlexDiv className="w-full flex-col items-center justify-start">
      <FlexDiv
        style={autoItemGridCss}
        className={
          classNames()
          // "flex-row flex-wrap items-start justify-start",
          // "gap-4"
        }
      >
        {itemInfoList.map(function (itemInfo) {
          return (
            <ItemCard
              key={itemInfo.item_id}
              itemInfo={itemInfo}
              clickable={true}
            ></ItemCard>
          );
        })}
      </FlexDiv>
    </FlexDiv>
  );
}

interface ItemCardPictureProps {
  imgId?: string;
}

/**
 * Internal.
 *
 * Component used by ItemCard to show the image of the item.
 *
 * Size:
 *
 * The size of this image elements should be cooperates with
 * it's parent's size. Ideally, it changes with parent' size
 * while keeping a certain ratio.
 */
function ItemCardPicture(props: ItemCardPictureProps) {
  const { imgId } = props;

  return (
    <div
      className={classNames(
        "h-[8rem] w-full place-content-center place-items-center bg-primary/50",
        "rounded-xl",
      )}
    >
      <p className="font-mono font-bold text-white">Image Placeholder</p>
    </div>
  );
}

interface ItemTagProps {
  tagInfo: TagIn;
}

/**
 * Component to show a single tag.
 */
export function ItemTag(props: ItemTagProps) {
  return (
    // TODO
    // More detailed info
    <p className={classNames("px-2 py-1", "rounded-lg")}>
      {props.tagInfo.name}
    </p>
  );
}

interface ItemTagsGridProps {
  tags: TagIn[];
}

/**
 * React component to render a list of tags with auto-wrapping.
 */
export function ItemTagsGrid(props: ItemTagsGridProps) {
  return (
    <FlexDiv className={classNames("w-full flex-wrap gap-2")}>
      {props.tags.map((tag) => {
        return <ItemTag tagInfo={tag}></ItemTag>;
      })}
    </FlexDiv>
  );
}
