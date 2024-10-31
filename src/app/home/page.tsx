// Components
import { FlexDiv, Center } from '@/components/container';

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Home - AHUER.COM',
    description: 'Period usage info - Showing usage statistics in specific time range.'
}

export default function Home() {
    return (<Center>Welcome!</Center>);
}