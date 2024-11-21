"use client";
import { useEffect, useLayoutEffect } from "react";

// Components
import { FlexDiv, Center } from "@/components/container";
import { Button, Input } from "antd";

// States
import { useLayoutState, useHeaderTitle } from "@/states/layoutState";
import { useSettingsState } from "@/states/settingsState";
import { useStore } from "@/tools/use_store";

export function LayoutTests() {
  const setHeaderVisibility = useLayoutState((st) => st.setShowHeader);
  const state = useStore(useSettingsState, (st) => st);
  const setTitle = useLayoutState((st) => st.setTitle);

  // Page title
  useHeaderTitle("Developer Test Dashboard");

  const setDarkMode = useSettingsState((st) => st.setDarkModeSetting);

  function handleTitleChange(v: any) {
    try {
      const str = v["target"]["value"] as string;
      setTitle(str);
    } catch (e) {
      return;
    }
  }

  return (
    <FlexDiv className="flex-col">
      <Input onChange={handleTitleChange} />
      <Button
        onClick={() => {
          setHeaderVisibility(true);
        }}
      >
        Show Header
      </Button>
      <Button
        onClick={() => {
          setHeaderVisibility(false);
        }}
      >
        Hide Header
      </Button>
      <pre>{JSON.stringify(state ?? "Loading...", undefined, " ")}</pre>
      <Button
        onClick={() => {
          setDarkMode("light");
        }}
      >
        Light
      </Button>
      <Button
        onClick={() => {
          setDarkMode("dark");
        }}
      >
        Dark
      </Button>
      <Button
        onClick={() => {
          setDarkMode("auto");
        }}
      >
        Auto
      </Button>
    </FlexDiv>
  );
}
