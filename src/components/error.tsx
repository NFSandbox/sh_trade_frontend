"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { Skeleton } from "antd";

import { classNames } from "@/tools/css_tools";
import { setDefault } from "@/tools/set_default";

import { FlexDiv, Container, Center } from "@/components/container";

interface ErrorCardProps {
  title: string;
  description?: string;
  hasColor?: boolean;
  className?: string;
}

export function ErrorCard(props: ErrorCardProps) {
  let hasColor = props.hasColor;
  hasColor = setDefault(hasColor, true);
  return (
    <Center>
      <FlexDiv
        expand
        className={classNames(
          "flex-col items-center justify-center p-2",
          "gap-y-2",
          hasColor ? "rounded-xl bg-fgcolor dark:bg-fgcolor-dark" : "",
          props.className ?? "",
        )}
      >
        {/*Error Title Part*/}
        <p
          className={classNames(
            "font-bold text-black/70 dark:text-white/90",
            "rounded-md bg-black/10 px-2 py-1 dark:bg-white/10",
          )}
        >
          {props.title}
        </p>

        {/*Error Description Part (If have description)*/}
        {props.description !== undefined && (
          <p className={classNames("text-black/50 dark:text-white/50")}>
            {props.description}
          </p>
        )}
      </FlexDiv>
    </Center>
  );
}

export function LoadingSkeleton() {
  return (
    <FlexDiv className={classNames("w-full max-w-[50rem] p-4")}>
      <Skeleton active />
    </FlexDiv>
  );
}

/**
 * React Component, shows a loading skeleton in a expand flex area, usually a page.
 *
 * This component will used up all sized given by parent.
 */
export function LoadingPage() {
  return (
    // Outer Flex, Make sure skeleton UI shows at the center of the screen
    <FlexDiv className="h-full w-full flex-auto flex-col items-center justify-start p-4">
      {/* Inner Flex, Controls the max width of skeleton UI */}
      <FlexDiv className="w-full max-w-[50rem] flex-col items-center justify-start gap-4">
        <LoadingSkeleton />
        <LoadingSkeleton />
      </FlexDiv>
    </FlexDiv>
  );
}
