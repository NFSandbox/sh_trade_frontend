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
          "flex-col justify-center items-center p-2",
          "gap-y-2",
          hasColor ? "bg-fgcolor dark:bg-fgcolor-dark rounded-xl" : "",
          props.className ?? ""
        )}
      >
        {/*Error Title Part*/}
        <p
          className={classNames(
            "font-bold text-black/70 dark:text-white/90",
            "bg-black/10 dark:bg-white/10 px-2 py-1 rounded-md"
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
    <FlexDiv className="flex-auto flex-col h-full w-full justify-start items-center p-4">
      {/* Inner Flex, Controls the max width of skeleton UI */}
      <FlexDiv className="flex-col gap-4 w-full max-w-[50rem] justify-start items-center">
        <LoadingSkeleton />
        <LoadingSkeleton />
      </FlexDiv>
    </FlexDiv>
  );
}
