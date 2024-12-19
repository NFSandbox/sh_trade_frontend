import React from "react";

// Components
import { ColoredTag } from "@/components/tag";

// Api
import { TransactionState } from "@/api/trade";

interface TransactionStateTagProps {
  /**
   * The state of the transaction, used to determine the tag's color and label.
   */
  state: TransactionState;
  /**
   * Optional tooltip to provide additional information about the transaction state.
   */
  toolTip?: string;
}

/**
 * A UI component that displays a tag with a color corresponding to the transaction state.
 *
 * Colors:
 * - `pending`: Yellow background.
 * - `processing`: Blue background.
 * - `complete`: Green background.
 */
export function TransactionStateTag({ state }: TransactionStateTagProps) {
  let bgTwCss;
  let dispText = state as string;
  let dispTooltip = "";

  if (state === "pending") {
    bgTwCss = "bg-primary/50";
    dispText = "待处理";
    dispTooltip = "等待卖家同意";
  } else if (state === "processing") {
    bgTwCss = "bg-primary";
    dispText = "处理中";
    dispTooltip = "等待买家确认交易完成";
  } else if (state === "success") {
    bgTwCss = "bg-green";
    dispText = "已完成";
    dispTooltip = "交易已成功完成";
  } else {
    bgTwCss = "bg-gray"; // Fallback if state is invalid or missing
    dispText = "未知状态";
    dispTooltip = "交易状态无效或未知";
  }

  return (
    <ColoredTag bgTwCss={bgTwCss} toolTip={dispTooltip}>
      {dispText}
    </ColoredTag>
  );
}
