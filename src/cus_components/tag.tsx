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

  if (state === "pending") {
    bgTwCss = "bg-yellow";
    dispText = "待处理";
  } else if (state === "processing") {
    bgTwCss = "bg-blue";
    dispText = "处理中";
  } else if (state === "success") {
    bgTwCss = "bg-green";
    dispText = "已完成";
  } else {
    bgTwCss = "bg-gray"; // Fallback if state is invalid or missing
    dispText = "未知状态";
  }

  return (
    <ColoredTag bgTwCss={bgTwCss} toolTip={state}>
      {dispText}
    </ColoredTag>
  );
}
