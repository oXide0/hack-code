import { ConditionalLink } from '@/components/core/conditional-link';
import { SectionCard } from '@/components/core/section-card';
import { Subheader } from '@/components/layout/subheader/supheader';
import { prisma } from '@/lib/prisma';
import { calculateCompleteness, chunkArray } from '@/lib/utils';
import { Box, Flex, Heading, Progress, Stack, Text } from '@chakra-ui/react';
import Image from 'next/image';

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
    const rows = chunkArray(course.sections, 3);

    return (
        <Box>
            <Subheader
                path='/courses'
                centerItem={
                    <Flex gap={3}>
                        <Image src='/python-icon.svg' width={24} height={24} alt='python' />
                        <Heading>{course.title}</Heading>
                    </Flex>
                }
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
            <Stack maxW='985px' m='0 auto'>
                {rows.map((rowSections, rowIndex) => {
                    const displaySections = rowIndex % 2 === 0 ? rowSections : [...rowSections].reverse();

                    return (
                        <Box key={`row-${rowIndex}`}>
                            <Stack direction='row' justify={rowIndex % 2 === 0 ? 'flex-start' : 'flex-end'} mb={2}>
                                {displaySections.map((section, sectionIndex) => {
                                    const isLocked =
                                        course.sections.find((s) => s.order === section.order - 1)?.isCompleted ===
                                        false;

                                    return (
                                        <Stack key={section.id} direction='row' alignItems='center'>
                                            {sectionIndex > 0 && (
                                                <Image
                                                    src={rowIndex % 2 === 0 ? '/arrow-right.svg' : '/arrow-left.svg'}
                                                    alt='arrow'
                                                    width={70}
                                                    height={12}
                                                />
                                            )}

                                            <ConditionalLink
                                                href={`${courseId}/${section.id}`}
                                                disabled={isLocked || section.isCompleted}
                                            >
                                                <SectionCard
                                                    title={section.title}
                                                    totalTopics={section.topics.length}
                                                    completedTopics={
                                                        section.topics.filter((topic) => topic.isCompleted).length
                                                    }
                                                    isNext={
                                                        course.sections.find((section) => !section.isCompleted)?.id ===
                                                        section.id
                                                    }
                                                    isLocked={isLocked}
                                                    isCompleted={section.isCompleted}
                                                />
                                            </ConditionalLink>
                                        </Stack>
                                    );
                                })}
                            </Stack>

                            {rowIndex < rows.length - 1 && (
                                <Flex
                                    justifyContent={rowIndex % 2 === 0 ? 'flex-end' : 'flex-start'}
                                    pr={rowIndex % 2 === 0 ? '130px' : 'calc(50% - 20px)'}
                                    pb={2}
                                >
                                    <Image src='/arrow-down.svg' alt='arrow down' width={12} height={70} />
                                </Flex>
                            )}
                        </Box>
                    );
                })}
            </Stack>
        </Box>
    );
}
