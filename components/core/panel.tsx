import { Box, Button, Flex, Heading, Stack } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { CompletenessSteps } from './completeness-steps';

interface PanelProps {
    readonly title: string;
    readonly steps: { isCompleted: boolean }[];
    readonly children: ReactNode;
    readonly onSkip: () => Promise<void>;
    readonly isPossibleSkip: boolean;
}

export function Panel(props: PanelProps) {
    return (
        <Box bg='gray.800' py={3} px={4} borderRadius='xl'>
            <Flex justify='space-between'>
                <Heading>{props.title}</Heading>
                <Flex gap={3} align='center'>
                    {props.isPossibleSkip && (
                        <Button variant='plain' color='gray.400' textDecor='underline' onClick={props.onSkip}>
                            Skip
                        </Button>
                    )}

                    <Stack gap={1}>
                        <CompletenessSteps steps={props.steps} />
                    </Stack>
                </Flex>
            </Flex>
            {props.children}
        </Box>
    );
}
