import { AnswerButtons } from '@/components/core/answer-buttons';
import { CodeEditor } from '@/components/core/code-editor';
import { CompletenessSteps } from '@/components/core/completeness-steps';
import { prisma } from '@/lib/prisma';
import { updateTopic } from '@/lib/topics';
import { Box, Container, Flex, Heading, Text } from '@chakra-ui/react';
import { redirect } from 'next/navigation';

interface PageProps {
    readonly params: Promise<{ stepId: string; topicId: string; courseId: string; sectionId: string }>;
}

export default async function Page({ params }: PageProps) {
    const { stepId, topicId, courseId, sectionId } = await params;

    const validation = await prisma.validationTopic.findUniqueOrThrow({
        where: { id: stepId },
        select: {
            question: true,
            codeSample: true,
            validationAnswers: { select: { value: true, isCorrect: true } },
            topic: { select: { title: true, validationTopics: { select: { isCompleted: true, order: true } } } }
        }
    });
    const sortedTopics = [...validation.topic.validationTopics].sort((a, b) => a.order - b.order);
    const allTheories = await prisma.validationTopic.findMany({ where: { topicId }, orderBy: { order: 'asc' } });
    const currentIndex = allTheories.findIndex((t) => t.id === stepId);
    const next = allTheories[currentIndex + 1];

    return (
        <Container maxW='2xl'>
            <Flex align='center' flexDir='column' gap={2}>
                <CompletenessSteps steps={sortedTopics} />
                <Text fontWeight='semibold' color='gray.500' pt={2}>
                    Validation test
                </Text>
                <Heading>{validation.topic.title}</Heading>
                {validation.codeSample && (
                    <Box w='full' pt={7}>
                        <CodeEditor fileName='test.py' initialContent={validation.codeSample} isReadOnly />
                    </Box>
                )}

                <Box w='full' pt={7}>
                    <AnswerButtons
                        answers={validation.validationAnswers}
                        isLastStep={next == null}
                        onSubmit={async () => {
                            'use server';
                            await updateTopic({ sectionId, topicId, subtopicId: stepId });
                            if (next != null) {
                                redirect(
                                    `/courses/${courseId}/sections/${sectionId}/topics/${topicId}/validation/${next.id}`
                                );
                            } else {
                                redirect(`/courses/${courseId}/sections/${sectionId}`);
                            }
                        }}
                    />
                </Box>
            </Flex>
        </Container>
    );
}
