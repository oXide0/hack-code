import { Exercises } from '@/components/core/exercises';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ courseId: string; sectionId: string }> }) {
    const { courseId, sectionId } = await params;

    const initialTopic = await prisma.topic.findFirstOrThrow({
        where: { sectionId, isCompleted: false },
        orderBy: { order: 'asc' },
        select: { id: true, exercises: true }
    });

    return (
        <Exercises
            topicId={initialTopic.id}
            exercises={initialTopic.exercises}
            onSubmit={async ({ topicId, exercises }) => {
                'use server';

                if (exercises.some((exercise) => !exercise.isCompleted)) {
                    return redirect(`/courses/${courseId}`);
                }

                await prisma.topic.update({
                    where: { id: topicId },
                    data: { isCompleted: true }
                });

                const section = await prisma.section.findUniqueOrThrow({
                    where: { id: sectionId },
                    select: { topics: { select: { isCompleted: true } } }
                });
                if (section.topics.every((t) => t.isCompleted)) {
                    await prisma.section.update({
                        where: { id: sectionId },
                        data: { isCompleted: true }
                    });
                }
                redirect(`/courses/${courseId}`);
            }}
        />
    );
}
