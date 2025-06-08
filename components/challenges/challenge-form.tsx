'use client';

import { DIFFICULTY_OPTIONS, OptionType } from '@/lib/utils';
import {
    Button,
    Card,
    createListCollection,
    Field,
    Flex,
    Heading,
    Input,
    Select,
    Stack,
    Textarea
} from '@chakra-ui/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Controller, useForm } from 'react-hook-form';

type ChallengeFormValues = {
    title: string;
    description: string;
    difficulty: number;
    deadline: Date;
    exampleContent?: string;
    assignedStudents: string[];
    assignedClasses: string[];
};

interface ChallengeFormProps {
    readonly initialValues?: ChallengeFormValues;
    readonly onSubmit: (data: ChallengeFormValues) => void | Promise<void>;
    readonly isLoading?: boolean;
    readonly classes: (OptionType & { students: OptionType[] })[];
    readonly students: OptionType[];
}

export function ChallengeForm(props: ChallengeFormProps) {
    const [deadline, setDeadline] = useState<Date | null>(null);
    const {
        register,
        control,
        handleSubmit,
        setValue,
        getValues,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<ChallengeFormValues>({
        defaultValues: {
            title: '',
            description: '',
            difficulty: undefined,
            deadline: undefined,
            exampleContent: '',
            assignedStudents: [],
            assignedClasses: []
        },
        mode: 'onChange'
    });

    const difficulties = createListCollection({
        items: DIFFICULTY_OPTIONS
    });

    const getStudentsForSelectedClasses = (selectedClassIds: string[]) => {
        const studentsSet = new Set<string>();
        props.classes
            .filter((cls) => selectedClassIds.includes(cls.value))
            .forEach((cls) => cls.students.forEach((stu) => studentsSet.add(stu.value)));
        return Array.from(studentsSet);
    };

    useEffect(() => {
        if (props.initialValues != null) {
            reset(props.initialValues);
            setDeadline(props.initialValues.deadline);
        }
    }, [props.initialValues]);

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
                <Field.Root invalid={!!errors.title}>
                    <Field.Label>Title</Field.Label>
                    <Input
                        placeholder='Challenge title'
                        bg='gray.900'
                        {...register('title', { required: 'Title is required' })}
                    />
                    <Field.HelperText>Enter a short, descriptive name.</Field.HelperText>
                    <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root>
                    <Field.Label>Description</Field.Label>
                    <Textarea
                        bg='gray.900'
                        placeholder='Write a description'
                        minH='120px'
                        {...register('description', { required: 'Description is required' })}
                    />
                    <Field.HelperText>
                        Clearly explain what the challenge requires and specify any rules or constraints.
                    </Field.HelperText>
                    <Field.ErrorText>{errors.description?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!errors.deadline}>
                    <Field.Label>Deadline</Field.Label>
                    <Controller
                        name='deadline'
                        control={control}
                        rules={{ required: 'Deadline is required' }}
                        render={({ field }) => (
                            <DatePicker
                                dateFormat='yyyy.MM.dd'
                                selected={deadline}
                                placeholderText='Select deadline'
                                onChange={(date) => {
                                    if (date == null) return;
                                    setDeadline(date);
                                    field.onChange(date);
                                }}
                            />
                        )}
                    />
                    <Field.HelperText>Deadline for this challenge.</Field.HelperText>
                    <Field.ErrorText>{errors.deadline?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!errors.difficulty}>
                    <Controller
                        control={control}
                        name='difficulty'
                        rules={{ required: 'Difficulty is required' }}
                        render={({ field }) => (
                            <Select.Root
                                value={field.value ? [String(field.value)] : []}
                                collection={difficulties}
                                onValueChange={(details) => {
                                    const val = details.value?.[0];
                                    field.onChange(Number(val));
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
                                                <Select.ItemIndicator />
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Positioner>
                            </Select.Root>
                        )}
                    />
                    <Field.HelperText>Select the challenge difficulty.</Field.HelperText>
                    <Field.ErrorText>{errors.difficulty?.message}</Field.ErrorText>
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

                <Field.Root invalid={!!errors.assignedClasses}>
                    <Controller
                        control={control}
                        name='assignedClasses'
                        rules={{
                            validate: (value, formValues) =>
                                value.length > 0 || formValues.assignedStudents.length > 0
                                    ? true
                                    : 'You must assign at least one class or one student.'
                        }}
                        render={({ field }) => (
                            <Select.Root
                                value={field.value}
                                multiple
                                collection={createListCollection({ items: props.classes })}
                                onValueChange={({ value }) => {
                                    field.onChange(value);

                                    // Gather students from all selected classes
                                    const studentsFromClasses = getStudentsForSelectedClasses(value);

                                    // Also include any already-selected students that are not class members
                                    const prevStudents = getValues('assignedStudents') || [];
                                    const combined = Array.from(new Set([...prevStudents, ...studentsFromClasses]));

                                    setValue('assignedStudents', combined);
                                }}
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
                                                <Select.ItemIndicator />
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Positioner>
                            </Select.Root>
                        )}
                    />
                    <Field.ErrorText>{errors.assignedClasses?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!errors.assignedStudents}>
                    <Controller
                        control={control}
                        name='assignedStudents'
                        rules={{
                            validate: (value, formValues) =>
                                value.length > 0 || formValues.assignedClasses.length > 0
                                    ? true
                                    : 'You must assign at least one class or one student.'
                        }}
                        render={({ field }) => (
                            <Select.Root
                                value={field.value}
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
                                                <Select.ItemIndicator />
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Positioner>
                            </Select.Root>
                        )}
                    />
                    <Field.ErrorText>{errors.assignedStudents?.message}</Field.ErrorText>
                </Field.Root>

                <Flex w='full' justify='flex-end' gap={2} pt={4}>
                    <Link href='/challenges'>
                        <Button variant='outline' borderColor='gray.700' loading={isSubmitting || props.isLoading}>
                            Cancel
                        </Button>
                    </Link>
                    <Button type='submit' loading={isSubmitting || props.isLoading} colorPalette='green'>
                        Create Challenge
                    </Button>
                </Flex>
            </Stack>
        </Card.Root>
    );
}
