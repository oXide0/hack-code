import { Box, Container, Flex, Skeleton } from '@chakra-ui/react';

export default function PracticeLoading() {
    return (
        <Container maxW='2xl'>
            <Flex align='center' flexDir='column' gap={2}>
                <Flex width='100%' gap={2} mb={4}>
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} height='8px' flex={1} borderRadius='full' />
                    ))}
                </Flex>

                <Skeleton height='20px' width='100px' mb={2} />

                <Skeleton height='32px' width='70%' mb={6} />

                <Box w='full' pt={7}>
                    <Skeleton height='200px' borderRadius='md' />
                </Box>

                <Box w='full' pt={7}>
                    <Skeleton height='200px' borderRadius='md' />
                </Box>
            </Flex>
        </Container>
    );
}
