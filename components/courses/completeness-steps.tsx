import { Box, Stack } from '@chakra-ui/react';

export function CompletenessSteps(props: { steps: { isCompleted: boolean }[] }) {
    return (
        <Stack direction='row' gap={2}>
            {props.steps.map((step, index) => (
                <Step key={index} isActive={step.isCompleted} />
            ))}
        </Stack>
    );
}

function Step(props: { isActive: boolean }) {
    return <Box bg={props.isActive ? 'green.300' : 'gray.500'} w={8} h={2} borderRadius='full' />;
}
