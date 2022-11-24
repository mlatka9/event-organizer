import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../../components/form/form-input';
import Button from '../../components/common/button';
import { useAuth } from '../../hooks/use-auth';
import fireCampImage from '../../assets/images/fire-camp.jpg';
import { Link, Navigate } from 'react-router-dom';

const schema = z.object({
  email: z.string().email({ message: 'Wprowadz poprawny adres email' }),
  password: z.string().min(6, { message: 'Hasło musi miec co najmniej 6 znaków' }),
});

type LoginFormInput = z.infer<typeof schema>;

const LoginPage = () => {
  const { login, user, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormInput) => {
    login({
      credentials: { email: data.email, password: data.password },
      onError: () => setError('password', { message: 'Niepoprawny email lub hasło' }),
    });
  };

  if (isLoading) {
    return <div>user is loading</div>;
  }

  if (!isLoading && user) {
    return <Navigate to={'/'} />;
  }

  return (
    <div className={'h-full'}>
      <div className={'grid grid-cols-2 h-full'}>
        <div className={'relative'}>
          <div className={'absolute bg-neutral-900/20 w-full h-full'} />
          <img src={fireCampImage} className={'w-full h-full object-cover flex'} />
        </div>
        <div className={'px-10 my-auto max-w-[600px] w-full mx-auto'}>
          <h1 className={'text-3xl mb-3 font-semibold'}>Zaloguj się</h1>
          <p className={'mb-10'}>
            Nie masz jeszcze konta
            <Link to={'/register'} className={'text-blue-400 ml-1'}>
              zarejestruj się
            </Link>
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className={'flex flex-col space-y-3'}>
            <FormInput
              label={'email'}
              name={'email'}
              register={register}
              error={errors.email}
              rules={{
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Entered value does not match email format',
                },
              }}
            />
            <FormInput
              label={'hasło'}
              name={'password'}
              register={register}
              type={'password'}
              error={errors.password}
            />
            <Button type={'submit'} className={'ml-auto'}>
              Potwierdź
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
