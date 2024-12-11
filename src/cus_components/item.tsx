"use client";

import React, { CSSProperties } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";

// Components
import { FlexDiv } from "@/components/container";
import { Button, Form, Input, InputNumber, Select, Drawer, Upload } from "antd";

// Icons
import { IoIosMore } from "react-icons/io";
import {
  AiOutlineClockCircle,
  AiOutlinePlusCircle,
  AiOutlineInbox,
} from "react-icons/ai";

// Apis
import {
  ItemDetailedIn,
  ItemIn,
  ItemOut,
  ItemOutWithId,
  TagIn,
} from "@/api/item";

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

  /**
   * Show an extra grid item to prompt user add new item.
   */
  showAddNewItem?: boolean;
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
      <FlexDiv style={autoItemGridCss} className={classNames()}>
        {itemInfoList.map(function (itemInfo) {
          return (
            <ItemCard
              key={itemInfo.item_id}
              itemInfo={itemInfo}
              clickable={true}
            ></ItemCard>
          );
        })}

        {/* Add New Item Grid Item  */}
        {props.showAddNewItem && (
          <Link
            href="/user/published/add"
            className={classNames(
              "h-[8rem] w-full place-content-center place-items-center bg-bgcolor/50 dark:bg-bgcolor-dark/50",
              "rounded-xl",
              "hover:opacity-80",
            )}
          >
            <div className="place-items-center opacity-70">
              <AiOutlinePlusCircle size={35}></AiOutlinePlusCircle>
              <p className="pt-2">添加新物品</p>
            </div>
          </Link>
        )}
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
    <p
      className={classNames(
        "px-2",
        "rounded-lg bg-primary/70 text-white font-mono text-sm",
      )}
    >
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

interface ItemEditFormProps {
  onSubmit: (itemInfo: ItemOutWithId) => any;
  initValue?: ItemDetailedIn;
}

/**
 * A React component to show a form to edit item info.
 *
 * Returned item id will be -1 if `item_id` is not specified in initValue.
 */
export function ItemEditForm(props: ItemEditFormProps) {
  const { onSubmit, initValue } = props;

  // Submit handler
  const handleSubmit = (values: any) => {
    const { name, description, price, tags } = values;
    const itemData: ItemOutWithId = {
      item_id: initValue?.item_id || -1, // Assuming if it's an update, we have item_id
      name,
      description,
      price,
      tags,
    };
    onSubmit(itemData);
  };

  return (
    <Form
      style={{ width: "100%" }}
      onFinish={handleSubmit}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 16 }}
      initialValues={{
        name: initValue?.name || "",
        description: initValue?.description || "",
        price: initValue?.price || 0,
        tags: initValue?.tag_name_list || [],
      }}
    >
      {/* Item Name */}
      <Form.Item
        label="物品名称"
        name="name"
        rules={[{ required: true, message: "请输入物品名称!" }]}
      >
        <Input />
      </Form.Item>

      {/* Item Description */}
      <Form.Item
        label="物品描述"
        name="description"
        rules={[{ required: true, message: "请输入物品描述!" }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      {/* Item Price */}
      <Form.Item
        label="价格"
        name="price"
        rules={[
          { required: true, message: "请输入价格!" },
          { type: "number", min: 0, message: "价格必须为正数!" },
        ]}
      >
        <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
      </Form.Item>

      {/* Item Tags */}
      <Form.Item
        label="标签"
        name="tags"
        rules={[{ required: true, message: "请至少选择一个标签!" }]}
      >
        <Select
          mode="tags"
          placeholder="按 Enter 键添加标签"
          style={{ width: "100%" }}
        ></Select>
      </Form.Item>

      <Form.Item label="物品图片">
        <Upload.Dragger {...props}>
          <div className="ant-upload-drag-icon w-full place-items-center justify-items-center">
            <AiOutlineInbox size={50} className="opacity-70" />
          </div>
          <p className="ant-upload-text">
            点击 或者 拖拽文件到此处 来上传物品图片
          </p>
          <p className="ant-upload-hint">
            请务必确保上传的物品图片符合网站规范
          </p>
        </Upload.Dragger>
      </Form.Item>

      {/* Submit Button */}
      <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <Button type="primary" htmlType="submit" block>
          完成
        </Button>
      </Form.Item>
    </Form>
  );
}
