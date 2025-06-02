import { Box, Button, Center, Heading, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { UserRoundCheck, GraduationCap } from 'lucide-react';

export default function Page() {
    return (
        <Center minH='100vh' bg='gray.900' color='white'>
            <Box p={8} borderRadius='lg' boxShadow='2xl' bg='gray.800' minW={{ base: '90vw', md: '400px' }} maxW='md'>
                <Heading size='lg' mb={2}>
                    Welcome to HackCode!
                </Heading>
                <Text color='gray.300' mb={8}>
                    Finish setting up your account to start learning or teaching.
                </Text>
                <Stack gap={5} mb={6}>
                    <Link href='' passHref>
                        <Button colorPalette='green' size='lg' variant='solid' w='full'>
                            <UserRoundCheck /> I'm a Teacher
                        </Button>
                    </Link>
                    <Link href='' passHref>
                        <Button colorPalette='blue' size='lg' variant='outline' w='full'>
                            <GraduationCap /> I'm a Student
                        </Button>
                    </Link>
                </Stack>
                <Text textAlign='center' color='gray.400' fontSize='sm'>
                    Already invited? Check your email for your invite link.
                </Text>
            </Box>
        </Center>
    );
}
