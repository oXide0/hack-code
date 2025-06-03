'use client';

import { onboardingSchema } from '@/lib/validation';
import { Button, Field, Input } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { PasswordInput } from '../ui/password-input';

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

interface OnboardingFormProps {
    readonly onSubmit: (data: OnboardingFormValues) => Promise<void>;
}

export function OnboardingForm(props: OnboardingFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isLoading }
    } = useForm<OnboardingFormValues>({ resolver: zodResolver(onboardingSchema) });

    return (
        <form onSubmit={handleSubmit(props.onSubmit)}>
            <Field.Root mb={4} invalid={!!errors.firstName}>
                <Field.Label>First name</Field.Label>
                <Input
                    variant='subtle'
                    placeholder='John'
                    {...register('firstName', { required: 'First name is required' })}
                />
                {errors.firstName && <Field.ErrorText>{errors.firstName.message}</Field.ErrorText>}
            </Field.Root>

            <Field.Root mb={4} invalid={!!errors.lastName}>
                <Field.Label>Last name</Field.Label>
                <Input
                    variant='subtle'
                    placeholder='Doe'
                    {...register('lastName', { required: 'Last name is required' })}
                />
                {errors.lastName && <Field.ErrorText>{errors.lastName.message}</Field.ErrorText>}
            </Field.Root>

            <Field.Root mb={6}>
                <Field.Label>Password</Field.Label>
                <PasswordInput
                    variant='subtle'
                    placeholder='••••••••'
                    {...register('password', { required: 'Password is required' })}
                />
                {errors.password && <Field.ErrorText>{errors.password.message}</Field.ErrorText>}
            </Field.Root>

            <Button type='submit' bg='green.300' width='full' loading={isLoading} loadingText='Accepting ...' mb={4}>
                Accept
            </Button>
        </form>
    );
}
