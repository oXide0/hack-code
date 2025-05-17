import { getUserById } from '@/queries/route';
import { Avatar, Badge, Box, Card, Flex, Heading, Text, VStack } from '@chakra-ui/react';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await getUserById(id);

    return (
        <Box pt={2}>
            <Box
                h='200px'
                bgImage='linear-gradient(to right, #43e97b 0%, #38f9d7 100%)'
                position='relative'
                borderRadius='md'
                mb={16}
            >
                <Avatar.Root
                    size='2xl'
                    borderWidth={4}
                    borderColor='white'
                    bg='gray.200'
                    borderRadius='xl'
                    pos='absolute'
                    bottom={-10}
                    left={6}
                    width='124px'
                    height='124px'
                >
                    <Avatar.Fallback name={`${user.firstName} ${user.lastName}`} />
                    <Avatar.Image src='https://bit.ly/broken-link' />
                </Avatar.Root>
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
                                <Heading as='h1' size='xl'>
                                    {user.firstName} {user.lastName}
                                </Heading>

                                {user.school && (
                                    <Text fontSize='lg' color='gray.300'>
                                        {user.school.name}
                                    </Text>
                                )}

                                <Text fontSize='sm' color='gray.200'>
                                    Member since {new Date(user.createdAt).toLocaleDateString()}
                                </Text>
                            </VStack>

                            <Badge
                                colorScheme='gray'
                                variant='outline'
                                px={3}
                                py={1}
                                fontSize='sm'
                                mt={{ base: 4, md: 0 }}
                            >
                                {user.email}
                            </Badge>
                        </Flex>
                    </Box>
                </Flex>
            </Box>

            <Card.Root bg='gray.800' borderWidth='2px' borderColor='gray.700' borderRadius='xl'>
                <Card.Header>
                    <Heading size='md'>About</Heading>
                </Card.Header>
                <Card.Body>
                    <Text>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum distinctio praesentium nulla
                        repellendus porro, qui officia quasi, repudiandae, veniam illum quas debitis sapiente facilis
                        sint velit nam laudantium error fuga. Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Earum distinctio praesentium nulla repellendus porro, qui officia quasi, repudiandae, veniam
                        illum quas debitis sapiente facilis sint velit nam laudantium error fuga.
                    </Text>
                </Card.Body>
            </Card.Root>
        </Box>
    );
}
