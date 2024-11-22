"use client";

import { Skeleton, Button } from "antd";

import { FlexDiv, Center } from "@/components/container";
import { ErrorCard } from "@/components/error";

import { classNames } from "@/tools/css_tools";

import { useLayoutState } from "@/states/layoutState";
import { useEffect } from "react";

export default function NotFound() {
  const setTitle = useLayoutState((st) => st.setTitle);

  useEffect(function () {
    setTitle(undefined);
  }, []);

  // You can add any UI inside Loading, including a Skeleton.
  return (
    <Center>
      <FlexDiv
        className={classNames("flex-col items-center justify-center gap-y-2")}
      >
        <ErrorCard
          hasColor={false}
          title="页面不存在 (404)"
          description="您正在尝试访问的页面并不存在，请检查您访问的网址是否正确。"
        />
        <Button type="link" href="/">
          回到主页
        </Button>
      </FlexDiv>
    </Center>
  );
}
