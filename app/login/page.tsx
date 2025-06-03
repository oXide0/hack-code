import { LoginForm } from '@/components/login/login-form';
import { Box, Flex, Heading } from '@chakra-ui/react';
import Image from 'next/image';

export default function Page() {
    return (
        <Flex minH='100vh' align='center' justify='center'>
            <Box w='full' maxW='md' p={8} borderWidth={1} borderRadius='lg' bg='#232323' boxShadow='lg'>
                <Flex justify='center' mb={8}>
                    <Image src='/logo.svg' alt='Company Logo' width={254} height={31} objectFit='contain' />
                </Flex>

                <Heading as='h1' size='lg' mb={6} textAlign='center'>
                    Sign in to your account
                </Heading>

                <LoginForm />
            </Box>
        </Flex>
    );
}
