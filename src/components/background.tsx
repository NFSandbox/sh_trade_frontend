"use client";

import { useEffect, useState } from "react";

import { ConfigProvider, theme } from "antd";

import { FlexDiv } from "@/components/container";
import { classNames } from "@/tools/css_tools";
import { setDefault } from "@/tools/set_default";

// States
import { useSettingsState } from "@/states/settingsState";
import { useStore } from "@/states/useStore";

interface AdaptiveBackgroundProps {
  /**
   * If this background is used as the root div and will be fullScreen?
   */
  fullScreen?: boolean;
  children?: React.ReactNode;
}

/**
 * An adaptive background component could change based on current dark mode.
 *
 * Also, this component will deal with the AntDesign package theme settings to make it concur
 * with user settings.
 */
export function AdaptiveBackground(props: AdaptiveBackgroundProps) {
  const lightTheme = {
    algorithm: theme.defaultAlgorithm,
  };
  const darkTheme = {
    token: {
      colorPrimary: "#0a79aa",
      colorInfo: "#0a79aa",
      colorBgBase: "#0c0f18",
    },
    algorithm: theme.darkAlgorithm,
  };

  const darkMode = useSettingsState((st) => st.darkMode);
  const [antdTheme, setAntdTheme] = useState(lightTheme);
  const darkModeSetting = useSettingsState((st) => st.darkModeSetting);
  const setDarkModeProperty = useSettingsState((st) => st.setDarkModeProperty);

  /**
   * Trigger when system color scheme changed.
   *
   * Update darkMode property state if necessary.
   */
  function colorSchemaChangeHandler(e: Event) {
    // not in auto mode, return
    const _darkModeSetting = useSettingsState.getState().darkModeSetting;
    if (_darkModeSetting != "auto") {
      return;
    }

    console.log("Update darkmode property since auto and scheme changed...");

    let darkMode = (e as any).matches;
    setDarkModeProperty(darkMode);
  }

  /**
   * Set init darkmode state. Add CSS color scheme change callbacks.
   */
  useEffect(() => {
    // Add event listener
    if (typeof window !== "undefined") {
      window
        .matchMedia("(prefers-color-scheme:dark)")
        .addEventListener("change", colorSchemaChangeHandler);
      return window
        .matchMedia("(prefers-color-scheme:dark)")
        .removeEventListener("change", colorSchemaChangeHandler);
    }
  }, []);

  /**
   * Update documeny body className once darkmode property changed.
   */
  useEffect(
    function () {
      // update className of body
      if (darkMode) window.document.body.classList.add("dark");
      else window.document.body.classList.remove("dark");

      // update antd theme
      if (darkMode) setAntdTheme(darkTheme);
      else setAntdTheme(lightTheme);
    },
    [darkMode],
  );

  let { fullScreen } = props;
  fullScreen = setDefault(fullScreen, true);

  return (
    <FlexDiv
      className={classNames(
        "flex-none",
        fullScreen ? "h-screen w-screen" : "h-full w-full",
        "bg-bgcolor dark:bg-bgcolor-dark",
        "flex-col items-center justify-start",
        "dark:[color-scheme:dark]",
        "text-sm",
        "text-black dark:text-white",
      )}
    >
      <ConfigProvider theme={antdTheme}>{props.children}</ConfigProvider>
    </FlexDiv>
  );
}
