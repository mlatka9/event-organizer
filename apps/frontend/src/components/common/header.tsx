import { useState } from 'react';
import { useAuth } from '../../hooks/use-auth';
import { Link, useNavigate } from 'react-router-dom';
import ChevronDownIcon from '../icons/chevron-down-icon';
import MenuDropdown from './menu-dropdown';
import Button from './button';
import AvatarFallback from '../../assets/images/avatar-fallback.svg';

interface HeaderProps {
  hasLoginButtons?: boolean;
}

const Header = ({ hasLoginButtons = true }: HeaderProps) => {
  const [isDownDownOpen, setIsDownDownOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const toggleDownDownOpen = () => {
    setIsDownDownOpen(!isDownDownOpen);
  };

  return (
    <div className={'bg-white h-[80px] px-10 flex shadow-md items-center fixed top-0 z-[999] w-full'}>
      <Link to={'/'} className={'text-xl font-semibold text-blue-900'}>
        Organizator
      </Link>
      <div className={'flex items-center space-x-3 ml-20'}>
        <Link to={'/events'} className={'text-xl font-semibold text-blue-900'}>
          Wydarzenie
        </Link>
        <Link to={'/groups'} className={'text-xl font-semibold text-blue-900'}>
          Grupy
        </Link>
      </div>
      <div className={'ml-auto'}>
        {user ? (
          <div className={'flex justify-between items-center cursor-pointer relative'} onClick={toggleDownDownOpen}>
            <p className={'mr-3'}>{user.name}</p>
            <img src={user.image || AvatarFallback} className={'w-10 h-10 rounded-full mr-3'} />
            <ChevronDownIcon className={'fill-gray-800'} width={18} height={18} />
            {isDownDownOpen && <MenuDropdown userId={user.userId} />}
          </div>
        ) : (
          hasLoginButtons && (
            <div className={'space-x-2'}>
              <Button onClick={() => navigate('/login')}>Zaloguj się</Button>
              <Button kind={'secondary'} onClick={() => navigate('/register')}>
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
