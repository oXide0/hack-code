import { TempButton } from '@/components/core/temp-button';
import { prisma } from '@/lib/prisma';
import { call } from '@/lib/utils';
import { Heading } from '@chakra-ui/react';

export default async function Page({ params }: { params: Promise<{ topicId: string }> }) {
    const { topicId } = await params;
    const topic = await prisma.topic.findUniqueOrThrow({
        where: { id: topicId },
        select: { title: true, type: true, practiceTopics: true, theoryTopics: true, validationTopics: true }
    });

    return (
        <div>
            <Heading>{topic.title}</Heading>
            <Heading>{topic.type}</Heading>
            {call(() => {
                if (topic.type === 'THEORY') {
                    return topic.theoryTopics.map((item) => (
                        <TempButton
                            callback={async () => {
                                'use server';
                                await prisma.theoryTopic.update({
                                    where: { id: item.id },
                                    data: { isCompleted: true }
                                });
                                await updateTopicCompleteness(topicId);
                            }}
                            label={item.question}
                        />
                    ));
                }
                if (topic.type === 'VALIDATION') {
                    return topic.validationTopics.map((item) => (
                        <TempButton
                            callback={async () => {
                                'use server';
                                await prisma.theoryTopic.update({
                                    where: { id: item.id },
                                    data: { isCompleted: true }
                                });
                                await updateTopicCompleteness(topicId);
                            }}
                            label={item.task}
                        />
                    ));
                }
                if (topic.type === 'PRACTICE') {
                    return topic.practiceTopics.map((item) => (
                        <TempButton
                            callback={async () => {
                                'use server';
                                await prisma.theoryTopic.update({
                                    where: { id: item.id },
                                    data: { isCompleted: true }
                                });
                                await updateTopicCompleteness(topicId);
                            }}
                            label={item.task}
                        />
                    ));
                }
            })}
        </div>
    );
}

export async function updateTopicCompleteness(id: string) {
    const topic = await prisma.topic.findUniqueOrThrow({
        where: { id },
        select: {
            type: true,
            practiceTopics: true,
            theoryTopics: true,
            validationTopics: true
        }
    });

    if (topic.type === 'THEORY') {
        if (topic.theoryTopics.every((item) => item.isCompleted)) {
            await prisma.topic.update({
                where: { id },
                data: { isCompleted: true }
            });
        }
    }
    if (topic.type === 'VALIDATION') {
        if (topic.validationTopics.every((item) => item.isCompleted)) {
            await prisma.topic.update({
                where: { id },
                data: { isCompleted: true }
            });
        }
    }
    if (topic.type === 'PRACTICE') {
        if (topic.practiceTopics.every((item) => item.isCompleted)) {
            await prisma.topic.update({
                where: { id },
                data: { isCompleted: true }
            });
        }
    }
}
