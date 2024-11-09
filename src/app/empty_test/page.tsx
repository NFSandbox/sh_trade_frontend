import { Skeleton } from "antd";
import { FlexDiv, Center } from "@/components/container";
import { LoadingPage } from "@/components/error";

import { classNames } from "@/tools/css_tools";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return <LoadingPage></LoadingPage>;
}
