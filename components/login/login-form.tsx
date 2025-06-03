'use client';

import { toaster } from '@/components/ui/toaster';
import { Button, Field, Input, Text } from '@chakra-ui/react';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PasswordInput } from '../ui/password-input';
import { loginSchema } from '@/lib/validation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type LoginFormInputs = z.infer<typeof loginSchema>;

export function LoginForm() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormInputs>({ resolver: zodResolver(loginSchema) });

    const onSubmit = async (data: LoginFormInputs) => {
        setIsLoading(true);
        try {
            const result = await signIn('credentials', {
                ...data,
                redirect: true,
                callbackUrl: '/courses'
            });

            if (result?.error) {
                toaster.create({
                    title: 'Login Failed',
                    description: 'Invalid email or password',
                    type: 'error',
                    duration: 5000,
                    closable: true
                });
            }
        } catch (error) {
            console.error('Login error:', error);
            toaster.create({
                title: 'Error',
                description: 'An unexpected error occurred',
                type: 'error',
                duration: 5000,
                closable: true
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Field.Root mb={4} invalid={!!errors.email}>
                <Field.Label>Email address</Field.Label>
                <Input
                    variant='subtle'
                    type='email'
                    placeholder='your@email.com'
                    {...register('email', { required: 'Email is required' })}
                />
                {errors.email && <Field.ErrorText>{errors.email.message}</Field.ErrorText>}
            </Field.Root>

            <Field.Root mb={6} invalid={!!errors.password}>
                <Field.Label>Password</Field.Label>
                <PasswordInput
                    variant='subtle'
                    placeholder='••••••••'
                    {...register('password', { required: 'Password is required' })}
                />
                {errors.password && <Field.ErrorText>{errors.password.message}</Field.ErrorText>}
            </Field.Root>

            <Button type='submit' bg='green.300' width='full' loading={isLoading} loadingText='Signing in...' mb={4}>
                Sign in
            </Button>

            <Text textAlign='center' fontSize='sm' color='gray.200'>
                Don't have an account?{' '}
                <Text as='span' color='#2ECC71' fontWeight='medium'>
                    Contact administrator
                </Text>
            </Text>
        </form>
    );
}
