import { prisma } from '@/lib/prisma';
import { Box, Card, Code, Flex, Heading, Separator, Stack, Text } from '@chakra-ui/react';
import { BrainCog } from 'lucide-react';

export default async function SolutionsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const challenge = await prisma.challenge.findUniqueOrThrow({
        where: { id },
        select: {
            title: true,
            solutions: {
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    code: true,
                    createdAt: true,
                    student: {
                        select: {
                            id: true,
                            user: {
                                select: {
                                    firstName: true,
                                    lastName: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    return (
        <Box px={{ base: 0, md: 2 }} py={6} w='full'>
            <Flex align='center' gap={3} mb={6}>
                <BrainCog />
                <Heading size='lg'>
                    Solutions for: <Text color='green.300'>{challenge.title}</Text>
                </Heading>
            </Flex>
            <Card.Root variant='outline' boxShadow='md'>
                <Card.Header>
                    <Heading size='md'>Submitted Solutions</Heading>
                </Card.Header>
                <Card.Body>
                    <Stack gap={5}>
                        {challenge.solutions.length === 0 && (
                            <Text color='gray.500' py={8} textAlign='center'>
                                No solutions submitted yet.
                            </Text>
                        )}
                        <Separator />
                        {challenge.solutions.map((s) => (
                            <Box key={s.id}>
                                <Flex justify='space-between' align='center' mb={2}>
                                    <Text fontWeight='medium'>
                                        {s.student
                                            ? `${s.student.user.firstName} ${s.student.user.lastName}`
                                            : 'Unknown Student'}
                                    </Text>
                                    <Text fontSize='sm' color='gray.500'>
                                        {s.createdAt.toLocaleString
                                            ? s.createdAt.toLocaleString()
                                            : new Date(s.createdAt).toLocaleString()}
                                    </Text>
                                </Flex>
                                <Code
                                    bg='gray.900'
                                    color='green.200'
                                    px={4}
                                    py={3}
                                    borderRadius='md'
                                    overflowX='auto'
                                    fontSize='sm'
                                    whiteSpace='pre-wrap'
                                >
                                    {s.code}
                                </Code>
                            </Box>
                        ))}
                    </Stack>
                </Card.Body>
            </Card.Root>
        </Box>
    );
}
