import { CodeEditor } from '@/components/core/code-editor';
import { CompletenessSteps } from '@/components/core/completeness-steps';

import { prisma } from '@/lib/prisma';
import { Box, Container, Flex, Heading, Text } from '@chakra-ui/react';

interface PageProps {
    readonly params: Promise<{ stepId: string; topicId: string; courseId: string; sectionId: string }>;
}

export default async function Page({ params }: PageProps) {
    const { stepId, topicId, courseId, sectionId } = await params;

    const practice = await prisma.practiceTopic.findUniqueOrThrow({
        where: { id: stepId },
        select: {
            task: true,
            starterCode: true,
            topic: { select: { title: true, practiceTopics: { select: { isCompleted: true, order: true } } } }
        }
    });
    const sortedTopics = [...practice.topic.practiceTopics].sort((a, b) => a.order - b.order);
    const allTheories = await prisma.practiceTopic.findMany({ where: { topicId }, orderBy: { order: 'asc' } });
    const currentIndex = allTheories.findIndex((t) => t.id === stepId);
    const next = allTheories[currentIndex + 1];

    return (
        <Container maxW='2xl'>
            <Flex align='center' flexDir='column' gap={2}>
                <CompletenessSteps steps={sortedTopics} />
                <Text fontWeight='semibold' color='gray.500' pt={2}>
                    Practice
                </Text>
                <Heading>{practice.topic.title}</Heading>
                <Box w='full' pt={7}>
                    <CodeEditor
                        fileName='script.py'
                        initialContent={practice.starterCode}
                        isReadOnly
                        minHeight='100px'
                    />
                </Box>

                <Box w='full' pt={7}>
                    <CodeEditor fileName='shell.py' minHeight='100px' />
                </Box>
            </Flex>
        </Container>
    );
}
