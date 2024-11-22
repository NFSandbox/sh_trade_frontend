"use client";
import { useEffect, useState, useLayoutEffect, CSSProperties } from "react";

// Components
import { FlexDiv, Center } from "@/components/container";
import { Button, Input } from "antd";
import { LoadingPage, LoadingSkeleton } from "@/components/error";
import { Avatar, Typography, Tooltip } from "antd";
import { Title } from "@/components/title";
const { Paragraph } = Typography;
import { PageSegment } from "@/cus_components/pages";
import {
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineQq,
  AiOutlineWechat,
  AiOutlineDelete,
} from "react-icons/ai";
import { GoVerified } from "react-icons/go";

// States
import { useLayoutState, useHeaderTitle } from "@/states/layoutState";
import { useSettingsState } from "@/states/settingsState";
import { useStore } from "@/tools/use_store";

// Tools
import { classNames } from "@/tools/css_tools";
import { asyncSleep } from "@/tools/general";
import { errorPopper } from "@/exceptions/error";
import toast from "react-hot-toast";

// Apis
import { useGetMeForce } from "@/api/auth";
import { ContactInfoIn } from "@/api/user";

export interface ContactInfoItemProps {
  /**
   * ContactInfo to show.
   */
  contactInfo: ContactInfoIn;
  /**
   * Allow user to click item to copy
   */
  clickToCopy?: boolean;
  /**
   * Callbacks when remove contact info button clicked. If undefined, hide the button.
   */
  onRemove?: (info: ContactInfoIn) => unknown;
}

export function ContactInfoItem(props: ContactInfoItemProps) {
  const contactInfo = props.contactInfo;

  /**
   * Record the state of removal function
   */
  const [isRemoving, setIsRemoving] = useState(false);

  /**
   * Internal onremoval callback wrapper
   */
  async function onRemovalCallback() {
    setIsRemoving(true);
    try {
      if (props.onRemove) {
        await props.onRemove(contactInfo);
      }
    } catch (e) {
      errorPopper(e);
    } finally {
      setIsRemoving(false);
    }
  }

  // function to handle clickToCopy logic
  // only works in HTTPS (WebAPI limitation)
  async function handleClickCopy() {
    try {
      const clipboard = new window.Clipboard();
      await clipboard.writeText(contactInfo.contact_info);
      toast.success("联系方式已复制");
    } catch (e) {
      toast.error("联系方式复制失败");
    }
  }

  let gridColumns = "5rem minmax(0, 1fr)";
  if (props.onRemove) {
    gridColumns += " 5rem";
  }

  const gridCssStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: gridColumns,
    alignItems: "center",
  };

  let content = (
    <div
      className={classNames(
        // 'w-full grid grid-cols-12 items-center',
        "rounded-lg py-2 hover:bg-bgcolor/50 dark:hover:bg-white/10",
      )}
    >
      <div style={gridCssStyle}>
        {/* Contact Type */}
        <div className="">
          <ContactTypeTag contactType={contactInfo.contact_type} />
        </div>

        {/* Contact Info */}
        <div className="flex flex-row items-center gap-2">
          <p className="overflow-hidden overflow-ellipsis text-wrap text-start font-mono">
            {contactInfo.contact_info}
          </p>
          {/* Verified Tags */}
          {contactInfo.verified && (
            <InlineTag
              color="bg-green/80"
              icon={<GoVerified size={16} />}
              toolTip="此联系方式曾经成功通过平台验证"
            >
              已验证
            </InlineTag>
          )}
        </div>

        {/* Actions */}
        {props.onRemove && (
          <div className="justify-self-end px-4">
            <Button
              type="default"
              loading={isRemoving}
              onClick={(e) => {
                // prevent the click event propagating, which may break click-to-copy feature.
                e.stopPropagation();
                onRemovalCallback();
              }}
            >
              <AiOutlineDelete size={20} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  // Add click to copy wrapper
  if (props.clickToCopy) {
    content = (
      <button onClick={handleClickCopy} className="w-full">
        {content}
      </button>
    );
  }
  // content.props.key = `${contactInfo.contact_info_id}`;

  return content;
}

interface ContactTypeTagProps {
  contactType: string;
}

function ContactTypeTag(props: ContactTypeTagProps) {
  interface ContactTypeDisplayInfo {
    icon?: React.ReactNode;
    name: string;
  }
  /**
   * Determine how different types of contact info type showed
   */
  const typeResourceMap: Record<string, ContactTypeDisplayInfo> = {
    ahuemail: {
      icon: <AiOutlineMail size={20} />,
      name: "AHU邮箱",
    },
    email: {
      icon: <AiOutlineMail size={20} />,
      name: "邮箱",
    },
    phone: {
      icon: <AiOutlinePhone size={20} />,
      name: "电话",
    },
    qq: {
      icon: <AiOutlineQq size={20} />,
      name: "QQ",
    },
    wechat: {
      icon: <AiOutlineWechat size={20} />,
      name: "微信",
    },
  };

  const contactTypeInfo = typeResourceMap[props.contactType] ?? undefined;

  return (
    <div className="flex flex-none flex-col items-center opacity-50">
      {contactTypeInfo.icon}
      <p className="text-[12px]">{contactTypeInfo.name}</p>
    </div>
  );
}

interface InlineTagProps {
  children: React.ReactNode;
  color: string;
  toolTip?: string;
  icon?: React.ReactNode;
  className?: string;
}

function InlineTag(props: InlineTagProps) {
  let content = (
    <span
      className={classNames(
        "flex flex-none flex-row items-center rounded-lg px-[0.5rem] py-[0.1rem] text-[0.8rem] text-white/80",
        props.color,
        props.className ?? "",
      )}
    >
      {props.icon ?? undefined}
      {props.children}
    </span>
  );

  if (props.toolTip) {
    content = <Tooltip title={props.toolTip}>{content}</Tooltip>;
  }

  return content;
}
