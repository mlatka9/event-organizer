import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth';

interface MenuDropdownProps {
  userId: string;
}

const MenuDropdown = ({ userId }: MenuDropdownProps) => {
  const navigate = useNavigate();
  const onSuccess = () => {
    navigate('/');
  };
  const { logout } = useAuth();

  return (
    <div className={'bg-white shadow-md rounded-md bottom-[120%] right-[0px] absolute w-[200px] overflow-hidden'}>
      <Link className={'h-14 px-5 w-full block flex items-center hover:bg-blue-50'} to={`/users/${userId}`}>
        Profil
      </Link>
      <button
        className={'px-5 h-14 w-full block flex items-center hover:bg-red-50 text-red-400'}
        onClick={() => logout(onSuccess)}
      >
        Wyloguj się
      </button>
    </div>
  );
};

export default MenuDropdown;
