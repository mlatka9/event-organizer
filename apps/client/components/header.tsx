import { useMeQuery } from '@hooks/query';
import { useLogoutMutation } from '@hooks/mutations';
import Button from '@components/common/button';
import Link from 'next/link';

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
