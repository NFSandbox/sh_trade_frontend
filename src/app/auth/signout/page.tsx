import type { Metadata } from "next";

// Config
import * as gene_config from "@/config/general";

// Components
import { Center } from "@/components/container";

// Parts
import * as clients from "./client";

export default function Page() {
  return <clients.SignOutPage></clients.SignOutPage>;
}
