import { useState } from 'react';

import Button from '../Button';

import { cn, sleep } from '../../lib/helpers';

type ResetButtonProps = {
  onClick(): Promise<void>;
  children?: React.ReactNode;
};

const ResetButton = ({ onClick, children }: ResetButtonProps) => {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <Button
      className={children ? undefined : 'aspect-square'}
      shadowClassName="bg-red-600"
      contentClassName={cn('bg-red-500 text-white', children && 'pl-3 pr-4 gap-2')}
      onClick={async () => {
        if (isClicked) return;
        setIsClicked(true);
        await onClick();
        await sleep(250);
        setIsClicked(false);
      }}
      disabled={isClicked}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className={cn(
          'w-5 h-5 [animation-duration:0.25s] [animation-easing-function:ease-in-out]',
          isClicked && 'animate-spin',
        )}
      >
        <path
          fillRule="evenodd"
          d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
          clipRule="evenodd"
        />
      </svg>
      {children}
    </Button>
  );
};

export default ResetButton;
