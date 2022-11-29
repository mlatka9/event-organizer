import { useState } from 'react';
import { useAuth } from '../../hooks/use-auth';
import { Link, useNavigate } from 'react-router-dom';
import MenuDropdown from './menu-dropdown';
import Button from './button';
import AvatarFallback from '../../assets/images/avatar-fallback.svg';
import SettingsIcon from '../icons/settings-icon';
import clsx from 'clsx';
import Hamburger from './hamburger';

interface HeaderProps {
  hasLoginButtons?: boolean;
}

const Header = ({ hasLoginButtons = true }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const [isDownDownOpen, setIsDownDownOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const toggleDownDownOpen = () => {
    setIsDownDownOpen(!isDownDownOpen);
  };

  return (
    <>
      <div
        className={clsx(
          ' bg-blue-800 p-5 flex flex-col shadow-md z-[999] w-[80%] lg:w-[200px] xl:w-[260px] h-full fixed transition-transform -translate-x-[100%] lg:!translate-x-0 duration-300',
          isMenuOpen && '!translate-x-0'
        )}
      >
        <div
          className={clsx(
            'absolute top-3 -right-10 lg:hidden translate-x-[12px] md:translate-x-[32px] transition-transform',
            isMenuOpen && '!-translate-x-[50px]'
          )}
        >
          <Hamburger isMenuOpen={isMenuOpen} onClick={toggleMenu} />
        </div>
        <Link to={'/'} className={'text-xl font-semibold text-white'}>
          Organizator
        </Link>
        <div className={'flex flex-col space-y-5 mt-20'}>
          <Link to={'/events'} className={'text-lg text-white'}>
            Wydarzenia
          </Link>
          <Link to={'/groups'} className={'text-lg text-white'}>
            Grupy
          </Link>
          {user && (
            <Link to={'/calendar'} className={'text-lg text-white'}>
              Kalendarz
            </Link>
          )}
        </div>
        <div className={'mt-auto'}>
          {user ? (
            <div className={'flex items-center cursor-pointer relative'} onClick={toggleDownDownOpen}>
              <img src={user.image || AvatarFallback} className={'w-10 h-10 rounded-full mr-3 object-cover'} />
              <p className={'mr-3 text-white'}>{user.name}</p>
              <SettingsIcon width={'18'} height={'18'} className={'ml-auto fill-white'} />
              {isDownDownOpen && <MenuDropdown userId={user.userId} />}
            </div>
          ) : (
            hasLoginButtons && (
              <div className={'flex justify-between'}>
                <Button className={'px-[8px]'} onClick={() => navigate('/login')}>
                  Zaloguj się
                </Button>
                <Button className={'px-[8px]'} kind={'secondary'} onClick={() => navigate('/register')}>
                  Zarejestruj się
                </Button>
              </div>
            )
          )}
        </div>
      </div>
      <div className={'hidden lg:block'} />
    </>
  );
};

export default Header;
