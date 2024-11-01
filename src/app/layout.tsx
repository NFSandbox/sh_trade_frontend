import { Inter } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

import React from "react";
import { Toaster } from "react-hot-toast";
import { AntdRegistry } from '@ant-design/nextjs-registry';



// Components
import { AdaptiveBackground } from '@/components/background';
import { ResponsiveLayout } from "@/cus_components/layout";

// Configs
import * as gene_config from '@/config/general';


export const metadata: Metadata = {
  title: gene_config.appName,
  description: gene_config.appDesc,
};


export default function RootLayout(
  {
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdRegistry>
          <AdaptiveBackground>
            <Toaster />
            {/* {children} */}
            <ResponsiveLayout>{children}</ResponsiveLayout>
          </AdaptiveBackground>
        </AntdRegistry>

      </body>
    </html>
  );
}
