import { Skeleton } from "antd";
import { FlexDiv, Center } from "@/components/container";

import { classNames } from "@/tools/css_tools";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <FlexDiv
      expand
      className={classNames("flex-col items-center justify-start", "p-4")}
    >
      <FlexDiv className="w-full max-w-[50rem] flex-col items-center justify-center gap-4">
        <Skeleton active />
        <Skeleton active />
      </FlexDiv>
    </FlexDiv>
  );
}
