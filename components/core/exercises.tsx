'use client';

import { Box, Button, Container, Flex, Heading, Text } from '@chakra-ui/react';
import { Exercise } from '@prisma/client';
import { ArrowRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AnswerButtons, Answers } from './answer-buttons';
import { CodeEditor } from './code-editor';
import { CompletenessSteps } from './completeness-steps';
import { MarkdownRenderer } from './markdown-renderer';
import { Panel } from './panel';
import { PythonEditor } from './python-runner';

interface ExercisesProps {
    readonly topicId: string;
    readonly exercises: Exercise[];
    readonly onSubmit: (args: { exercises: Exercise[]; topicId: string }) => void;
}

export function Exercises(props: ExercisesProps) {
    const [exercises, setExercises] = useState<Exercise[]>(props.exercises);
    const [index, setIndex] = useState<number>(0);

    const currentExercise = useMemo<Exercise>(() => {
        return exercises[index];
    }, [exercises, index]);

    const steps = exercises.map((exercise) => ({ isCompleted: exercise.isCompleted }));
    const isLastStep = exercises[index + 1] == null;

    const handleSubmit = () => {
        const updatedExercises = [...exercises];
        updatedExercises[index] = {
            ...updatedExercises[index],
            isCompleted: true
        };

        setExercises(updatedExercises);

        if (!isLastStep) {
            setIndex((prev) => Math.min(prev + 1, exercises.length - 1));
        } else {
            props.onSubmit({ exercises: updatedExercises, topicId: props.topicId });
        }
    };

    if (currentExercise.type === 'THEORY') {
        return (
            <Box pb={10}>
                <Panel
                    title={currentExercise.id}
                    steps={steps}
                    isPossibleSkip={!isLastStep}
                    onSkip={() => {
                        setIndex((prev) => Math.min(prev + 1, exercises.length - 1));
                    }}
                >
                    <Flex justify='space-between' gap={5} pb={4}>
                        <Flex w='full' flexDir='column' minH='full'>
                            <Box flex='1 1 auto'>
                                <MarkdownRenderer content={currentExercise.content} />
                            </Box>
                            <Button w='full' mt={4} onClick={handleSubmit}>
                                {exercises[index + 1] != null ? 'Next' : 'Submit'}
                                {exercises[index + 1] != null && <ArrowRight />}
                            </Button>
                        </Flex>
                        <Box w='full'>
                            {currentExercise.codeSample != null && (
                                <CodeEditor fileName='test.py' initialContent={currentExercise.codeSample} isReadOnly />
                            )}
                        </Box>
                    </Flex>
                </Panel>
            </Box>
        );
    }

    if (currentExercise.type === 'VALIDATION') {
        return (
            <Container maxW='2xl'>
                <Flex align='center' flexDir='column' gap={2}>
                    <CompletenessSteps steps={steps} />
                    <Text fontWeight='semibold' color='gray.500' pt={2}>
                        Validation test
                    </Text>
                    <Heading>{currentExercise.id}</Heading>
                    {currentExercise.codeSample != null && (
                        <Box w='full' pt={7}>
                            <CodeEditor fileName='test.py' initialContent={currentExercise.codeSample} isReadOnly />
                        </Box>
                    )}

                    <Box w='full' pt={7}>
                        <AnswerButtons
                            answers={currentExercise.options as Answers}
                            isLastStep={isLastStep}
                            onSubmit={handleSubmit}
                        />
                    </Box>
                </Flex>
            </Container>
        );
    }

    if (currentExercise.type === 'PRACTICE') {
        return (
            <Container maxW='2xl'>
                <Flex align='center' flexDir='column' gap={2}>
                    <CompletenessSteps steps={steps} />
                    <Text fontWeight='semibold' color='gray.500' pt={2}>
                        Practice
                    </Text>
                    <Heading>{currentExercise.id}</Heading>
                    <Box w='full' pt={7}>
                        <PythonEditor fileName='script.py' minHeight='100px' />
                    </Box>
                    <Button w='full' mt={4} onClick={handleSubmit}>
                        {exercises[index + 1] != null ? 'Next' : 'Submit'}
                        {exercises[index + 1] != null && <ArrowRight />}
                    </Button>
                </Flex>
            </Container>
        );
    }
}
