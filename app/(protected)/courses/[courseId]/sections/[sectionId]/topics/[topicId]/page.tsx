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
                            }}
                            label={item.task}
                        />
                    ));
                }
            })}
        </div>
    );
}
