import { FlexDiv, Container } from "@/components/container";
import Link from "next/link";
import { classNames } from "@/tools/css_tools";
import React, { ReactNode } from "react";
import { setDefault } from "@/tools/set_default";
import { Tooltip } from "antd";

interface ColoredTagProps {
  /**
   * Background color tailwind CSS derivative.
   *
   * Use `bg-primary` as default.
   */
  bgTwCss?: string;
  /**
   * Tooltip text of this tag
   */
  toolTip?: string;
  children: React.ReactNode;
}

/**
 * A reusable UI component that displays a colored tag
 * with optional tooltip functionality. It uses Tailwind CSS and Ant Design's `Tooltip`.
 */

export function ColoredTag(props: ColoredTagProps) {
  let content = (
    <FlexDiv
      className={classNames(
        "flex-none rounded-2xl px-3 py-1",
        "items-center justify-center text-center",
        props.bgTwCss ?? "bg-primary",
        "text-white text-[12px]",
      )}
    >
      {props.children}
    </FlexDiv>
  );

  if (props.toolTip) {
    content = <Tooltip title={props.toolTip}>{content}</Tooltip>;
  }

  return content;
}
