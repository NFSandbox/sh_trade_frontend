// Components
import { FlexDiv, Center } from '@/components/container';
import { Title } from '@/components/title';


// Tools
import { classNames } from '@/tools/css_tools';
import { asyncSleep } from '@/tools/general';
import { errorPopper } from '@/exceptions/error';
import toast from 'react-hot-toast';


interface PageSegmentProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Basic segment layout in a page, take care of the width, maxwidth.
 * Show children in columns with items-start.
 */
export function PageSegment(props: PageSegmentProps) {
  return (
    <FlexDiv
      className={classNames(
        'flex-none flex-col p-4 justify-start items-start w-full max-w-[50rem] gap-y-4',
        props.className ?? '',
      )}>
      {props.title && <Title>{props.title}</Title>}
      {props.children}
    </FlexDiv>
  );
}