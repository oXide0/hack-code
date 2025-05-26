import { prisma } from '@/lib/prisma';
import { Heading } from '@chakra-ui/react';
import { notFound, redirect } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ topicId: string }> }) {
    const { topicId } = await params;

    const topic = await prisma.topic.findUnique({
        where: { id: topicId },
        include: {
            theoryTopics: { select: { id: true, isCompleted: true }, orderBy: { order: 'asc' } },
            validationTopics: { select: { id: true, isCompleted: true }, orderBy: { order: 'asc' } },
            practiceTopics: { select: { id: true, isCompleted: true }, orderBy: { order: 'asc' } }
        }
    });

    if (topic == null) return notFound();

    const getFirstIncompleteSubtopic = (subtopics: { id: string; isCompleted: boolean }[]) => {
        return subtopics.find((subtopic) => !subtopic.isCompleted) || subtopics[0];
    };

    let redirectPath: string | null = null;

    switch (topic.type) {
        case 'THEORY':
            if (topic.theoryTopics.length > 0) {
                const firstIncomplete = getFirstIncompleteSubtopic(topic.theoryTopics);
                redirectPath = `${topic.id}/theory/${firstIncomplete.id}`;
            }
            break;
        case 'VALIDATION':
            if (topic.validationTopics.length > 0) {
                const firstIncomplete = getFirstIncompleteSubtopic(topic.validationTopics);
                redirectPath = `${topic.id}/validation/${firstIncomplete.id}`;
            }
            break;
        case 'PRACTICE':
            if (topic.practiceTopics.length > 0) {
                const firstIncomplete = getFirstIncompleteSubtopic(topic.practiceTopics);
                redirectPath = `${topic.id}/practice/${firstIncomplete.id}`;
            }
            break;
    }

    if (redirectPath) {
        redirect(redirectPath);
    }

    return <Heading>No subtopics found</Heading>;
}
