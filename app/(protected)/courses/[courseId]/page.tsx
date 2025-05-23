import { SectionCard } from '@/components/core/section-card';
import { prisma } from '@/lib/prisma';
import { Flex, Stack } from '@chakra-ui/react';

export default async function Page({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params;
    const course = await prisma.course.findUniqueOrThrow({
        where: { id: courseId },
        select: { sections: true }
    });

    return (
        <Stack direction='row' gap={6}>
            {course.sections.map((section) => (
                <SectionCard
                    key={section.id}
                    title={section.title}
                    description={section.description}
                    isActive
                    linkPath={`${courseId}/sections/${section.id}`}
                    footer={
                        <Flex justify='space-between'>
                            <p>5 topics</p>
                            <p>0/5</p>
                        </Flex>
                    }
                />
            ))}
        </Stack>
    );
}
