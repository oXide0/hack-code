import { Badge, Box, Card, Flex, Heading, Skeleton, SkeletonText, Table, Tabs, VStack } from '@chakra-ui/react';

export default function Loading() {
    return (
        <Box pt={2}>
            <Box
                h='200px'
                bgImage='linear-gradient(to right, #43e97b 0%, #38f9d7 100%)'
                position='relative'
                borderRadius='md'
                mb={16}
            >
                <Box
                    position='absolute'
                    bottom={-10}
                    left={6}
                    width='124px'
                    height='124px'
                    borderRadius='xl'
                    bg='gray.200'
                    borderWidth={4}
                    borderColor='white'
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                >
                    <Skeleton height='100%' width='100%' borderRadius='full' />
                </Box>
            </Box>

            <Box px={4} pt={4}>
                <Flex direction={{ base: 'column', md: 'row' }} gap={6} mt={-16} mb={8}>
                    <Box flex={1} pt={8}>
                        <Flex
                            direction={{ base: 'column', md: 'row' }}
                            justify='space-between'
                            align={{ base: 'flex-start', md: 'center' }}
                            gap={4}
                        >
                            <VStack align='flex-start' gap={1}>
                                <Skeleton height='36px' width='220px' mb={1} />
                                <Skeleton height='24px' width='160px' mb={1} />
                                <Skeleton height='18px' width='120px' />
                            </VStack>
                            <Badge
                                colorScheme='gray'
                                variant='outline'
                                px={3}
                                py={1}
                                fontSize='sm'
                                mt={{ base: 4, md: 0 }}
                            >
                                <Skeleton height='18px' width='120px' />
                            </Badge>
                        </Flex>
                    </Box>
                </Flex>
            </Box>

            <Tabs.Root defaultValue='about' colorPalette='green'>
                <Tabs.List>
                    <Tabs.Trigger value='about'>About</Tabs.Trigger>
                    <Tabs.Trigger value='classes'>Classes</Tabs.Trigger>
                    <Tabs.Indicator />
                </Tabs.List>
                <Tabs.Content value='about'>
                    <Card.Root bg='gray.800' borderWidth='2px' borderColor='gray.700' borderRadius='xl'>
                        <Card.Header>
                            <Heading size='md'>
                                <Skeleton width='80px' height='28px' />
                            </Heading>
                        </Card.Header>
                        <Card.Body>
                            <SkeletonText noOfLines={4} gap={3} />
                        </Card.Body>
                    </Card.Root>
                </Tabs.Content>
                <Tabs.Content value='classes'>
                    <Card.Root bg='gray.800' borderWidth='2px' borderColor='gray.700' borderRadius='xl' mt={4}>
                        <Card.Header>
                            <Heading size='md'>
                                <Skeleton width='100px' height='28px' />
                            </Heading>
                        </Card.Header>
                        <Card.Body>
                            <Table.Root variant='line' size='md'>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.ColumnHeader>
                                            <Skeleton width='50px' />
                                        </Table.ColumnHeader>
                                        <Table.ColumnHeader>
                                            <Skeleton width='70px' />
                                        </Table.ColumnHeader>
                                        <Table.ColumnHeader>
                                            <Skeleton width='70px' />
                                        </Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {[...Array(3)].map((_, i) => (
                                        <Table.Row key={i}>
                                            <Table.Cell>
                                                <Skeleton width='70px' height='20px' />
                                            </Table.Cell>
                                            <Table.Cell>
                                                <VStack align='flex-start' gap={1}>
                                                    <Skeleton width='110px' height='18px' />
                                                    <Skeleton width='90px' height='18px' />
                                                </VStack>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <VStack align='flex-start' gap={1}>
                                                    <Skeleton width='120px' height='18px' />
                                                    <Skeleton width='100px' height='18px' />
                                                </VStack>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Card.Body>
                    </Card.Root>
                </Tabs.Content>
            </Tabs.Root>
        </Box>
    );
}
