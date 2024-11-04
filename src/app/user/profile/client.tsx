"use client";
import { useEffect, useState, useLayoutEffect } from "react";

// Components
import { FlexDiv, Center } from "@/components/container";
import { LoadingPage, LoadingSkeleton } from "@/components/error";
import { Avatar, Typography, Form, Button, Input, Select, Space } from "antd";
const { useForm } = Form;
import { Title } from "@/components/title";
const { Paragraph } = Typography;
import { PageSegment } from "@/cus_components/pages";
import { ContactInfoItem } from "@/cus_components/contact_info";
import {
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineQq,
  AiOutlineWechat,
  AiOutlineDelete,
} from "react-icons/ai";

// States
import { useLayoutState, useHeaderTitle } from "@/states/layoutState";
import { useSettingsState } from "@/states/settingsState";
import { useStore } from "@/tools/use_store";
import { useTriggerState } from "@/tools/use_trigger_state";

// Tools
import { classNames } from "@/tools/css_tools";
import { asyncSleep, useAsyncTaskWithLoadingState } from "@/tools/general";
import { errorPopper } from "@/exceptions/error";
import { useMinBreakPoint } from "@/tools/use_breakpoints";
import toast from "react-hot-toast";

// Apis
import { useGetMeForce } from "@/api/auth";
import {
  updateUserDescription,
  useContactInfo,
  removeContactInfo,
  addContactInfo,
  ContactInfoIn,
  ContactInfoOutNew,
} from "@/api/user";

interface ClientProps {
  userIdStr?: string;
}

export function Client(props: ClientProps) {
  // const {
  //   userIdStr
  // } = props;

  // let userId: number | undefined = undefined;
  // try {
  //   userId = Number.parseInt(userIdStr);
  // } catch (e) {
  //   ;
  // }

  const { data, isLoading } = useGetMeForce();

  return (
    <FlexDiv className="flex-col w-full justify-start items-start">
      <UserData />
      <ContactInfoSegment />
    </FlexDiv>
  );
}

export function UserData() {
  const { data: userInfo, isLoading } = useGetMeForce();
  const [isDescUpdating, setIsDescUpdating] = useState(false);

  async function handleDescriptionChange(newDesc: string) {
    setIsDescUpdating(true);

    try {
      const res = await toast.promise(updateUserDescription(newDesc), {
        loading: "更新中...",
        success: "更新成功",
        error: "更新失败",
      });
    } catch (e) {
      errorPopper(e);
    } finally {
      setIsDescUpdating(false);
    }
  }

  let content = <LoadingSkeleton />;

  if (!isLoading)
    content = (
      <>
        {/* Avatar, UserName ID Part */}
        <FlexDiv className="flex-none flex-row gap-x-2 items-center">
          {/* Avatar */}
          <Avatar size={60} gap={0}>
            {userInfo?.username.substring(0, 3)}
          </Avatar>
          {/* UserName ID */}
          <FlexDiv className="flex-col gap-y-2">
            <h2 className="text-xl opacity-80">{userInfo?.username}</h2>
            <h2 className="text-md opacity-50">
              用户编号: {userInfo?.user_id}
            </h2>
          </FlexDiv>
        </FlexDiv>

        {/* Description */}
        <Paragraph
          disabled={isDescUpdating}
          editable={{ onChange: handleDescriptionChange }}
        >
          {userInfo?.description ?? "暂无介绍信息。"}
        </Paragraph>
      </>
    );

  return (
    <PageSegment>
      <Title>基本信息</Title>
      {content}
    </PageSegment>
  );
}

function ContactInfoSegment() {
  // media breakpoint
  const idMd = useMinBreakPoint("md");
  const { data: contactInfo, isLoading, isValidating } = useContactInfo();
  const { isTriggered: isAddTriggered, triggerState: setAddTriggered } =
    useTriggerState(false);

  const useAddContactForm = useForm<ContactInfoOutNew>();

  // Handle add contact
  const { task: handleAddContactInfo, isLoading: isAddingContact } =
    useAsyncTaskWithLoadingState(async function (info: ContactInfoOutNew) {
      console.log(info);
      await addContactInfo(info);
    });

  let contactInfoListElem = <LoadingSkeleton />;
  if (!isLoading)
    contactInfoListElem = (
      // List Of Contact Info
      <FlexDiv
        className={classNames(
          "flex-col w-full flex-none",
          isValidating ? "opacity-50" : ""
        )}
      >
        {contactInfo?.map((contactInfoItem) => {
          return (
            <ContactInfoItem
              key={contactInfoItem.contact_info_id}
              contactInfo={contactInfoItem}
              onRemove={removeContactInfo}
            />
          );
        })}
      </FlexDiv>
    );

  return (
    <PageSegment>
      <Title>联系方式</Title>

      {/* Contact Info List */}
      {contactInfoListElem}

      {/* Add Contact Info Part */}
      <FlexDiv
        className={classNames(
          "w-full justify-end",
          isAddTriggered ? "" : "hidden"
        )}
      >
        <Form<ContactInfoOutNew>
          layout="inline"
          name="add_contact_info"
          initialValues={{ contact_type: "qq" }}
          onFinish={handleAddContactInfo}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
          style={{}}
        >
          <Form.Item<ContactInfoOutNew> name="contact_type">
            <Select
              className="min-w-[6rem]"
              options={[
                { value: "qq", label: "QQ" },
                { value: "wechat", label: "微信" },
                { value: "email", label: "电子邮箱" },
                { value: "phone", label: "电话" },
                {
                  value: "ahuemail",
                  label: "AHU邮箱",
                  disabled: true,
                  title: "AHU邮箱目前不支持手动添加",
                },
              ]}
            />
          </Form.Item>

          <Form.Item<ContactInfoOutNew>
            className=""
            label="联系方式"
            name="contact_info"
          >
            <Input placeholder="请输入所选择类型的联系方式" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => {}}
              loading={isAddingContact}
            >
              确定
            </Button>
          </Form.Item>

          <Form.Item>
            <Button
              onClick={() => {
                setAddTriggered();
              }}
            >
              取消
            </Button>
          </Form.Item>
        </Form>
      </FlexDiv>

      <FlexDiv
        className={classNames(
          "place-self-end pr-4",
          isAddTriggered ? "hidden" : ""
        )}
      >
        <Button
          onClick={() => {
            setAddTriggered();
          }}
        >
          添加新的联系方式
        </Button>
      </FlexDiv>
    </PageSegment>
  );
}
