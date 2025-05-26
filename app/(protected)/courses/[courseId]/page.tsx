import { ConditionalLink } from '@/components/core/conditional-link';
import { SectionCard } from '@/components/core/section-card';
import { Subheader } from '@/components/layout/subheader/supheader';
import { prisma } from '@/lib/prisma';
import { calculateCompleteness } from '@/lib/utils';
import { Box, Heading, Progress, Stack, Text } from '@chakra-ui/react';

export default async function Page({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params;
    const course = await prisma.course.findUniqueOrThrow({
        where: { id: courseId },
        select: {
            title: true,
            sections: {
                select: { id: true, title: true, order: true, isCompleted: true, topics: true },
                orderBy: { order: 'asc' }
            }
        }
    });
    const { completenessPercentage, completedItems, totalItems } = calculateCompleteness(course.sections);

    return (
        <Stack>
            <Subheader
                path='/courses'
                centerItem={<Heading>{course.title}</Heading>}
                backLabel='Back to courses'
                isSeparator
                rightItem={
                    <Box>
                        <Progress.Root size='md' w='279px' colorPalette='green' value={completenessPercentage}>
                            <Progress.Track bg='#3A3A3A' borderRadius='full'>
                                <Progress.Range />
                            </Progress.Track>
                        </Progress.Root>
                        <Stack direction='row' justify='space-between' pt={1}>
                            <Text fontSize='sm' color='#7A7A7A'>
                                {completenessPercentage}% complete
                            </Text>
                            <Text fontSize='sm' color='#7A7A7A'>
                                {completedItems}/{totalItems}
                            </Text>
                        </Stack>
                    </Box>
                }
            />
            <Stack direction='row' gap={6}>
                {course.sections.map((section) => {
                    const isLocked = course.sections.find((s) => s.order === section.order - 1)?.isCompleted === false;

                    return (
                        <ConditionalLink
                            key={section.id}
                            href={`${courseId}/sections/${section.id}`}
                            disabled={isLocked}
                        >
                            <SectionCard
                                title={section.title}
                                totalTopics={section.topics.length}
                                completedTopics={section.topics.filter((topic) => topic.isCompleted).length}
                                isLocked={isLocked}
                            />
                        </ConditionalLink>
                    );
                })}
            </Stack>
        </Stack>
    );
}
