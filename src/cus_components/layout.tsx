'use client';

import React from "react";
import { Toaster } from "react-hot-toast";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import Link from "next/link";

// Components
import { AdaptiveBackground } from '@/components/background';
import { Header } from "@/components/header";
import { FlexDiv } from "@/components/container";
import { Divider } from 'antd';

// states
import { useLayoutState } from "@/states/layoutState";
import { useStore } from "@/states/useStore";

// configs
import * as gene_config from '@/config/general';

// Tools
import { classNames } from "@/tools/css_tools";



interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

/**
 * A component used as global layout, with additional configuration and responsive ability 
 * which renders on client-side.
 */
export function ResponsiveLayout({ children }: ResponsiveLayoutProps) {

  // use layout store
  const isHeaderVisible = useLayoutState((st) => st.showHeader);
  // this is used to trigger layout header refresh


  return (
    <AntdRegistry>
      <AdaptiveBackground>
        <Toaster />
        {isHeaderVisible == true && <CusHeader></CusHeader>}
        {children}
      </AdaptiveBackground>
    </AntdRegistry>
  );
}

function CusHeader() {
  const title = useLayoutState((st) => st.title);

  return (
    <Header>
      <FlexDiv className={classNames(
        'flex-row gap-x-2',
        'items-center'
      )}>
        {/* Website Icon Title */}
        <Link href={'/'}>
          <FlexDiv className={classNames('flex-row items-center justify-start hover:scale-[0.98] gap-x-2 transition-all')}>
            {/* Icon */}
            <img src='/assets/icon.svg' alt="Site Icon" width={40} height={40} />
            <h1 className={classNames(
              "font-light text-2xl text-primary dark:text-primary-light hidden md:flex",
            )}>{gene_config.appName}</h1>
          </FlexDiv>
        </Link>

        {title && <Divider type='vertical' />}
        {title && <h2 className={classNames('text-xl text-light text-black/50 dark:text-white/50')}>{title}</h2>}
      </FlexDiv>
    </Header>
  );
}