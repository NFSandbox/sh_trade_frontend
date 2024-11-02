import type { Metadata } from "next";

// Config
import * as gene_config from '@/config/general';

// Components
import { Center } from '@/components/container';

// Parts
import * as clients from './client';


export const metadata: Metadata = {
  title: `用户中心 - ${gene_config.appName}`,
  description: `${gene_config.appDesc}`
}

interface HomeProps {
  params: Promise<{ slug: string }>
}

export default async function Home(props: HomeProps) {
  // const { slug } = await props.params;

  return (<Center>
    <clients.Client />
  </Center>);
}