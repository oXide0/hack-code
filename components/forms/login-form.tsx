'use client';

import { toaster } from '@/components/ui/toaster';
import { Button, Field, IconButton, Input, InputGroup, Text } from '@chakra-ui/react';
import { Eye, EyeOff } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type LoginFormInputs = {
    email: string;
    password: string;
};

export function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormInputs>();

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
            <Field.Root mb={4}>
                <Field.Label>Email address</Field.Label>
                <Input
                    variant='subtle'
                    type='email'
                    placeholder='your@email.com'
                    {...register('email', { required: 'Email is required' })}
                />
                {errors.email && (
                    <Text color='red.400' fontSize='sm'>
                        {errors.email.message}
                    </Text>
                )}
            </Field.Root>

            <Field.Root mb={6}>
                <Field.Label>Password</Field.Label>
                <InputGroup
                    endElement={
                        <IconButton
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            variant='ghost'
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </IconButton>
                    }
                >
                    <Input
                        variant='subtle'
                        type={showPassword ? 'text' : 'password'}
                        placeholder='••••••••'
                        {...register('password', { required: 'Password is required' })}
                    />
                </InputGroup>
                {errors.password && (
                    <Text color='red.400' fontSize='sm'>
                        {errors.password.message}
                    </Text>
                )}
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
