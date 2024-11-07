"use client";
import { useEffect, useLayoutEffect } from "react";

// Components
import { FlexDiv, Center } from "@/components/container";
import { Button, Input } from "antd";

// States
import { useLayoutState, useHeaderTitle } from "@/states/layoutState";
import { useSettingsState } from "@/states/settingsState";
import { useStore } from "@/tools/use_store";

export function Client() {
  return (
    <Center>
      <h1>User Page Test</h1>
    </Center>
  );
}
