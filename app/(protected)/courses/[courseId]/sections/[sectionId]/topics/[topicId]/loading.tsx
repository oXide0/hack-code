import { Box, Skeleton, Stack } from '@chakra-ui/react';

export default function Loading() {
    return (
        <Box p={4}>
            <Stack gap={4}>
                <Skeleton height='40px' />
                <Skeleton height='300px' />
                <Skeleton height='80px' />
            </Stack>
        </Box>
    );
}
