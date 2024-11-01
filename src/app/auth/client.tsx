'use client';

import React, { useState } from 'react';
import { redirect } from 'next/navigation';

// Supertokens
import { signUp, signIn } from "supertokens-web-js/recipe/emailpassword";

// Components
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input } from 'antd';
import { FlexDiv, Container } from '@/components/container';


// Tools
import { classNames } from '@/tools/css_tools';
import toast from 'react-hot-toast';
import { asyncSleep } from '@/tools/general';

// States
import { useLayoutState, useHeaderTitle } from '@/states/layoutState';

type FieldType = {
  email?: string;
  password?: string;
};


async function signUpClicked(email: string, password: string) {
  try {
    let response = await signUp({
      formFields: [{
        id: "email",
        value: email
      }, {
        id: "password",
        value: password
      }]
    })

    if (response.status === "FIELD_ERROR") {
      // one of the input formFields failed validation
      response.formFields.forEach(formField => {
        if (formField.id === "email") {
          // Email validation failed (for example incorrect email syntax),
          // or the email is not unique.
          toast.error(formField.error);
        } else if (formField.id === "password") {
          // Password validation failed.
          // Maybe it didn't match the password strength
          toast.error(formField.error);
        }
      })
    } else if (response.status === "SIGN_UP_NOT_ALLOWED") {
      // the reason string is a user friendly message
      // about what went wrong. It can also contain a support code which users
      // can tell you so you know why their sign up was not allowed.
      // window.alert(response.reason)
      toast.error(response.reason);
    } else {
      // sign up successful. The session tokens are automatically handled by
      // the frontend SDK.
      toast.success('账户注册成功！')
      return true;
    }
  } catch (err: any) {
    if (err.isSuperTokensGeneralError === true) {
      // this may be a custom error message sent from the API by you.
      toast.error(err.message);
    } else {
      toast.error(`尝试注册账户时出现错误，请稍后再试 ${err}`);
    }
  }
}


async function signInClicked(email: string, password: string) {
  try {
    let response = await signIn({
      formFields: [{
        id: "email",
        value: email
      }, {
        id: "password",
        value: password
      }]
    })

    if (response.status === "FIELD_ERROR") {
      response.formFields.forEach(formField => {
        if (formField.id === "email") {
          // Email validation failed (for example incorrect email syntax).
          toast.error(formField.error)
        }
      })
    } else if (response.status === "WRONG_CREDENTIALS_ERROR") {
      toast.error("您输入的邮箱或密码不正确")
    } else if (response.status === "SIGN_IN_NOT_ALLOWED") {
      // the reason string is a user friendly message
      // about what went wrong. It can also contain a support code which users
      // can tell you so you know why their sign in was not allowed.
      toast.error(response.reason)
    } else {
      toast.success('用户登录成功');
      return true;
    }
  } catch (err: any) {
    if (err.isSuperTokensGeneralError === true) {
      // this may be a custom error message sent from the API by you.
      toast.error(err.message);
    } else {
      toast.error(`尝试登录用户时出现错误，请稍后再试 ${err}`);
    }
  }
}


export function SignIn() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useHeaderTitle('登录 & 注册');

  // Handle signInUp form submission
  const handleSignInUpRequest: FormProps<FieldType>['onFinish'] = async function (values) {
    setIsLoading(true);
    try {
      if (isSignUp) { const res = await signUpClicked(values.email!, values.password!); if (!res) { throw Error(); } }
      else {
        const res = await signInClicked(values.email!, values.password!); if (!res) { throw Error(); }
      }

      await asyncSleep(1000);
      window.location.assign('/');
    } catch (e) {
      ;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className={classNames(
      'p-4 m-2 w-[30rem]',
      'justify-center',
      'rounded-2xl shadow-2xl',
    )}>
      <FlexDiv className={classNames(
        'flex-col gap-y-2 justify-start items-start',
        'w-full',
      )}>
        {/* Title Part */}
        <FlexDiv className='flex-row gap-x-2 w-full justify-center items-center py-4'>
          <img src='/assets/icon.svg' height={30} width={30}></img>
          <h2 className={classNames(
            'text-2xl', 'text-primary dark:text-primary-light',
            'self-center',
          )}>{isSignUp ? '注册' : '登录'} AHUER.COM</h2>
        </FlexDiv>
        <Form
          name="basic"
          // labelCol={{ span: 4 }}
          // wrapperCol={{ span: 20 }}
          style={{ width: '100%' }}
          onFinish={handleSignInUpRequest}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
          className='w-full'
        >
          <Form.Item<FieldType>
            label="邮箱"
            name="email"
            rules={[{ required: true, message: '邮箱信息不能为空' }]}
          >
            <Input placeholder='请在此输入您的邮箱' />
          </Form.Item>

          <Form.Item<FieldType>
            label="密码"
            name="password"
            rules={[{ required: true, message: '密码不能为空' }]}
          >
            <Input.Password placeholder='请在此输入您的密码' />
          </Form.Item>

          <Form.Item>
            <Button loading={isLoading} type="primary" htmlType="submit" className='w-full'>
              {isSignUp ? '注册' : '登录'}
            </Button>
          </Form.Item>
        </Form>

        {/* Sign in up switch */}
        <Button
          type='link'
          onClick={() => { setIsSignUp(!isSignUp) }}>切换至 {isSignUp ? '登录' : '注册'}</Button>

      </FlexDiv>
    </Container>
  );
}