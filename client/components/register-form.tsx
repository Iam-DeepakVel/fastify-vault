import { useForm } from 'react-hook-form';
import FormWrapper from './form-wrapper';
import {
  FormControl,
  FormLabel,
  Heading,
  Input,
  FormErrorMessage,
  Button,
} from '@chakra-ui/react';
import { generateVaultKey, hashPassword } from '@/helpers/crypto';
import { registerUser } from '@/api';
import { useMutation } from 'react-query';
import { Step } from '@/app/page';

type RegisterFormProps = {
  setVaultKey: React.Dispatch<React.SetStateAction<string>>;
  setStep: React.Dispatch<React.SetStateAction<Step>>;
};

export default function RegisterForm({
  setVaultKey,
  setStep,
}: RegisterFormProps) {
  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<{ email: string; password: string; hashedPassword: string }>();

  const mutation = useMutation(registerUser, {
    onSuccess: ({ salt, vault }) => {
      const hashedPassword = getValues('hashedPassword');
      const email = getValues('email');
      const vaultKey = generateVaultKey({
        hashedPassword,
        email,
        salt,
      });

      window.sessionStorage.setItem('vault_key', JSON.stringify(vaultKey));

      setVaultKey(vaultKey);

      window.sessionStorage.setItem('vault', '');

      setStep('vault');
    },
  });

  return (
    <FormWrapper
      onSubmit={handleSubmit(() => {
        const email = getValues('email');
        const password = getValues('password');
        const hashedPassword = hashPassword(password);

        setValue('hashedPassword', hashedPassword);

        mutation.mutate({
          email,
          hashedPassword,
        });
      })}
    >
      <Heading>Register</Heading>
      <FormControl mt="4">
        <FormLabel htmlFor="email">Email</FormLabel>
        <Input
          id="email"
          placeholder="Email"
          {...register('email', {
            required: 'Email is required',
            minLength: { value: 4, message: 'Email must be 4 characters long' },
          })}
        />
        <FormErrorMessage>
          {errors.email && errors.email.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl mt="4">
        <FormLabel htmlFor="password">Password</FormLabel>
        <Input
          id="password"
          placeholder="Password"
          type="password"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be 6 characters long',
            },
          })}
        />
        <FormErrorMessage>
          {errors.password && errors.password.message}
        </FormErrorMessage>
      </FormControl>

      <Button type="submit" mt="10" bgColor="black" outlineColor="black">
        Register
      </Button>
    </FormWrapper>
  );
}
