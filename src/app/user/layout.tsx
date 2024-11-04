"use client";

import { Children, useEffect, useState, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";

// Components
import { FlexDiv, Center } from "@/components/container";
import { Button, Input, MenuProps, Menu } from "antd";
import { IoIosContact } from "react-icons/io";
import { AiOutlineContacts, AiOutlineInbox } from "react-icons/ai";
import { PiSignOut } from "react-icons/pi";
import { ErrorBoundary } from "react-error-boundary";

// States
import { useLayoutState, useHeaderTitle } from "@/states/layoutState";

// Apis
import { useGetMeForce } from "@/api/auth";

const userBasePath = "/user";

interface UserProfileLayOutProps {
  children: React.ReactNode;
}

/**
 * Basic layout structure
 */
export default function UserProfileLayOut(props: UserProfileLayOutProps) {
  useHeaderTitle("用户中心");
  useGetMeForce();

  const router = useRouter();

  function handleMenuSelectedChange(e: unknown) {
    if (typeof (e as any).key === "string") {
      const keyString: string = (e as any).key;

      // key starts with href:
      if (keyString.startsWith("href:")) {
        const linkStr = keyString.substring(5);

        // absolute
        if (linkStr.startsWith("/")) {
          router.push(linkStr);
        }

        // relative
        else {
          router.push(userBasePath + "/" + linkStr);
        }
      }
    }
  }

  return (
    <FlexDiv
      expand
      className="flex-row justify-center bg-fgcolor dark:bg-fgcolor-dark"
    >
      {/* Left Nav Bar */}
      <FlexDiv className="flex-none m-4 rounded-xl overflow-hidden">
        <Menu
          mode='inline'
          defaultSelectedKeys={["profile"]}
          // openKeys={stateOpenKeys}
          onSelect={handleMenuSelectedChange}
          style={{ width: 200, minWidth: 150 }}
          items={items}
        />
      </FlexDiv>
      {/* Children takes all rest space*/}
      <FlexDiv className="h-full w-full max-w-[50rem] flex-col justify-center items-center overflow-y-auto profile-layout-children-root">
        {props.children}
      </FlexDiv>
    </FlexDiv>
  );
}

type MenuItem = Required<MenuProps>["items"][number] & { href?: string };

const items: MenuItem[] = [
  {
    key: "href:profile",
    icon: <IoIosContact size={20} />,
    label: "用户资料",
  },
  {
    key: "href:published",
    icon: <AiOutlineInbox size={20} />,
    label: "已发布",
  },
  {
    danger: true,
    key: "href:/auth/signout",
    icon: <PiSignOut size={20} />,
    label: "退出登录",
  },
];
