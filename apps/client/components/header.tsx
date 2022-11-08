import Link from 'next/link';
import { useLogoutMutation } from '../hooks/mutations/auth';
import { useMeQuery } from '../hooks/query/auth';
import Button from './common/button';

const Header = () => {
  const { data, isSuccess } = useMeQuery();
  const logout = useLogoutMutation();

  return (
    <div className={'bg-amber-200 p-10'}>
      {isSuccess ? (
        <div className={'flex justify-between'}>
          <p>userId: {data.userId}</p>
          <Button onClick={() => logout()} className={''}>
            Logout
          </Button>
        </div>
      ) : (
        <div className={'space-x-2'}>
          <Link href={'/login'}>Zaloguj się</Link>
          <Link href={'/register'}>Zarejestruj się</Link>
        </div>
      )}
    </div>
  );
};

export default Header;
