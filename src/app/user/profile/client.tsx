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
import { ContactInfoItem } from '@/cus_components/contact_info';
import { AiOutlineMail, AiOutlinePhone, AiOutlineQq, AiOutlineWechat, AiOutlineDelete } from "react-icons/ai";

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
import { updateUserDescription, useContactInfo, ContactInfoIn } from '@/api/user';

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
    content = (
      <FlexDiv className='flex-col w-full'>
        {(contactInfo?.map((contactInfoitem) => {
          return <ContactInfoItem key={contactInfoitem.contact_type} contactInfo={contactInfoitem} onRemove={() => { }} />
        }))}
      </FlexDiv>
    );

  return (
    <PageSegment>
      <Title>联系方式</Title>
      {content}
    </PageSegment>
  );
}

// interface ContactInfoItemProps {
//   contactInfo: ContactInfoIn;
// }

// function ContactInfoItem(props: ContactInfoItemProps) {
//   const contactInfo = props.contactInfo;

//   async function handleClickCopy() {
//     try {
//       const clipboard = new window.Clipboard();
//       await clipboard.writeText(contactInfo.contact_info);
//       toast.success('联系方式已复制');
//     } catch (e) {
//       toast.error('联系方式复制失败');
//     }
//   }

//   return (
//     <button onClick={handleClickCopy} className='w-full'>
//       <div className='grid grid-cols-12 items-center rounded-lg hover:bg-bgcolor/50 dark:hover:bg-bgcolor-dark/50 py-2'>
//         {/* Contact Type */}
//         <div className='col-span-3 sm:col-span-2'>
//           <ContactTypeTag contactType={contactInfo.contact_type} />
//         </div>

//         {/* Contact Info */}
//         <p className='col-span-6 sm:col-span-8 text-start'>{contactInfo.contact_info}</p>

//         {/* Actions */}
//         <div className='col-span-3 sm:col-span-2'>
//           <Button type='default' onClick={(e) => { console.log(e); e.stopPropagation(); }}>
//             <AiOutlineDelete size={20} />
//           </Button>
//         </div>
//       </div>
//     </button>
//   );
// }

// interface ContactTypeTagProps {
//   contactType: string;
// }

// function ContactTypeTag(props: ContactTypeTagProps) {
//   interface ContactTypeDisplayInfo {
//     icon?: React.ReactNode;
//     name: string;
//   }

//   const typeResourceMap: Record<string, ContactTypeDisplayInfo> = {
//     'ahuemail': {
//       'icon': <AiOutlineMail size={20} />,
//       'name': 'AHU邮箱',
//     },
//     'email': {
//       'icon': <AiOutlineMail size={20} />,
//       'name': '邮箱',
//     },
//     'phone': {
//       'icon': <AiOutlinePhone size={20} />,
//       'name': '电话',
//     },
//     'qq': {
//       'icon': <AiOutlineQq size={20} />,
//       'name': 'QQ',
//     },
//     'wechat': {
//       'icon': <AiOutlineWechat size={20} />,
//       'name': '微信',
//     }
//   };

//   const contactTypeInfo = typeResourceMap[props.contactType] ?? undefined;

//   return (
//     <div className='flex flex-none flex-col items-center opacity-50'>
//       {contactTypeInfo.icon}
//       <p className='text-[12px]'>{contactTypeInfo.name}</p>
//     </div>
//   );
// }