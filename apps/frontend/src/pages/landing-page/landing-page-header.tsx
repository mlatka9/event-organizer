import clsx from 'clsx';
import { ReactNode } from 'react';

interface LandingPageHeaderProps {
  children: ReactNode;
}

const LandingPageHeader = ({ children }: LandingPageHeaderProps) => {
  return (
    <h1 className={clsx('text-neutral-900 text-4xl font-semibold mb-5 relative')}>
      <div className={'w-14 h-2 bg-blue-700 absolute -top-3 left-0'} />
      {children}
    </h1>
  );
};

export default LandingPageHeader;
