import { authOptions } from '@/lib/auth';
import { getUserById } from '@/queries/user';
import { Badge, Box, Card, Flex, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';

export default async function Page() {
    const session = await getServerSession(authOptions);
    if (session == null || session.user == null) {
        return notFound();
    }

    const user = await getUserById(session.user.id);
    console.log('user', user);
    if (user == null) {
        return notFound();
    }

    const profileData = user.teacherProfile || user.studentProfile;

    return (
        <Box maxW='6xl' mx='auto' p={4}>
            {/* Profile Header */}
            <Card.Root mb={6}>
                <Card.Body>
                    <Flex direction={['column', 'row']} gap={8}>
                        <VStack align='flex-start' gap={4}>
                            <Heading as='h1' size='xl'>
                                {user.firstName} {user.lastName}
                                <Badge
                                    ml={3}
                                    colorScheme={
                                        user.role === 'TEACHER' ? 'blue' : user.role === 'STUDENT' ? 'green' : 'purple'
                                    }
                                >
                                    {user.role.split('_').join(' ')}
                                </Badge>
                            </Heading>

                            {user.school && (
                                <Text fontSize='lg' color='gray.600'>
                                    {user.school.name}
                                </Text>
                            )}

                            {profileData && (
                                <Box>
                                    {user.teacherProfile && <Text>Teacher ID: {user.teacherProfile.id}</Text>}
                                    {user.studentProfile && (
                                        <Text>Grade: {user.studentProfile.gradeLevel || 'N/A'}</Text>
                                    )}
                                </Box>
                            )}
                        </VStack>
                    </Flex>
                </Card.Body>
            </Card.Root>

            {/* Main Content Grid */}
            <SimpleGrid columns={[1, 1, 2]} gap={6}>
                {/* Left Column */}
                <VStack gap={6} align='stretch'>
                    {/* About Section */}
                    <Card.Root>
                        <Card.Header>
                            <Heading size='md'>About</Heading>
                        </Card.Header>
                        <Card.Body>
                            <Text>{'No bio information available.'}</Text>
                        </Card.Body>
                    </Card.Root>

                    {/* Experience Section */}
                    <Card.Root>
                        <Card.Header>
                            <Heading size='md'>Experience</Heading>
                        </Card.Header>
                        <Card.Body>
                            {user.teacherProfile ? (
                                <VStack align='stretch' divideY='1px' divideColor='gray.200'>
                                    <Box>
                                        <Text fontWeight='bold'>Teacher</Text>
                                        <Text>{user.school?.name}</Text>
                                        <Text color='gray.500'>
                                            Since {new Date(user.createdAt).toLocaleDateString()}
                                        </Text>
                                    </Box>
                                </VStack>
                            ) : (
                                <Text>No experience information available.</Text>
                            )}
                        </Card.Body>
                    </Card.Root>
                </VStack>

                {/* Right Column */}
                <VStack gap={6} align='stretch'>
                    {/* Education Section */}
                    <Card.Root>
                        <Card.Header>
                            <Heading size='md'>Education</Heading>
                        </Card.Header>
                        <Card.Body>
                            {user.studentProfile ? (
                                <VStack align='stretch' divideY='1px' divideColor='gray.200'>
                                    <Box>
                                        <Text fontWeight='bold'>{user.school?.name}</Text>
                                        <Text>Student ID: {user.studentProfile.studentId}</Text>
                                        <Text>Grade: {user.studentProfile.gradeLevel || 'N/A'}</Text>
                                        <Text color='gray.500'>
                                            Since {new Date(user.createdAt).toLocaleDateString()}
                                        </Text>
                                    </Box>
                                </VStack>
                            ) : (
                                <Text>No education information available.</Text>
                            )}
                        </Card.Body>
                    </Card.Root>

                    {/* Contact Section */}
                    <Card.Root>
                        <Card.Header>
                            <Heading size='md'>Contact</Heading>
                        </Card.Header>
                        <Card.Body>
                            <VStack align='stretch'>
                                <Text>
                                    <Text as='span' fontWeight='bold'>
                                        Email:
                                    </Text>{' '}
                                    {user.email}
                                </Text>
                                {user.school?.phone && (
                                    <Text>
                                        <Text as='span' fontWeight='bold'>
                                            School Phone:
                                        </Text>{' '}
                                        {user.school.phone}
                                    </Text>
                                )}
                            </VStack>
                        </Card.Body>
                    </Card.Root>
                </VStack>
            </SimpleGrid>
        </Box>
    );
}
