import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import FormInput from '../components/form/form-input';
import Button from '../components/common/button';
import { useRegisterMutation } from '../hooks/mutations/auth';

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

  const registerUser = useRegisterMutation(() => router.push('/login'));

  const onSubmit = (data: RegisterFormInput) => {
    registerUser({
      email: data.email,
      password: data.password,
    });
    console.log(data);
  };

  return (
    <div className={'max-w-[700px] mx-auto'}>
      <h1 className={'text-3xl mb-5'}>Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={'flex flex-col space-y-1'}>
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
        <FormInput label={'hasło'} name={'password'} register={register} type={'password'} error={errors.password} />
        <FormInput
          label={'powtórz hasło'}
          name={'confirmPassword'}
          register={register}
          type={'password'}
          error={errors.confirmPassword}
        />
        <Button type={'submit'} className={'mx-auto'}>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default RegisterPage;
