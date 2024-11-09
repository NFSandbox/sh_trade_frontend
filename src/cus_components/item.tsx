"use client";

import React, { ReactNode } from "react";
import Link from "next/link";

// Supertokens
// import SuperTokens from 'supertokens-web-js';
import SuperTokens from "supertokens-web-js";
import Session from "supertokens-web-js/recipe/session";
import EmailPassword from "supertokens-web-js/recipe/emailpassword";

// Components
import { Header } from "@/components/header";
import { Center, Container, FlexDiv } from "@/components/container";
import { Divider, Popover, Avatar, Button, ButtonProps } from "antd";

// Icons
import { AiOutlineUser, AiOutlineNotification } from "react-icons/ai";
import { IoMdNotificationsOutline } from "react-icons/io";
import { PiSignOut } from "react-icons/pi";
import { AiOutlineInbox } from "react-icons/ai";
import { IoIosMore } from "react-icons/io";
import { AiFillClockCircle, AiOutlineClockCircle } from "react-icons/ai";

// Apis
import { getMe, useGetMe } from "@/api/auth";
import { ItemIn } from "@/api/item";

// states
import { useLayoutState } from "@/states/layoutState";

// configs
import * as gene_config from "@/config/general";

// Tools
import { classNames } from "@/tools/css_tools";
import { errorPopper } from "@/exceptions/error";
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
  const fixedWidthTw = "w-[15rem] flex-none";
  const dynamicWidthTw = "w-full flex-auto";

  let { itemInfo, fixedWidth, clickable } = props;
  fixedWidth = setDefault(fixedWidth, true);
  clickable = setDefault(clickable, true);

  // Final width tailwind to use
  const widthTw = fixedWidth ? fixedWidthTw : dynamicWidthTw;

  // dayjs object to display
  const pubTimeDayJs = (dayjs as any)(itemInfo.created_time);
  const pubTimeStr = pubTimeDayJs.format("M/DD");
  const pubTimeToNowDiffDays = 0 - pubTimeDayJs.diff((dayjs as any)(), "day");

  let content = (
    <FlexDiv
      className={classNames(
        widthTw,
        // Spacing
        "flex-col justify-start items-start text-start",
        // Rounded
        "rounded-2xl",
        // Hover effect when clickable
        clickable
          ? "hover:bg-bgcolor/50 dark:hover:bg-bgcolor-dark/50 transition-all"
          : ""
        // Border
        // "border-bgcolor dark:bg-bgcolor-dark border-2"
      )}
    >
      {/* Picture Part */}
      <ItemCardPicture></ItemCardPicture>

      {/* Text Content Part */}
      <FlexDiv className="flex-col w-full py-2 px-1">
        {/* Item Name  */}
        <h2 className="font-bold">{itemInfo.name ?? "暂无物品标题"}</h2>

        {/* Item Price & More Button */}
        <FlexDiv className="flex-row flex-none justify-between items-center">
          {/* Price  */}
          <FlexDiv className="flex-none flex-row justify-start items-baseline">
            <FlexDiv className="flex-none w-4 items-center justify-center">
              <p className="opacity-50 text-sm">$</p>
            </FlexDiv>
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
        <FlexDiv className="flex-row flex-none items-center opacity-50">
          <FlexDiv className="flex-none w-4 justify-center">
            <AiOutlineClockCircle className="inline"></AiOutlineClockCircle>
          </FlexDiv>
          <p>
            {pubTimeStr} ({pubTimeToNowDiffDays} 天前)
          </p>
        </FlexDiv>
      </FlexDiv>
    </FlexDiv>
  );

  // Add button wrapper if clickable
  if (clickable) {
    content = <button className={widthTw}>{content}</button>;
  }

  return content;
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
  let { imgId } = props;

  return (
    <div
      className={classNames(
        "w-full h-[8rem] place-items-center place-content-center bg-primary/50",
        "rounded-xl"
      )}
    >
      <p className="text-white font-bold font-mono">Image Placeholder</p>
    </div>
  );
}
