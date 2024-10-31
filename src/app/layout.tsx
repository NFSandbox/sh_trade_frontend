'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';

// Components
import { ResponsiveLayout } from "@/cus_components/layout";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: gene_config.appName,
//   description: gene_config.appDesc,
// };

export default function RootLayout(
  {
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/*Add Ant Registry to avoid first loading page flicker*/}
        <AntdRegistry>
          <ResponsiveLayout>{children}</ResponsiveLayout>
        </AntdRegistry>
      </body>
    </html>
  );
}