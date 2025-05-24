import { SectionCard } from '@/components/core/section-card';
import { prisma } from '@/lib/prisma';
import { Stack } from '@chakra-ui/react';
import Link from 'next/link';

export default async function Page({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params;
    const course = await prisma.course.findUniqueOrThrow({
        where: { id: courseId },
        select: { sections: { select: { id: true, title: true, order: true, isCompleted: true, topics: true } } }
    });

    return (
        <Stack direction='row' gap={6}>
            {course.sections.map((section) => (
                <Link key={section.id} href={`${courseId}/sections/${section.id}`}>
                    <SectionCard
                        title={section.title}
                        totalTopics={section.topics.length}
                        completedTopics={section.topics.filter((topic) => topic.isCompleted).length}
                        isLocked={section.topics.filter((topic) => topic.isCompleted).length === 0 && section.order > 1}
                    />
                </Link>
            ))}
        </Stack>
    );
}
