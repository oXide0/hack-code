import { prisma } from './prisma';

interface UpdateTopicArgs {
    readonly topicId: string;
    readonly subtopicId: string;
    readonly sectionId: string;
}

export async function updateTopic({ sectionId, topicId, subtopicId }: UpdateTopicArgs): Promise<void> {
    const topic = await prisma.topic.findUniqueOrThrow({
        where: { id: topicId },
        select: { type: true }
    });

    const updateSubtopic = async () => {
        if (topic.type === 'THEORY') {
            await prisma.theoryTopic.update({
                where: { id: subtopicId },
                data: { isCompleted: true }
            });
        }
        if (topic.type === 'VALIDATION') {
            await prisma.validationTopic.update({
                where: { id: subtopicId },
                data: { isCompleted: true }
            });
        }
        if (topic.type === 'PRACTICE') {
            await prisma.practiceTopic.update({
                where: { id: subtopicId },
                data: { isCompleted: true }
            });
        }
    };

    const markAsCompleted = async () => {
        await prisma.topic.update({
            where: { id: topicId },
            data: { isCompleted: true }
        });

        const section = await prisma.section.findUniqueOrThrow({
            where: { id: sectionId },
            select: {
                topics: {
                    select: { isCompleted: true }
                }
            }
        });

        if (section.topics.every((t) => t.isCompleted)) {
            await prisma.section.update({
                where: { id: sectionId },
                data: { isCompleted: true }
            });
        }
    };

    await updateSubtopic();

    const updatedTopic = await prisma.topic.findUniqueOrThrow({
        where: { id: topicId },
        include: {
            practiceTopics: true,
            theoryTopics: true,
            validationTopics: true
        }
    });

    if (updatedTopic.type === 'THEORY' && updatedTopic.theoryTopics.every((t) => t.isCompleted)) {
        await markAsCompleted();
    }
    if (updatedTopic.type === 'VALIDATION' && updatedTopic.validationTopics.every((t) => t.isCompleted)) {
        await markAsCompleted();
    }
    if (updatedTopic.type === 'PRACTICE' && updatedTopic.practiceTopics.every((t) => t.isCompleted)) {
        await markAsCompleted();
    }
}
