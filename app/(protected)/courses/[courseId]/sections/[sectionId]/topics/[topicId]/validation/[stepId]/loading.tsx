import { Container, Flex, Skeleton, Stack } from '@chakra-ui/react';

export default function Loading() {
    return (
        <Container maxW='2xl'>
            <Flex align='center' flexDir='column' gap={2}>
                <Flex gap={2} width='100%' mb={4}>
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} height='8px' flex={1} borderRadius='full' />
                    ))}
                </Flex>

                <Skeleton height='20px' width='150px' mb={2} />

                <Skeleton height='30px' width='250px' mb={8} />

                <Skeleton height='300px' width='100%' borderRadius='md' mb={8} />

                <Stack width='100%' gap={3}>
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} height='50px' width='100%' borderRadius='md' />
                    ))}
                </Stack>
            </Flex>
        </Container>
    );
}
