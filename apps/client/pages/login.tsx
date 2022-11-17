import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import FormInput from '../components/form/form-input';
import Button from '../components/common/button';
import { useLoginMutation } from '../hooks/mutations/auth';
import Header from '../components/common/header';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import FormErrorMessage from '../components/form/form-error-message';
import { useMeQuery } from '../hooks/query/auth';
import { toast } from 'react-toastify';

const schema = z.object({
  email: z.string().email({ message: 'Wprowadz poprawny adres email' }),
  password: z.string().min(6, { message: 'Hasło musi miec co najmniej 6 znaków' }),
});

type LoginFormInput = z.infer<typeof schema>;

const LoginPage = () => {
  useMeQuery({ redirectTo: '/', redirectIfFound: true });

  const [APIErrorMessage, setAPIErrorMessage] = useState<undefined | string>(undefined);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const login = useLoginMutation({
    onSuccess: () => router.push('/'),
    onError: (err) =>
      setAPIErrorMessage(err.response?.status === 401 ? 'Adres email i hasło są niepoprawne' : undefined),
  });

  const onSubmit = (data: LoginFormInput) => {
    login({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div>
      <Header hasLoginButtons={false} />
      <div className={'grid grid-cols-2 h-screen pt-[80px]'}>
        <div className={'relative'}>
          <div className={'absolute bg-neutral-900/20 w-full h-full'} />
          <img src={'/images/fire-camp.jpg'} className={'w-full h-full object-cover'} />
        </div>
        <div className={'px-10 my-auto max-w-[600px] w-full mx-auto'}>
          <h1 className={'text-3xl mb-3 font-semibold'}>Zaloguj się</h1>
          <p className={'mb-10'}>
            Nie masz jeszcze konta
            <Link href={'/register'} className={'text-blue-400 ml-1'}>
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
            {APIErrorMessage && <FormErrorMessage message={APIErrorMessage} />}
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
