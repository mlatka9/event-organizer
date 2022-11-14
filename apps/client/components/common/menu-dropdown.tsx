import Link from 'next/link';
import { useLogoutMutation } from '../../hooks/mutations/auth';
import { useMeQuery } from '../../hooks/query/auth';

interface MenuDropdownProps {
  userId: string;
}

const MenuDropdown = ({ userId }: MenuDropdownProps) => {
  const logout = useLogoutMutation();

  return (
    <div className={'bg-white shadow-md rounded-b-md absolute top-[calc(100%+30px)] right-0 w-[200px]'}>
      <Link className={'h-14 px-5 w-full block flex items-center hover:bg-blue-50'} href={`/users/${userId}`}>
        Profil
      </Link>
      <Link className={'px-5 h-14 w-full block flex items-center hover:bg-blue-50'} href={'/events'}>
        Wydarzenia
      </Link>
      <Link className={'px-5 h-14 w-full block flex items-center hover:bg-blue-50'} href={'/'}>
        Grupy
      </Link>
      <Link className={'px-5 h-14 w-full block flex items-center hover:bg-blue-50'} href={'/login'}>
        Login
      </Link>
      <button
        className={'px-5 h-14 w-full block flex items-center hover:bg-red-50 text-red-400'}
        onClick={() => logout()}
      >
        Wyloguj się
      </button>
    </div>
  );
};

export default MenuDropdown;
