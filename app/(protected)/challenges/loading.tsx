import { Box, Card, HStack, Skeleton, SkeletonText, Stack } from '@chakra-ui/react';

export default function Loading() {
    return (
        <Box display='flex' gap={4} py={2}>
            <Card.Root
                p={6}
                borderRadius='xl'
                bg='gray.800'
                maxW='sm'
                mx='auto'
                borderWidth='1px'
                borderColor='gray.700'
                w='full'
                h='calc(100vh - 112px)'
                position='fixed'
                zIndex='1'
                display='flex'
                flexDirection='column'
            >
                <Skeleton height='32px' mb={6} width='120px' borderRadius='md' />

                <Stack flex='1 1 auto' gap={8}>
                    {/* Search */}
                    <Box>
                        <Skeleton height='18px' mb={2} width='60px' />
                        <Skeleton height='38px' borderRadius='lg' />
                    </Box>

                    {/* Difficulty */}
                    <Box>
                        <Skeleton height='18px' mb={2} width='60px' />
                        <Skeleton height='38px' borderRadius='lg' />
                    </Box>

                    {/* Sort */}
                    <Box>
                        <Skeleton height='18px' mb={2} width='60px' />
                        <HStack mt={1}>
                            <Skeleton height='32px' width='120px' borderRadius='lg' />
                        </HStack>
                    </Box>
                </Stack>
                <Skeleton mt={8} height='40px' width='100%' borderRadius='lg' />
            </Card.Root>

            {/* Challenge cards skeletons */}
            <Box flex='1' pl='396px'>
                <Stack gap={4}>
                    {Array.from({ length: 5 }).map((_, idx) => (
                        <Card.Root
                            key={idx}
                            borderWidth='1px'
                            borderRadius='lg'
                            overflow='hidden'
                            p={6}
                            bg='gray.800'
                            boxShadow='md'
                            w='full'
                        >
                            <Stack align='flex-start' gap={3} w='full'>
                                <Skeleton height='24px' width='60%' />
                                <SkeletonText noOfLines={2} gap={2} width='100%' />
                                <HStack align='center' gap={2} mt={2}>
                                    <Skeleton height='20px' width='80px' />
                                    <Skeleton height='20px' width='60px' />
                                </HStack>
                            </Stack>
                        </Card.Root>
                    ))}
                </Stack>
            </Box>
        </Box>
    );
}
