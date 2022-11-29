import clsx from 'clsx';

interface HamburgerProps {
  isMenuOpen: boolean;
  onClick: () => void;
}

const Hamburger = ({ isMenuOpen, onClick }: HamburgerProps) => {
  return (
    <div
      className="shadow-md lg:hidden z-40 flex items-center justify-center w-12 h-12 pb-[1px] transition-all duration-300 bg-white rounded-full cursor-pointer hover:bg-white-creamy-light"
      onClick={onClick}
    >
      <button className={clsx([' shrink-0 w-6 h-5  flex justify-end items-center relative '])}>
        <span
          className={clsx([
            'block w-full h-0.5 bg-black absolute rounded-sm top-0 transition-all duration-300',
            isMenuOpen && 'rotate-45 translate-y-[10px]',
          ])}
        />
        <span
          className={clsx([
            'block w-full h-0.5 bg-black absolute rounded-sm top-1/2 transition-all duration-300',
            !isMenuOpen && ' opacity-100',
            isMenuOpen && ' -translate-x-1/2 opacity-0',
          ])}
        />
        <span
          className={clsx(
            'block w-full h-0.5 bg-black absolute rounded-sm top-full transition-all duration-300',
            isMenuOpen && '-rotate-45 translate-y-[-10px]'
          )}
        />
      </button>
    </div>
  );
};

export default Hamburger;
