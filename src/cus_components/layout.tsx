'use client';

import React from "react";
import { Toaster } from "react-hot-toast";

// Components
import { AdaptiveBackground } from '@/components/background';
import { Header, HeaderTitle } from "@/components/header";

// states
import { useLayoutStateStore } from "@/state/layoutState";

// configs
import * as gene_config from '@/config/general';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

/**
 * A component used as global layout, with additional configuration and responsive ability 
 * which renders on client-side.
 */
export function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  // use layout store
  const isHeaderVisible = useLayoutStateStore((st) => st.showHeader);
  // this is used to trigger layout header refresh
  const title = useLayoutStateStore((st) => st.title);
  let getTitle = useLayoutStateStore((st) => st.getHeaderDispalyTitle);

  return (
    <AdaptiveBackground>
      <Toaster />
      {isHeaderVisible && <Header><HeaderTitle>{getTitle()}</HeaderTitle></Header>}
      {children}
    </AdaptiveBackground>
  );
}