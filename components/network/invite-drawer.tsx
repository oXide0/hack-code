import {
    Box,
    Button,
    CloseButton,
    Drawer,
    HStack,
    IconButton,
    Input,
    Portal,
    Separator,
    Stack,
    Tabs,
    Text
} from '@chakra-ui/react';
import { GraduationCap, MailCheck, Plus, Trash, UserRoundCheck } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export interface InviteFormValues {
    variant: 'students' | 'teachers';
    emails: string[];
}

interface InviteDrawerProps {
    readonly open: boolean;
    readonly setOpen: (open: boolean) => void;
    readonly invitedStudents: string[];
    readonly invitedTeachers: string[];
    readonly onSubmit: (values: InviteFormValues) => void;
}

export function InviteDrawer(props: InviteDrawerProps) {
    const {
        setValue,
        reset,
        handleSubmit,
        watch,
        formState: { isSubmitting }
    } = useForm<InviteFormValues>({
        defaultValues: {
            variant: 'teachers',
            emails: []
        }
    });

    const emails = watch('emails', []);
    const tab = watch('variant', 'teachers');
    const [inputEmail, setInputEmail] = useState('');
    const invited = tab === 'teachers' ? props.invitedTeachers : props.invitedStudents;

    const addEmail = () => {
        if (!inputEmail) return;
        if (!emails.includes(inputEmail)) {
            setValue('emails', [...emails, inputEmail]);
        }
        setInputEmail('');
    };

    const removeEmail = (email: string) => {
        setValue(
            'emails',
            emails.filter((e) => e !== email)
        );
    };

    const internalSubmit = (data: InviteFormValues) => {
        props.onSubmit(data);
    };

    const handleClose = () => {
        props.setOpen(false);
        setInputEmail('');
        reset({ variant: 'teachers', emails: [] });
    };

    return (
        <Drawer.Root open={props.open} onOpenChange={(e) => (e.open ? undefined : handleClose())}>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content maxW='400px'>
                        <Drawer.Header>
                            <Drawer.Title fontSize='xl'>Invite teachers/students</Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body>
                            <form id='invite-form' onSubmit={handleSubmit(internalSubmit)}>
                                <Tabs.Root
                                    value={tab}
                                    onValueChange={({ value }) => {
                                        setValue('variant', value as 'teachers' | 'students');
                                        setValue('emails', []);
                                        setInputEmail('');
                                    }}
                                >
                                    <Tabs.List>
                                        <Tabs.Trigger value='teachers'>
                                            <UserRoundCheck /> Teachers
                                        </Tabs.Trigger>
                                        <Tabs.Trigger value='students'>
                                            <GraduationCap /> Students
                                        </Tabs.Trigger>
                                    </Tabs.List>
                                    <Box pt={4}>
                                        <Stack gap={4}>
                                            <HStack>
                                                <Input
                                                    placeholder='Enter email'
                                                    type='email'
                                                    value={inputEmail}
                                                    onChange={(e) => setInputEmail(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            addEmail();
                                                        }
                                                    }}
                                                />
                                                <IconButton
                                                    aria-label='Add email'
                                                    colorScheme='green'
                                                    onClick={addEmail}
                                                    type='button'
                                                >
                                                    <Plus />
                                                </IconButton>
                                            </HStack>
                                            <Stack>
                                                {emails.length === 0 && (
                                                    <Text color='gray.400' fontSize='sm'>
                                                        No {tab === 'teachers' ? 'teacher' : 'student'} emails added.
                                                    </Text>
                                                )}
                                                {emails.map((email) => (
                                                    <HStack
                                                        key={email}
                                                        justify='space-between'
                                                        bg='gray.700'
                                                        p={2}
                                                        borderRadius='md'
                                                    >
                                                        <Text fontSize='sm'>{email}</Text>
                                                        <IconButton
                                                            aria-label='Remove'
                                                            size='xs'
                                                            variant='ghost'
                                                            onClick={() => removeEmail(email)}
                                                        >
                                                            <Trash size={16} />
                                                        </IconButton>
                                                    </HStack>
                                                ))}
                                            </Stack>

                                            <Separator my={2} />
                                            <Text fontWeight='semibold' fontSize='sm' mb={1}>
                                                Already invited {tab === 'teachers' ? 'teachers' : 'students'}:
                                            </Text>
                                            {invited && invited.length > 0 ? (
                                                <Stack gap={1}>
                                                    {invited.map((email) => (
                                                        <HStack
                                                            key={email}
                                                            bg='gray.800'
                                                            px={2}
                                                            py={1}
                                                            borderRadius='md'
                                                        >
                                                            <MailCheck size={16} color='#38A169' />
                                                            <Text fontSize='sm' color='gray.200'>
                                                                {email}
                                                            </Text>
                                                        </HStack>
                                                    ))}
                                                </Stack>
                                            ) : (
                                                <Text color='gray.400' fontSize='sm'>
                                                    No {tab === 'teachers' ? 'teachers' : 'students'} have been invited
                                                    yet.
                                                </Text>
                                            )}
                                        </Stack>
                                    </Box>
                                </Tabs.Root>
                            </form>
                        </Drawer.Body>
                        <Drawer.Footer>
                            <Button variant='outline' onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button
                                colorScheme='green'
                                type='submit'
                                form='invite-form'
                                loading={isSubmitting}
                                disabled={emails.length === 0}
                            >
                                Invite
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
