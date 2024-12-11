"use client";
import { useEffect, useState, useLayoutEffect, CSSProperties } from "react";
import { useSearchParams } from "next/navigation";

// Components
import { FlexDiv, Center } from "@/components/container";
import { LoadingPage, LoadingSkeleton } from "@/components/error";
import { Title } from "@/components/title";
import { PageSegment } from "@/cus_components/pages";
import { ContactInfoItem } from "@/cus_components/contact_info";
import { ItemEditForm } from "@/cus_components/item";

import {
  Avatar,
  Typography,
  Form,
  Button,
  Input,
  Select,
  Space,
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
import {
  useUserItems,
  useItemDetailedInfo,
  ItemOut,
  ItemOutWithId,
  addItem,
  editItem,
} from "@/api/item";

export function Client() {
  const params = useSearchParams();
  const itemIdParam = params.get("item_id");

  const { data: userItems, isLoading } = useUserItems();
  const { isLoading: itemDetailIsLoading, data: itemDetail } =
    useItemDetailedInfo(itemIdParam);

  if (userItems === undefined) {
    return <LoadingPage></LoadingPage>;
  }

  if (isLoading) {
    return <LoadingPage></LoadingPage>;
  }

  if (itemIdParam !== null && itemDetailIsLoading) {
    return <LoadingPage></LoadingPage>;
  }

  let titleText = "发布新物品";
  if (itemIdParam !== null) {
    titleText = "编辑物品";
  }

  /**
   * Handle submit of ItemEditForm, either add new item or update an item
   *
   * Determine operation type (add/edit) based on if the item_id==-1
   */
  async function handleSubmit(info: ItemOutWithId) {
    try {
      if (info.item_id !== -1) {
        // Update existing item
        const res = await editItem(info);
        toast.success("物品信息更新成功");
      } else {
        // Add new item
        const res = await addItem(info);
        toast.success("物品发布成功");
      }
    } catch (e) {
      errorPopper(e);
    }
  }

  return (
    // Scrolling Behaviour is handled by parent Layout
    <FlexDiv
      expand
      className="w-full flex-col items-center justify-start gap-4 py-4 pr-4"
    >
      {/* Title Part  */}
      <Title>{titleText}</Title>

      {/* Forms */}
      <ItemEditForm
        onSubmit={handleSubmit}
        // pass init value if exists
        initValue={itemIdParam ? itemDetail : undefined}
      ></ItemEditForm>
    </FlexDiv>
  );
}
