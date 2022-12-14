import Link from 'next/link';
import { useLogoutMutation } from '../../hooks/mutations/auth';
import { useMeQuery } from '../../hooks/query/auth';
import Button from './button';
import { useRouter } from 'next/router';
import { useState } from 'react';
import MenuDropdown from './menu-dropdown';
import ChevronDownIcon from '../icons/chevron-down-icon';

interface HeaderProps {
  hasLoginButtons?: boolean;
}

const Header = ({ hasLoginButtons = true }: HeaderProps) => {
  const [isDownDownOpen, setIsDownDownOpen] = useState(false);
  const router = useRouter();
  const { data: user, isSuccess } = useMeQuery();

  const toggleDownDownOpen = () => {
    setIsDownDownOpen(!isDownDownOpen);
  };

  return (
    <div className={'bg-white h-[80px] px-10 flex shadow-md items-center fixed top-0 z-[999] w-full'}>
      <Link href={'/'}>
        <div className={'text-xl font-semibold text-blue-900'}>Organizator wydarzeń</div>
      </Link>
      <div className={'flex items-center space-x-3 ml-20'}>
        <Link href={'/events'}>
          <div className={'text-md font-semibold'}>Wydarzenia</div>
        </Link>
        <Link href={'/groups'}>
          <div className={'text-md font-semibold'}>Grupy</div>
        </Link>
      </div>
      <div className={'ml-auto'}>
        {isSuccess ? (
          <div className={'flex justify-between items-center cursor-pointer relative'} onClick={toggleDownDownOpen}>
            <p className={'mr-3'}>{user.name}</p>
            <img src={user.image || '/images/avatar-fallback.svg'} className={'w-10 h-10 rounded-full mr-3'} />
            <ChevronDownIcon className={'fill-gray-800'} width={18} height={18} />
            {isDownDownOpen && <MenuDropdown userId={user.userId} />}
          </div>
        ) : (
          hasLoginButtons && (
            <div className={'space-x-2'}>
              <Button onClick={() => router.push('/login')}>Zaloguj się</Button>
              <Button kind={'secondary'} onClick={() => router.push('/register')}>
                Zarejestruj się
              </Button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Header;
