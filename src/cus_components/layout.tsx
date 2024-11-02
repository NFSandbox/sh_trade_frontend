'use client';

import React, { ReactNode } from "react";
import Link from "next/link";

// Supertokens
// import SuperTokens from 'supertokens-web-js';
import SuperTokens from 'supertokens-web-js';
import Session from 'supertokens-web-js/recipe/session';
import EmailPassword from 'supertokens-web-js/recipe/emailpassword'

// Components
import { Header } from "@/components/header";
import { Container, FlexDiv } from "@/components/container";
import { Divider, Popover, Avatar, Button, ButtonProps } from 'antd';
import { AiOutlineUser, AiOutlineNotification } from "react-icons/ai";
import { IoMdNotificationsOutline } from "react-icons/io";
import { PiSignOut } from "react-icons/pi";
import { AiOutlineInbox } from "react-icons/ai";

// Apis
import { getMe, useGetMe } from '@/api/auth';

// states
import { useLayoutState } from "@/states/layoutState";

// configs
import * as gene_config from '@/config/general';

// Tools
import { classNames } from "@/tools/css_tools";
import { errorPopper } from "@/exceptions/error";

// Supertokens init
if (typeof window !== 'undefined') {
  SuperTokens.init({
    appInfo: {
      // learn more about this on https://supertokens.com/docs/emailpassword/appinfo
      appName: "AHUER.COM",
      apiDomain: gene_config.backendBaseUrl,
      apiBasePath: "/auth",
    },
    recipeList: [
      EmailPassword.init(),
      Session.init(),
    ]
  });
}

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

  return (
    <>
      <FlexDiv className="w-full flex-none">{isHeaderVisible == true && <CusHeader></CusHeader>}</FlexDiv>
      <FlexDiv expand className={classNames(
        'flex-col overflow-y-auto',
      )}>{children}</FlexDiv>
    </>
  );
}

function CusHeader() {
  const title = useLayoutState((st) => st.title);

  return (
    <Header content={<HeaderContent />}>
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

function HeaderContent() {
  return (
    <FlexDiv className={classNames(
      'flex-none flex-row gap-x-2 justify-center items-center px-2',
    )}>
      <UserAvatar />
    </FlexDiv>
  );
}

function HoverMenuButton({ children, href, ...args }: { href?: string, children: ReactNode } & ButtonProps) {
  let retBtn = (
    <Button key={href ?? undefined} variant="text" color="default" className="w-full" {...args}>
      <FlexDiv className="w-full justify-start">
        {children}
      </FlexDiv>
    </Button>
  );

  if (href) {
    retBtn = <Link href={href}>{retBtn}</Link>
  }

  return retBtn;
}

function UserAvatar() {
  const {
    data: userInfo,
    isLoading: userInfoIsLoading,
    error: userInfoError,
  } = useGetMe();



  const hoverMenu = (
    <FlexDiv
      textEllipsis={true}
      className={classNames(
        'flex-none flex-col gap-y-2',
        'overflow-hidden',
        'w-[15rem]',
      )}>
      <p className="text-lg">{userInfo?.username}</p>
      <p className="opacity-70"><span>UserID: </span><span className="font-mono">{userInfo?.user_id}</span></p>

      <FlexDiv className="flex-col flex-none pt-2">
        <HoverMenuButton href='/user' icon={<AiOutlineUser size={20} />}>个人资料</HoverMenuButton>
        <HoverMenuButton href='/published' icon={<AiOutlineInbox size={20} />}>我的发布</HoverMenuButton>
        <HoverMenuButton href='/notifications' icon={<IoMdNotificationsOutline size={20} />}>通知</HoverMenuButton>
        <HoverMenuButton href='/auth/signout' color='danger' icon={<PiSignOut size={20} />}>退出登录</HoverMenuButton>
      </FlexDiv>
    </FlexDiv>
  );

  if (userInfoError) {
    errorPopper(userInfoError);
  }

  if (userInfo) {
    // return <p className={classNames(
    //   userInfoIsLoading ? 'opacity-50' : '',
    // )}><Link href='/auth/signout'><span>注销</span></Link></p>;
    return <Popover
      trigger='hover'
      placement='bottomRight'
      content={hoverMenu}
      arrow={false}
    >
      <button className={classNames(
        userInfoIsLoading ? 'opacity-50' : '',
      )}>
        <Avatar size={'large'} gap={0}>{userInfo.username.substring(0, 3)}</Avatar>
      </button>
    </Popover>;
  }

  return (
    <Link href='/auth' className={classNames(
      userInfoIsLoading ? 'opacity-50' : '',
    )}><p>登录 / 注册</p></Link>
  );
}