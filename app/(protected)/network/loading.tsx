import { Box, Button, Flex, Heading, Skeleton, Stack, VStack } from '@chakra-ui/react';

export default function Loading() {
    return (
        <Stack w='full' gap={2} pt={4}>
            <Flex justify='space-between' gap={4}>
                <Skeleton height='48px' width='200px' borderRadius='md'>
                    <Heading size='3xl'>Classes</Heading>
                </Skeleton>
                <Stack direction='row'>
                    <Skeleton height='32px' width='110px' borderRadius='md'>
                        <Button size='sm'>Add class</Button>
                    </Skeleton>
                </Stack>
            </Flex>

            <Box borderWidth='2px' borderColor='gray.700' borderRadius='xl' overflow='hidden'>
                <Box as='table' width='100%'>
                    <Box as='thead' bg='gray.900'>
                        <Box as='tr'>
                            <Box as='th' width='48px'>
                                <Skeleton height='24px' width='24px' borderRadius='sm' mx='auto' />
                            </Box>
                            <Box as='th'>
                                <Skeleton height='20px' width='80px' />
                            </Box>
                            <Box as='th'>
                                <Skeleton height='20px' width='80px' />
                            </Box>
                            <Box as='th'>
                                <Skeleton height='20px' width='80px' />
                            </Box>
                        </Box>
                    </Box>
                    <Box as='tbody' bg='gray.800'>
                        {[...Array(4)].map((_, idx) => (
                            <Box as='tr' key={idx}>
                                <Box as='td'>
                                    <Skeleton height='20px' width='20px' borderRadius='sm' mx='auto' />
                                </Box>
                                <Box as='td'>
                                    <Skeleton height='20px' width='100px' />
                                </Box>
                                <Box as='td'>
                                    <VStack align='flex-start' gap={1}>
                                        <Skeleton height='16px' width='120px' />
                                        <Skeleton height='16px' width='90px' />
                                    </VStack>
                                </Box>
                                <Box as='td'>
                                    <VStack align='flex-start' gap={1}>
                                        <Skeleton height='16px' width='120px' />
                                        <Skeleton height='16px' width='90px' />
                                    </VStack>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Stack>
    );
}
