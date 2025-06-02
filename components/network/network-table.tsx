'use client';

import { ActionBar, Button, Checkbox, Flex, Heading, Portal, Stack, Table, Text, VStack } from '@chakra-ui/react';
import { Plus, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toaster } from '../ui/toaster';
import { AddClassDrawer, AddClassFormValues } from './add-class-drawer';

interface Class {
    readonly id: string;
    readonly name: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly schoolId: string;
    readonly teachers: {
        id: string;
        user: {
            email: string;
            firstName: string;
            lastName: string;
        };
    }[];
    readonly students: {
        id: string;
        user: {
            email: string;
            firstName: string;
            lastName: string;
        };
    }[];
}

interface NetworkTableProps {
    readonly schoolId: string;
    readonly items: Class[];
    readonly students: { label: string; value: string }[];
    readonly teachers: { label: string; value: string }[];
    readonly onAddClass: (args: { data: AddClassFormValues; schoolId: string }) => Promise<void>;
    readonly onDeleteClass: (classIds: string[]) => Promise<void>;
}

export function NetworkTable(props: NetworkTableProps) {
    const router = useRouter();
    const [selection, setSelection] = useState<string[]>([]);
    const [addClassDrawerOpen, setAddClassDrawerOpen] = useState<boolean>(false);

    const hasSelection = selection.length > 0;
    const indeterminate = hasSelection && selection.length < props.items.length;

    return (
        <Stack w='full' gap={2} pt={4}>
            <AddClassDrawer
                open={addClassDrawerOpen}
                setOpen={setAddClassDrawerOpen}
                students={props.students}
                teachers={props.teachers}
                onSubmit={(data) => {
                    props.onAddClass({ schoolId: props.schoolId, data });
                    toaster.success({
                        title: 'Class added successfully',
                        description: `Class "${data.name}" has been added.`,
                        closable: true
                    });
                    router.refresh();
                }}
            />
            <Flex justify='space-between' gap={4}>
                <Heading size='3xl'>Classes</Heading>
                <Stack direction='row'>
                    {/* <Button size='sm'>
                        <UserPlus />
                        Invite teacher/student
                    </Button> */}
                    <Button size='sm' onClick={() => setAddClassDrawerOpen(true)}>
                        <Plus />
                        Add class
                    </Button>
                </Stack>
            </Flex>
            <Table.Root borderWidth='2px' borderColor='gray.700' borderRadius='xl'>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader w='6'>
                            <Checkbox.Root
                                size='sm'
                                top='0.5'
                                aria-label='Select all rows'
                                checked={indeterminate ? 'indeterminate' : selection.length > 0}
                                onCheckedChange={(changes) => {
                                    setSelection(changes.checked ? props.items.map((item) => item.id) : []);
                                }}
                            >
                                <Checkbox.HiddenInput />
                                <Checkbox.Control borderColor='gray.400' />
                            </Checkbox.Root>
                        </Table.ColumnHeader>
                        <Table.ColumnHeader>Name</Table.ColumnHeader>
                        <Table.ColumnHeader>Teachers</Table.ColumnHeader>
                        <Table.ColumnHeader>Students</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {props.items.map((item) => (
                        <Table.Row
                            key={item.id}
                            data-selected={selection.includes(item.id) ? '' : undefined}
                            bg='gray.800'
                        >
                            <Table.Cell>
                                <Checkbox.Root
                                    size='sm'
                                    top='0.5'
                                    aria-label='Select row'
                                    checked={selection.includes(item.id)}
                                    onCheckedChange={(changes) => {
                                        setSelection((prev) =>
                                            changes.checked
                                                ? [...prev, item.id]
                                                : selection.filter((id) => id !== item.id)
                                        );
                                    }}
                                >
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control borderColor='gray.400' />
                                </Checkbox.Root>
                            </Table.Cell>
                            <Table.Cell>{item.name}</Table.Cell>
                            <Table.Cell>
                                <VStack align='flex-start' gap={1}>
                                    {item.teachers.length > 0 ? (
                                        item.teachers.map((t) => (
                                            <Text key={t.id}>
                                                {t.user.firstName} {t.user.lastName}
                                                <Text as='span' fontSize='xs' color='gray.400' ml={2}>
                                                    {t.user.email}
                                                </Text>
                                            </Text>
                                        ))
                                    ) : (
                                        <Text color='gray.400' fontSize='sm'>
                                            –
                                        </Text>
                                    )}
                                </VStack>
                            </Table.Cell>
                            <Table.Cell>
                                <VStack align='flex-start' gap={1}>
                                    {item.students.length > 0 ? (
                                        item.students.map((s) => (
                                            <Text key={s.id}>
                                                {s.user.firstName} {s.user.lastName}
                                                <Text as='span' fontSize='xs' color='gray.400' ml={2}>
                                                    {s.user.email}
                                                </Text>
                                            </Text>
                                        ))
                                    ) : (
                                        <Text color='gray.400' fontSize='sm'>
                                            –
                                        </Text>
                                    )}
                                </VStack>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>

            <ActionBar.Root open={hasSelection}>
                <Portal>
                    <ActionBar.Positioner>
                        <ActionBar.Content>
                            <ActionBar.SelectionTrigger>{selection.length} selected</ActionBar.SelectionTrigger>
                            <ActionBar.Separator />
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => {
                                    props.onDeleteClass(selection);
                                    setSelection([]);
                                    toaster.success({
                                        title: 'Classes deleted successfully',
                                        description: `Deleted ${selection.length} class${selection.length > 1 ? 'es' : ''}.`,
                                        closable: true
                                    });
                                    router.refresh();
                                }}
                            >
                                <Trash /> Delete
                            </Button>
                        </ActionBar.Content>
                    </ActionBar.Positioner>
                </Portal>
            </ActionBar.Root>
        </Stack>
    );
}
