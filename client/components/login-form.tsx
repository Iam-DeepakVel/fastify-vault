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
import { decryptVault, generateVaultKey, hashPassword } from '@/helpers/crypto';
import { loginUser, registerUser } from '@/api';
import { useMutation } from 'react-query';
import { Step, VaultItem } from '@/app/page';

type RegisterFormProps = {
  setVaultKey: React.Dispatch<React.SetStateAction<string>>;
  setStep: React.Dispatch<React.SetStateAction<Step>>;
  setVault: React.Dispatch<React.SetStateAction<VaultItem[]>>;
};

export default function LoginForm({
  setVaultKey,
  setStep,
  setVault,
}: RegisterFormProps) {
  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<{ email: string; password: string; hashedPassword: string }>();

  const mutation = useMutation(loginUser, {
    onSuccess: ({ salt, vault }) => {
      const hashedPassword = getValues('hashedPassword');
      const email = getValues('email');
      const vaultKey = generateVaultKey({
        hashedPassword,
        email,
        salt,
      });

      window.sessionStorage.setItem('vault_key', JSON.stringify(vaultKey));

      const decryptedVault = decryptVault({ vault, vaultKey });

      setVaultKey(vaultKey);
      setVault(decryptedVault);

      window.sessionStorage.setItem('vault', JSON.stringify(decryptedVault));

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
      <Heading>Login</Heading>
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
        Login
      </Button>
    </FormWrapper>
  );
}
