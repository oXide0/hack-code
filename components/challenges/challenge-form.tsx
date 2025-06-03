'use client';

import { DIFFICULTY_OPTIONS } from '@/lib/utils';
import { Button, Card, Field, Heading, Input, Select, Stack, Textarea, createListCollection } from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';

type ChallengeFormValues = {
    title: string;
    description: string;
    difficulty: number;
    exampleContent?: string;
    assignedStudents: string[];
    assignedClasses: string[];
};

interface ChallengeFormProps {
    readonly defaultValues?: Partial<ChallengeFormValues>;
    readonly onSubmit: (data: ChallengeFormValues) => void | Promise<void>;
    readonly isLoading?: boolean;
    readonly classes: { label: string; value: string }[];
    readonly students: { label: string; value: string }[];
}

export function ChallengeForm(props: ChallengeFormProps) {
    const {
        register,
        control,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<ChallengeFormValues>({
        defaultValues: {
            title: '',
            description: '',
            difficulty: 1,
            exampleContent: '',
            assignedStudents: [],
            assignedClasses: [],
            ...props.defaultValues
        }
    });

    const difficulties = createListCollection({
        items: DIFFICULTY_OPTIONS
    });

    return (
        <Card.Root
            as='form'
            onSubmit={handleSubmit(props.onSubmit)}
            bg='gray.800'
            border='1px solid'
            borderColor='gray.700'
            borderRadius='xl'
            w='full'
            maxW='none'
            p={8}
            mt={2}
        >
            <Heading fontSize='2xl' pb={8}>
                Create challenge
            </Heading>
            <Stack gap={5} w='full'>
                <Field.Root required>
                    <Field.Label>Title</Field.Label>
                    <Input
                        placeholder='Challenge title'
                        bg='gray.900'
                        {...register('title', { required: 'Title is required' })}
                    />
                    <Field.HelperText>Enter a short, descriptive name.</Field.HelperText>
                    <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root required>
                    <Field.Label>Description</Field.Label>
                    <Textarea
                        bg='gray.900'
                        placeholder='Describe the challenge'
                        minH='120px'
                        {...register('description', { required: 'Description is required' })}
                    />
                    <Field.HelperText>State the problem or instructions for this challenge.</Field.HelperText>
                    <Field.ErrorText>{errors.description?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root required>
                    <Controller
                        control={control}
                        name='difficulty'
                        rules={{ required: 'Difficulty is required' }}
                        render={({ field }) => (
                            <Select.Root
                                collection={difficulties}
                                value={field.value ? [String(field.value)] : []}
                                onValueChange={(details) => {
                                    const val = details.value?.[0];
                                    field.onChange(Number(val));
                                    setValue('difficulty', Number(val));
                                }}
                            >
                                <Select.HiddenSelect />
                                <Select.Label>Difficulty</Select.Label>
                                <Select.Control bg='gray.900'>
                                    <Select.Trigger>
                                        <Select.ValueText placeholder='Select difficulty' />
                                    </Select.Trigger>
                                    <Select.IndicatorGroup>
                                        <Select.Indicator />
                                        <Select.ClearTrigger />
                                    </Select.IndicatorGroup>
                                </Select.Control>
                                <Select.Positioner>
                                    <Select.Content>
                                        {difficulties.items.map((option) => (
                                            <Select.Item key={option.value} item={option}>
                                                {option.label}
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Positioner>
                            </Select.Root>
                        )}
                    />
                    <Field.HelperText>Select the challenge difficulty.</Field.HelperText>
                    <Field.ErrorText>{errors.difficulty?.message as string}</Field.ErrorText>
                </Field.Root>

                <Field.Root>
                    <Field.Label>Example Content</Field.Label>
                    <Textarea
                        bg='gray.900'
                        placeholder='Give an example (optional)'
                        minH='120px'
                        {...register('exampleContent')}
                    />
                    <Field.HelperText>Provide sample inputs/outputs or use cases.</Field.HelperText>
                    <Field.ErrorText>{errors.exampleContent?.message}</Field.ErrorText>
                </Field.Root>

                <Controller
                    control={control}
                    name='assignedClasses'
                    render={({ field }) => (
                        <Select.Root
                            multiple
                            collection={createListCollection({ items: props.classes })}
                            onValueChange={(details) => field.onChange(details.value)}
                        >
                            <Select.HiddenSelect />
                            <Select.Label>Assign Classes</Select.Label>
                            <Select.Control bg='gray.900'>
                                <Select.Trigger>
                                    <Select.ValueText placeholder='Assign to classes' />
                                </Select.Trigger>
                                <Select.IndicatorGroup>
                                    <Select.Indicator />
                                    <Select.ClearTrigger />
                                </Select.IndicatorGroup>
                            </Select.Control>
                            <Select.Positioner>
                                <Select.Content>
                                    {props.classes.map((option) => (
                                        <Select.Item key={option.value} item={option}>
                                            {option.label}
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Select.Root>
                    )}
                />

                <Controller
                    control={control}
                    name='assignedStudents'
                    render={({ field }) => (
                        <Select.Root
                            multiple
                            collection={createListCollection({ items: props.students })}
                            onValueChange={(details) => field.onChange(details.value)}
                        >
                            <Select.HiddenSelect />
                            <Select.Label>Assign Students</Select.Label>
                            <Select.Control bg='gray.900'>
                                <Select.Trigger>
                                    <Select.ValueText placeholder='Assign to students' />
                                </Select.Trigger>
                                <Select.IndicatorGroup>
                                    <Select.Indicator />
                                    <Select.ClearTrigger />
                                </Select.IndicatorGroup>
                            </Select.Control>
                            <Select.Positioner>
                                <Select.Content>
                                    {props.students.map((option) => (
                                        <Select.Item key={option.value} item={option}>
                                            {option.label}
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Select.Root>
                    )}
                />

                <Button
                    colorScheme='green'
                    mt={4}
                    type='submit'
                    loading={isSubmitting || props.isLoading}
                    w='fit-content'
                    alignSelf='flex-end'
                    colorPalette='green'
                >
                    Create Challenge
                </Button>
            </Stack>
        </Card.Root>
    );
}
