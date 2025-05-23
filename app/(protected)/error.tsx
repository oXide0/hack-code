'use client';

import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface ErrorPageProps {
    error?: Error & { digest?: string };
    reset?: () => void;
    statusCode?: number;
    title?: string;
    message?: string;
}

export default function ErrorPage({
    error,
    reset,
    statusCode = 500,
    title = 'Something went wrong',
    message = 'An unexpected error occurred'
}: ErrorPageProps) {
    // Custom messages based on status code
    const errorMessages: Record<number, { title: string; message: string }> = {
        404: {
            title: 'Page Not Found',
            message: "The page you're looking for doesn't exist or has been moved."
        },
        401: {
            title: 'Unauthorized',
            message: 'You need to be logged in to access this page.'
        },
        403: {
            title: 'Forbidden',
            message: "You don't have permission to access this resource."
        },
        500: {
            title: 'Server Error',
            message: 'Something went wrong on our end. Please try again later.'
        }
    };

    const { title: statusTitle, message: statusMessage } = errorMessages[statusCode] || { title, message };

    return (
        <Box
            maxW='md'
            w='full'
            p={8}
            borderWidth='1px'
            borderRadius='lg'
            borderColor='gray.700'
            boxShadow='md'
            textAlign='center'
            bg='red.500'
        >
            <VStack gap={6}>
                <AlertTriangle color='red.300' />

                <Heading as='h1' size='xl'>
                    {statusTitle}
                </Heading>

                <Text fontSize='lg' color='gray.100'>
                    {statusMessage}
                </Text>

                {error?.message && (
                    <Box
                        p={4}
                        bg='red.50'
                        borderRadius='md'
                        borderLeftWidth='4px'
                        borderLeftColor='red.300'
                        textAlign='left'
                        w='full'
                    >
                        <Text fontFamily='mono' color='gray.700'>
                            {error.message}
                        </Text>
                    </Box>
                )}

                <VStack gap={3} w='full'>
                    {reset && (
                        <Button colorScheme='blue' onClick={reset} w='full' size='lg'>
                            Try Again
                        </Button>
                    )}

                    <Link href='/' passHref>
                        <Button variant='outline' w='full' size='lg'>
                            Return Home
                        </Button>
                    </Link>
                </VStack>
            </VStack>
        </Box>
    );
}
