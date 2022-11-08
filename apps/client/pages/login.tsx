import { useForm } from 'react-hook-form';
import FormInput from '@components/form/form-input';
import Button from '@components/common/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoginMutation } from '@hooks/mutations';
import { useRouter } from 'next/router';

const schema = z.object({
  email: z.string().email({ message: 'Wprowadz poprawny adres email' }),
  password: z.string().min(6, { message: 'Hasło musi miec co najmniej 6 znaków' }),
});

type LoginFormInput = z.infer<typeof schema>;

const LoginPage = () => {
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

  const login = useLoginMutation(() => router.push('/'));

  const onSubmit = (data: LoginFormInput) => {
    login({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className={'max-w-[700px] mx-auto'}>
      <h1 className={'text-3xl mb-5'}>Login</h1>
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

        <Button type={'submit'} className={'mx-auto'}>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
