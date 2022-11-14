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
      <div className={'bg-white rounded-xl fixed left-1/2 -translate-x-1/2 z-[999] w-[700px] min-h-[500px]'}>
        <div className={'px-5 py-3 flex justify-between items-center'}>
          <h2 className={'text-lg font-semibold '}>{title}</h2>
          <button onClick={handleCloseModal}>
            <CloseIcon />
          </button>
        </div>

        <hr />
        {children}
      </div>
    </>
  );
};

export default ModalWrapper;
