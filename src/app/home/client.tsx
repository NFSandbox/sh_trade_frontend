'use client';

// Components
import { FlexDiv, Center } from '@/components/container';
import { Button, Input } from 'antd';

// States
import { useLayoutState } from '@/states/layoutState';
import { useEffect, useLayoutEffect } from 'react';

export function LayoutTests() {
  const setTitle = useLayoutState((st) => st.setTitle);
  const setHeaderVisibility = useLayoutState((st) => st.setShowHeader);
  const state = useLayoutState(st => st);

  useEffect(function () {
    setTitle('主页');
  }, []);

  function handleTitleChange(v: any) {
    try {
      const str = v['target']['value'] as string;
      setTitle(str);
    } catch (e) {
      return;
    }
  }

  return (
    <FlexDiv className='flex-col'>
      <Input onChange={handleTitleChange} />
      <Button onClick={() => { setHeaderVisibility(true) }}>Show Header</Button>
      <Button onClick={() => { setHeaderVisibility(false) }}>Hide Header</Button>
      <pre>{JSON.stringify(state)}</pre>
    </FlexDiv>
  );
}