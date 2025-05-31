import { Box, Card, Flex, Skeleton, SkeletonText, Stack } from '@chakra-ui/react';

export default function Loading() {
    return (
        <Flex gap={2} minH='calc(100vh - 181px)' pt={2}>
            {/* Challenge Details Card */}
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
                    <Skeleton height='40px' width='60%' mb={2} />
                    <Skeleton height='24px' width='120px' mb={4} />
                    <SkeletonText noOfLines={4} gap={3} mb={8} />
                    <Skeleton height='20px' width='90px' mb={4} />
                    <Box>
                        <Skeleton height='120px' borderRadius='md' />
                    </Box>
                </Stack>
                <Skeleton mt={6} height='44px' width='120px' borderRadius='lg' />
            </Card.Root>
            {/* Editor Card */}
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
                <Flex
                    h='100%'
                    align='center'
                    justify='center'
                    color='gray.500'
                    fontWeight='semibold'
                    fontSize='lg'
                    flex={1}
                >
                    <Skeleton height='40px' width='70%' />
                </Flex>
            </Card.Root>
        </Flex>
    );
}
