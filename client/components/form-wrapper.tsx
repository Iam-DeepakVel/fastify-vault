import { BoxProps, Box } from '@chakra-ui/react';

type FormWrapperProps = {
  children: React.ReactNode;
};

function FormWrapper({ children, ...props }: FormWrapperProps & BoxProps) {
  return (
    <Box w="100%" maxW="container.sm" boxShadow="xl" p="8" as="form" {...props}>
      {children}
    </Box>
  );
}

export default FormWrapper;
