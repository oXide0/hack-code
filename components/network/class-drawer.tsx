import { OptionType } from '@/lib/utils';
import {
    Button,
    CloseButton,
    createListCollection,
    Drawer,
    Field,
    Input,
    Portal,
    Select,
    Stack
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

export interface ClassFormValues {
    name: string;
    teachers: string[];
    students: string[];
}

interface ClassDrawerProps {
    readonly open: boolean;
    readonly setOpen: (open: boolean) => void;
    readonly isAdmin: boolean;
    readonly initialValues?: ClassFormValues;
    readonly teachers: OptionType[];
    readonly students: OptionType[];
    readonly onSubmit: (data: ClassFormValues) => void;
}

export function ClassDrawer(props: ClassDrawerProps) {
    const teachersCollection = createListCollection({ items: props.teachers });
    const studentsCollection = createListCollection({ items: props.students });

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<ClassFormValues>({
        defaultValues: { name: '', teachers: [], students: [] }
    });

    useEffect(() => {
        if (props.initialValues != null) {
            reset(props.initialValues);
        }
    }, [props.initialValues]);

    const internalSubmit = async (data: ClassFormValues) => {
        props.onSubmit(data);
    };

    return (
        <Drawer.Root open={props.open} onOpenChange={(e) => props.setOpen(e.open)}>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content maxW='400px'>
                        <Drawer.Header>
                            <Drawer.Title fontSize='xl'>Add New Class</Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body>
                            <form id='add-class-form' onSubmit={handleSubmit(internalSubmit)}>
                                <Stack gap={5}>
                                    <Field.Root invalid={!!errors.name} disabled={!props.isAdmin}>
                                        <Field.Label>Name</Field.Label>
                                        <Input
                                            {...register('name', {
                                                required: 'Class name is required',
                                                minLength: { value: 2, message: 'At least 2 characters' }
                                            })}
                                            placeholder='Class name'
                                        />
                                        <Field.ErrorText>{errors.name && errors.name.message}</Field.ErrorText>
                                    </Field.Root>

                                    <Field.Root invalid={!!errors.teachers} disabled={!props.isAdmin}>
                                        <Controller
                                            control={control}
                                            name='teachers'
                                            rules={{ required: 'At least one teacher is required' }}
                                            render={({ field }) => (
                                                <Select.Root
                                                    collection={teachersCollection}
                                                    value={
                                                        field.value && field.value.length ? field.value.map(String) : []
                                                    }
                                                    onValueChange={(details) => {
                                                        const val = details.value;
                                                        field.onChange(val);
                                                        setValue('teachers', val);
                                                    }}
                                                    multiple
                                                >
                                                    <Select.HiddenSelect />
                                                    <Select.Label>Teachers</Select.Label>
                                                    <Select.Control bg='gray.900'>
                                                        <Select.Trigger>
                                                            <Select.ValueText placeholder='Select teachers' />
                                                        </Select.Trigger>
                                                        <Select.IndicatorGroup>
                                                            <Select.Indicator />
                                                            <Select.ClearTrigger />
                                                        </Select.IndicatorGroup>
                                                    </Select.Control>
                                                    <Select.Positioner>
                                                        <Select.Content>
                                                            {teachersCollection.items.map((option) => (
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
                                        <Field.HelperText>Select one or more teachers for this class.</Field.HelperText>
                                        <Field.ErrorText>{errors.teachers?.message as string}</Field.ErrorText>
                                    </Field.Root>

                                    <Field.Root invalid={!!errors.students}>
                                        <Controller
                                            control={control}
                                            name='students'
                                            rules={{ required: 'At least one student is required' }}
                                            render={({ field }) => (
                                                <Select.Root
                                                    collection={studentsCollection}
                                                    value={
                                                        field.value && field.value.length ? field.value.map(String) : []
                                                    }
                                                    onValueChange={(details) => {
                                                        const val = details.value;
                                                        field.onChange(val);
                                                        setValue('students', val);
                                                    }}
                                                    multiple
                                                >
                                                    <Select.HiddenSelect />
                                                    <Select.Label>Students</Select.Label>
                                                    <Select.Control bg='gray.900'>
                                                        <Select.Trigger>
                                                            <Select.ValueText placeholder='Select students' />
                                                        </Select.Trigger>
                                                        <Select.IndicatorGroup>
                                                            <Select.Indicator />
                                                            <Select.ClearTrigger />
                                                        </Select.IndicatorGroup>
                                                    </Select.Control>
                                                    <Select.Positioner>
                                                        <Select.Content>
                                                            {studentsCollection.items.map((option) => (
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
                                        <Field.HelperText>Select one or more students for this class.</Field.HelperText>
                                        <Field.ErrorText>{errors.students?.message as string}</Field.ErrorText>
                                    </Field.Root>
                                </Stack>
                            </form>
                        </Drawer.Body>
                        <Drawer.Footer>
                            <Button
                                variant='outline'
                                onClick={() => {
                                    props.setOpen(false);
                                    reset();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button colorScheme='green' type='submit' form='add-class-form' loading={isSubmitting}>
                                Save
                            </Button>
                        </Drawer.Footer>
                        <Drawer.CloseTrigger asChild>
                            <CloseButton size='sm' />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    );
}
