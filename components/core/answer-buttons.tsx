'use client';

import { Alert, Button, Stack } from '@chakra-ui/react';
import { ArrowRight, SendHorizonal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface AnswerButtonsProps {
    readonly answers: Array<{ value: string; isCorrect: boolean }>;
    readonly isLastStep: boolean;
    readonly onSubmit: () => Promise<void>;
}

export function AnswerButtons(props: AnswerButtonsProps) {
    const [result, setResult] = useState<{ isCorrect: boolean; message: string } | null>(null);

    const handleAnswer = async (isCorrect: boolean) => {
        if (isCorrect) {
            setResult({ isCorrect: true, message: 'Correct answer!' });
        } else {
            setResult({ isCorrect: false, message: 'Wrong answer! Try again.' });
        }
    };

    return (
        <>
            <Stack direction='column'>
                {props.answers.map((answer, index) => (
                    <Button key={index} variant='surface' onClick={() => handleAnswer(answer.isCorrect)}>
                        {answer.value}
                    </Button>
                ))}
            </Stack>

            {result != null && (
                <Alert.Root status={result.isCorrect ? 'success' : 'warning'} mt={6}>
                    <Alert.Indicator />
                    <Alert.Content>
                        <Alert.Title>{result.message}</Alert.Title>
                        {result.isCorrect && <Alert.Description>Keep Going!</Alert.Description>}
                    </Alert.Content>
                    {result.isCorrect && (
                        <Button onClick={props.onSubmit}>
                            {props.isLastStep ? (
                                <>
                                    Submit <SendHorizonal />
                                </>
                            ) : (
                                <>
                                    Next Question <ArrowRight />
                                </>
                            )}
                        </Button>
                    )}
                </Alert.Root>
            )}
        </>
    );
}
