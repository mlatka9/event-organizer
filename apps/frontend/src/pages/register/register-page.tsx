import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../../components/form/form-input';
import Button from '../../components/common/button';
import { useState } from 'react';
import FormErrorMessage from '../../components/form/form-error-message';
import { toast } from 'react-toastify';
import { useRegisterMutation } from '../../hooks/mutation/auth';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import concertImage from '../../assets/images/concert.jpg';
import { useAuth } from '../../hooks/use-auth';
import { APIError } from '../../libs/api/types';

const schema = z
  .object({
    name: z.string().min(5, { message: 'Imię musi mieć co najmniej 5 znaków' }),
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
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
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
      navigate('/login');
    },
    onError: (err) => {
      if (err.response?.status === 409) {
        if (err.response.data.message?.includes('email')) {
          setError('email', { message: 'Użytkownik z takim adresem email już istnieje' }, { shouldFocus: true });
        }
        if (err.response.data.message?.includes('name')) {
          setError('name', { message: 'Użytkownik z taka mazwą już istnieje' }, { shouldFocus: true });
        }
      }
    },
  });

  const onSubmit = async (data: RegisterFormInput) => {
    await registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
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
        <img src={concertImage} className={'w-full h-full object-cover flex'} />
        <div className={'px-10 my-auto max-w-[600px] w-full mx-auto'}>
          <h1 className={'text-3xl mb-3 font-semibold'}>Zarejestruj się</h1>
          <p className={'mb-10'}>
            Masz już konto
            <Link to={'/login'} className={'text-blue-400 ml-1'}>
              Zaloguj się
            </Link>
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className={'flex flex-col space-y-3'}>
            <FormInput label={'nazwa użytkownika'} name={'name'} register={register} error={errors.name} />
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
            {/*{APIErrorMessage && <FormErrorMessage message={APIErrorMessage} />}*/}
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
