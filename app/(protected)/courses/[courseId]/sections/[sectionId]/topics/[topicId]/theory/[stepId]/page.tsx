import { CodeEditor } from '@/components/core/code-editor';
import { MarkdownRenderer } from '@/components/core/markdown-renderer';
import { Panel } from '@/components/core/panel';
import { prisma } from '@/lib/prisma';
import { updateTopic } from '@/lib/topics';
import { Box, Button, Flex } from '@chakra-ui/react';
import { ArrowRight } from 'lucide-react';
import { redirect } from 'next/navigation';

interface PageProps {
    readonly params: Promise<{ stepId: string; topicId: string; courseId: string; sectionId: string }>;
}

export default async function Page({ params }: PageProps) {
    const { stepId, topicId, courseId, sectionId } = await params;

    const theory = await prisma.theoryTopic.findUniqueOrThrow({
        where: { id: stepId },
        select: {
            content: true,
            codeSample: true,
            topic: { select: { title: true, theoryTopics: { select: { isCompleted: true, order: true } } } }
        }
    });
    const sortedTopics = [...theory.topic.theoryTopics].sort((a, b) => a.order - b.order);
    const allTheories = await prisma.theoryTopic.findMany({ where: { topicId }, orderBy: { order: 'asc' } });
    const currentIndex = allTheories.findIndex((t) => t.id === stepId);
    const next = allTheories[currentIndex + 1];

    return (
        <Box pb={10}>
            <Panel
                title={theory.topic.title}
                steps={sortedTopics}
                isPossibleSkip={next != null}
                onSkip={async () => {
                    'use server';
                    if (next != null) {
                        redirect(`/courses/${courseId}/sections/${sectionId}/topics/${topicId}/theory/${next.id}`);
                    }
                }}
            >
                <Flex justify='space-between' gap={5} pb={4}>
                    <Flex w='full' flexDir='column' minH='full'>
                        <Box flex='1 1 auto'>
                            <MarkdownRenderer content={theory.content} />
                        </Box>
                        <Button
                            w='full'
                            mt={4}
                            onClick={async () => {
                                'use server';
                                await updateTopic({ sectionId, topicId, subtopicId: stepId });
                                if (next != null) {
                                    redirect(
                                        `/courses/${courseId}/sections/${sectionId}/topics/${topicId}/theory/${next.id}`
                                    );
                                } else {
                                    redirect(`/courses/${courseId}/sections/${sectionId}`);
                                }
                            }}
                        >
                            {next != null ? 'Next' : 'Submit'}
                            {next != null && <ArrowRight />}
                        </Button>
                    </Flex>
                    <Box w='full'>
                        {theory.codeSample && (
                            <CodeEditor fileName='test.py' initialContent={theory.codeSample} isReadOnly />
                        )}
                    </Box>
                </Flex>
            </Panel>
        </Box>
    );
}
