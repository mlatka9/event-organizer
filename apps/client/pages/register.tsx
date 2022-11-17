import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import FormInput from '../components/form/form-input';
import Button from '../components/common/button';
import { useRegisterMutation } from '../hooks/mutations/auth';
import Header from '../components/common/header';
import Link from 'next/link';
import { useState } from 'react';
import FormErrorMessage from '../components/form/form-error-message';
import { toast } from 'react-toastify';

const schema = z
  .object({
    email: z.string().email({ message: 'Wprowadz poprawny adres email' }),
    password: z.string().min(6, { message: 'Hasło musi miec co najmniej 6 znaków' }),
    confirmPassword: z.string().min(6, { message: 'Hasło musi miec co najmniej 6 znaków' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Hasła nie są takie same',
    path: ['confirmPassword'],
  });

type RegisterFormInput = z.infer<typeof schema>;

const RegisterPage = () => {
  const [APIErrorMessage, setAPIErrorMessage] = useState<undefined | string>(undefined);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const registerUser = useRegisterMutation({
    onSuccess: () => {
      toast('Pomyślnie utworzono konto', {
        type: 'success',
      });
      router.push('/login');
    },
    onError: (err) =>
      setAPIErrorMessage(err.response?.status === 409 ? 'Użytkownik z takim adresem email już istnieje' : undefined),
  });

  const onSubmit = async (data: RegisterFormInput) => {
    await registerUser({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div>
      <Header hasLoginButtons={false} />
      <div className={'grid grid-cols-2 h-screen pt-[80px]'}>
        <img src={'/images/concert.jpg'} className={'w-full h-full object-cover'} />
        <div className={'px-10 my-auto max-w-[600px] w-full mx-auto'}>
          <h1 className={'text-3xl mb-3 font-semibold'}>Zarejestruj się</h1>
          <p className={'mb-10'}>
            Masz już konto
            <Link href={'/login'} className={'text-blue-400 ml-1'}>
              Zaloguj się
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
            <FormInput
              label={'powtórz hasło'}
              name={'confirmPassword'}
              register={register}
              type={'password'}
              error={errors.confirmPassword}
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

export default RegisterPage;
