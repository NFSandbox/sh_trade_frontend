import type { Metadata } from "next";

// Config
import * as gene_config from "@/config/general";

// Components
import { Center } from "@/components/container";

// Parts
import * as clients from "./client";

export const metadata: Metadata = {
  title: `管理员页面 - ${gene_config.appName}`,
  description: `${gene_config.appDesc}`,
};

export default function Home() {
  return (
    <Center>
      <clients.LayoutTests />
    </Center>
  );
}
