import { Box, Flex, Skeleton, SkeletonText, Stack } from '@chakra-ui/react';

export default function Loading() {
    return (
        <Box pb={10}>
            <Flex justify='space-between' gap={5} pb={4}>
                <Flex w='full' flexDir='column' minH='full' gap={6}>
                    <Skeleton height='40px' width='300px' />

                    <Stack gap={4}>
                        <SkeletonText noOfLines={4} gap={3} h={4} />
                        <SkeletonText noOfLines={6} gap={3} h={4} />
                        <Skeleton height='200px' />
                    </Stack>

                    <Skeleton height='40px' mt={4} />
                </Flex>

                <Box w='full'>
                    <Skeleton height='500px' borderRadius='md' />
                </Box>
            </Flex>
        </Box>
    );
}
