import { ReactNode } from 'react';
import CloseIcon from '../icons/close-icon';

interface ModalWrapperProps {
  children: ReactNode;
  title: string;
  handleCloseModal: () => void;
}
const ModalWrapper = ({ children, title, handleCloseModal }: ModalWrapperProps) => {
  return (
    <>
      <div className={'fixed inset-0 bg-neutral-800/50 z-[999]'} onClick={handleCloseModal} />
      <div
        className={
          'max-h-screen bg-white rounded-xl fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-[999] w-full max-w-[700px]'
        }
      >
        <div className={'px-5 py-3 flex justify-between items-center overflow-auto'}>
          <h2 className={'text-lg font-semibold '}>{title}</h2>
          <button onClick={handleCloseModal}>
            <CloseIcon />
          </button>
        </div>
        <hr />

        <div className={'flex flex-col p-5 max-h-[calc(100vh-52px)] overflow-auto'}>{children}</div>
      </div>
    </>
  );
};

export default ModalWrapper;
