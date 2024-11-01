'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Supertokens
import { signUp, signIn } from "supertokens-web-js/recipe/emailpassword";

// Components
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input } from 'antd';
import { FlexDiv, Container, Center } from '@/components/container';
import { ErrorCard } from '@/components/error';
// Apis
import { signOut } from '@/api/auth';

// Tools
import { classNames } from '@/tools/css_tools';
import toast from 'react-hot-toast';
import { asyncSleep } from '@/tools/general';

// States
import { useLayoutState, useHeaderTitle } from '@/states/layoutState';

export function SignOutPage() {
    const router = useRouter();
    async function performSignOut() {

        await signOut();
        router.push('/');
    }

    useEffect(() => { performSignOut(); }, []);

    return (<Center>
        <ErrorCard title='正在注销账号' description='系统正在此浏览器中注销您的账号...'></ErrorCard>
    </Center>);
}