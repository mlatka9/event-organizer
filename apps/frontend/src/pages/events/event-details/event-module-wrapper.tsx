import React, { ReactNode } from 'react';

interface EventModuleWrapperProps {
  children: ReactNode;
  headerText: string;
}

const EventModuleWrapper = ({ children, headerText }: EventModuleWrapperProps) => (
  <div className={'bg-white rounded-lg shadow-md h-fit'}>
    <div className={'flex justify-between px-5 py-3 '}>
      <p className={'font-semibold text-lg'}>{headerText}</p>
    </div>
    <hr className={'mb-3'} />
    {children}
  </div>
);

export default EventModuleWrapper;
