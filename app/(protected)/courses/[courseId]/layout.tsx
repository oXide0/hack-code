import { Subheader } from '@/components/layout/subheader/supheader';
import { prisma } from '@/lib/prisma';
import { calculateCourseCompleteness } from '@/lib/utils';
import { Box, Heading, Progress, Stack, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface LayoutProps {
    readonly params: Promise<{ courseId: string }>;
    readonly children: ReactNode;
}

export default async function Layout({ params, children }: LayoutProps) {
    const { courseId } = await params;
    const course = await prisma.course.findUniqueOrThrow({
        where: { id: courseId },
        select: { title: true, description: true, sections: true }
    });

    const { completenessPercentage, completedItems, totalItems } = calculateCourseCompleteness(course.sections);

    return (
        <Stack gap='28px'>
            <Subheader
                path='/courses'
                centerItem={<Heading>{course.title}</Heading>}
                linkLabel='Back to courses'
                isBorder
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
            {children}
        </Stack>
    );
}
