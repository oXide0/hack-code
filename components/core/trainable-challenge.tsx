'use client';

import { Box, Button, Card, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { Play, SendHorizonal } from 'lucide-react';
import { useState } from 'react';
import { CodeEditor } from './code-editor';
import { PythonEditor } from './python-runner';
import { toaster } from '../ui/toaster';

interface TrainableChallengeProps {
    readonly title: string;
    readonly description: string;
    readonly difficulty: number;
    readonly exampleContent: string | null;
    readonly onSubmit: (solution: string) => void;
}

export function TrainableChallenge(props: TrainableChallengeProps) {
    const [showEditor, setShowEditor] = useState<boolean>(false);
    const [solution, setSolution] = useState<string>('');

    return (
        <Flex gap={2} minH='calc(100vh - 181px)' pt={2}>
            <Card.Root
                w='50%'
                p={8}
                pb={4}
                borderRadius='xl'
                bg='gray.900'
                boxShadow='lg'
                borderWidth='1px'
                borderColor='gray.700'
                display='flex'
                flexDirection='column'
                minH='full'
            >
                <Stack flex='1 1 auto'>
                    <Heading as='h1' size='xl' mb={2} color='green.200'>
                        {props.title}
                    </Heading>
                    <Text fontSize='md' color='gray.400' mb={4}>
                        Difficulty: <b>{props.difficulty}</b>
                    </Text>
                    <Text color='gray.200' mb={8}>
                        {props.description}
                    </Text>
                    {props.exampleContent && (
                        <>
                            <Text fontWeight='semibold' pb={4}>
                                Example
                            </Text>
                            <CodeEditor fileName='example' initialContent={props.exampleContent} isReadOnly />
                        </>
                    )}
                </Stack>
                <Button size='lg' onClick={() => setShowEditor(true)}>
                    Start
                    <Play />
                </Button>
            </Card.Root>
            <Card.Root
                w='50%'
                p={2}
                pb={4}
                borderRadius='xl'
                bg='gray.900'
                boxShadow='lg'
                borderWidth='1px'
                borderColor='gray.700'
                display='flex'
                flexDirection='column'
                minH='full'
            >
                {showEditor ? (
                    <>
                        <Box flex='1 1 auto'>
                            <PythonEditor
                                fileName='solution.py'
                                minHeight='300px'
                                code={solution}
                                onChange={(code) => setSolution(code)}
                            />
                        </Box>
                        <Button
                            size='lg'
                            onClick={() => {
                                props.onSubmit(solution);
                                setShowEditor(false);
                                setSolution('');
                                toaster.success({ title: 'Solution submitted successfully!' });
                            }}
                        >
                            Submit
                            <SendHorizonal />
                        </Button>
                    </>
                ) : (
                    <Flex h='100%' align='center' justify='center' color='gray.500' fontWeight='semibold' fontSize='lg'>
                        Click "Start" to start coding!
                    </Flex>
                )}
            </Card.Root>
        </Flex>
    );
}
