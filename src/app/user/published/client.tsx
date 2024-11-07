"use client";
import { useEffect, useState, useLayoutEffect, CSSProperties } from "react";

// Components
import { FlexDiv, Center } from "@/components/container";
import { LoadingPage, LoadingSkeleton } from "@/components/error";
import { Avatar, Typography, Form, Button, Input, Select, Space } from "antd";
const { useForm } = Form;
import { Title } from "@/components/title";
const { Paragraph } = Typography;
import { PageSegment } from "@/cus_components/pages";
import { ContactInfoItem } from "@/cus_components/contact_info";
import {
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineQq,
  AiOutlineWechat,
  AiOutlineDelete,
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
import { useUserItems } from "@/api/item";

export function Client() {
  const { data: userItems } = useUserItems();

  return (
    <FlexDiv>
      <pre>{JSON.stringify(userItems ?? "No Items Data", undefined, " ")}</pre>
    </FlexDiv>
  );
}
