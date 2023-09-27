import { VaultItem } from '@/app/page';
import { useForm, useFieldArray } from 'react-hook-form';
import FormWrapper from './form-wrapper';
import { Box, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';
import { encryptVault } from '@/helpers/crypto';
import { saveVault } from '@/api';
import { useMutation } from 'react-query';

export default function Vault({
  vault = [],
  vaultKey = '',
}: {
  vault: VaultItem[];
  vaultKey: string;
}) {
  const { control, register, handleSubmit } = useForm({
    defaultValues: { vault },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'vault',
  });

  const mutation = useMutation(saveVault);

  return (
    <FormWrapper
      onSubmit={handleSubmit(({ vault }) => {
        const encryptedVault = encryptVault({
          vault: JSON.stringify({ vault }),
          vaultKey,
        });

        window.sessionStorage.setItem('vault', JSON.stringify(vault));

        mutation.mutate({
          encryptedVault,
        });
      })}
    >
      {fields.map((field, index) => {
        return (
          <Box
            my="4"
            display="flex"
            alignItems="flex-end"
            gap="4"
            key={field.id}
          >
            <FormControl>
              <FormLabel htmlFor="website">Website</FormLabel>
              <Input
                type="url"
                id="website"
                placeholder="Website"
                {...register(`vault.${index}.website`, {
                  required: 'Website is required',
                })}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input
                id="username"
                placeholder="Username"
                {...register(`vault.${index}.username`, {
                  required: 'Username is required',
                })}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                type="password"
                id="password"
                placeholder="Password"
                {...register(`vault.${index}.password`, {
                  required: 'Password is required',
                })}
              />
            </FormControl>
            <Button
              type="button"
              bg="red.500"
              fontSize="2xl"
              ml="2"
              className="bg-red-300"
              onClick={() => remove(index)}
            >
              -
            </Button>
          </Box>
        );
      })}

      <Button
        onClick={() => append({ website: '', username: '', password: '' })}
      >
        Add
      </Button>

      <Button type="submit" color="teal" ml="2">
        Save Vault
      </Button>
    </FormWrapper>
  );
}
