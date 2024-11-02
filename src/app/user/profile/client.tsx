'use client';
import { useEffect, useState, useLayoutEffect } from 'react';

// Components
import { FlexDiv, Center } from '@/components/container';
import { Button, Input } from 'antd';
import { LoadingPage, LoadingSkeleton } from '@/components/error';
import { Avatar, Typography } from 'antd';
import { Title } from '@/components/title';
const { Paragraph } = Typography;
import { PageSegment } from '@/cus_components/pages';

// States
import { useLayoutState, useHeaderTitle } from '@/states/layoutState';
import { useSettingsState } from '@/states/settingsState';
import { useStore } from '@/tools/use_store';

// Tools
import { classNames } from '@/tools/css_tools';
import { asyncSleep } from '@/tools/general';
import { errorPopper } from '@/exceptions/error';
import toast from 'react-hot-toast';

// Apis
import { useGetMeForce } from '@/api/auth';
import { updateUserDescription, useContactInfo } from '@/api/user';



export function Client() {
  const {
    data,
    isLoading,
  } = useGetMeForce();

  return (
    <FlexDiv
      expand
      className='flex-col items-center'>
      <UserData />
      <ContactInfoSegment />
    </FlexDiv>
  );
}

export function UserData() {
  const {
    data: userInfo,
    isLoading,
  } = useGetMeForce();
  const [isDescUpdating, setIsDescUpdating] = useState(false);

  async function handleDescriptionChange(newDesc: string) {
    setIsDescUpdating(true);

    try {
      const res = await toast.promise(updateUserDescription(newDesc), {
        loading: '更新中...',
        success: '更新成功',
        error: '更新失败',
      });

    } catch (e) {
      errorPopper(e);
    }

    finally { setIsDescUpdating(false); }

  }

  let content = <LoadingSkeleton />;

  if (!isLoading)
    content = (
      <>
        {/* Avatar, UserName ID Part */}
        <FlexDiv className='flex-row gap-x-2 items-center'>
          {/* Avatar */}
          <Avatar size={60} gap={0}>{userInfo?.username.substring(0, 3)}</Avatar>
          {/* UserName ID */}
          <FlexDiv className='flex-col gap-y-2'>
            <h2 className='text-xl opacity-80'>{userInfo?.username}</h2>
            <h2 className='text-md opacity-50'>用户编号: {userInfo?.user_id}</h2>
          </FlexDiv>
        </FlexDiv>

        {/* Description */}
        <Paragraph disabled={isDescUpdating} editable={{ onChange: handleDescriptionChange }}>{userInfo?.description ?? '暂无介绍信息。'}</Paragraph>


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
  const { data: contactInfo, isLoading } = useContactInfo();

  let content = <LoadingSkeleton />;
  if (!isLoading)
    content = (<pre>{JSON.stringify(contactInfo, undefined, ' ')}</pre>);

  return (
    <PageSegment>
      <Title>联系方式</Title>
      {content}
    </PageSegment>
  );
}