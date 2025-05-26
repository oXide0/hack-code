import { ConditionalLink } from '@/components/core/conditional-link';
import { TopicCard } from '@/components/core/topic-card';
import { Subheader } from '@/components/layout/subheader/supheader';
import { PracticeTopic, prisma, TheoryTopic, TopicType, ValidationTopic } from '@/lib/prisma';
import { calculateCompleteness, call } from '@/lib/utils';
import {
    AbsoluteCenter,
    Badge,
    Box,
    Container,
    Flex,
    Heading,
    Progress,
    ProgressCircle,
    Stack,
    Text
} from '@chakra-ui/react';
import { LockKeyhole } from 'lucide-react';

export default async function Page({ params }: { params: Promise<{ sectionId: string }> }) {
    const { sectionId } = await params;
    const section = await prisma.section.findUniqueOrThrow({
        where: { id: sectionId },
        select: {
            title: true,
            description: true,
            course: { select: { title: true, sections: { select: { isCompleted: true, order: true } } } },
            topics: {
                orderBy: { order: 'asc' },
                select: {
                    id: true,
                    title: true,
                    order: true,
                    type: true,
                    isCompleted: true,
                    practiceTopics: true,
                    theoryTopics: true,
                    validationTopics: true
                }
            }
        }
    });
    const sectionCompleteness = calculateCompleteness(section.topics);
    const courseCompleteness = calculateCompleteness(section.course.sections);

    return (
        <Stack>
            <Subheader
                path='/courses'
                centerItem={<Heading>{section.course.title}</Heading>}
                backLabel='Back to courses'
                isSeparator
                rightItem={
                    <Box>
                        <Progress.Root
                            size='md'
                            w='279px'
                            colorPalette='green'
                            value={courseCompleteness.completenessPercentage}
                        >
                            <Progress.Track bg='#3A3A3A' borderRadius='full'>
                                <Progress.Range />
                            </Progress.Track>
                        </Progress.Root>
                        <Stack direction='row' justify='space-between' pt={1}>
                            <Text fontSize='sm' color='#7A7A7A'>
                                {courseCompleteness.completenessPercentage}% complete
                            </Text>
                            <Text fontSize='sm' color='#7A7A7A'>
                                {courseCompleteness.completedItems}/{courseCompleteness.totalItems}
                            </Text>
                        </Stack>
                    </Box>
                }
            />
            <Container maxW='2xl'>
                <Flex justify='space-between'>
                    <Box>
                        <Heading size='2xl'>{section.title}.</Heading>
                        <Text color='gray.300' fontSize='sm'>
                            {section.description}
                        </Text>
                    </Box>
                    <ProgressCircle.Root
                        size='xl'
                        value={sectionCompleteness.completenessPercentage}
                        color='green.500'
                        colorPalette='green'
                    >
                        <ProgressCircle.Circle>
                            <ProgressCircle.Track />
                            <ProgressCircle.Range />
                        </ProgressCircle.Circle>
                        <AbsoluteCenter>
                            <ProgressCircle.ValueText />
                        </AbsoluteCenter>
                    </ProgressCircle.Root>
                </Flex>

                <Stack pt={6}>
                    {section.topics.map((topic, index) => {
                        const isLocked = section.topics.find((t) => t.order === topic.order - 1)?.isCompleted === false;

                        return (
                            <ConditionalLink
                                key={topic.id}
                                href={`${sectionId}/topics/${topic.id}`}
                                disabled={isLocked}
                            >
                                <TopicCard
                                    label={index + 1 < 10 ? `0${index + 1}` : `${index + 1}`}
                                    title={topic.title}
                                    isLocked={isLocked}
                                    isCompleted={topic.isCompleted}
                                    rightElement={
                                        isLocked ? (
                                            <LockKeyhole />
                                        ) : (
                                            <Text>
                                                {call(() => {
                                                    const { total, completed } = completedTopicsCount(topic);
                                                    return `${completed} / ${total}`;
                                                })}
                                            </Text>
                                        )
                                    }
                                    badge={getTopicTypeBadge(topic.type)}
                                />
                            </ConditionalLink>
                        );
                    })}
                </Stack>
            </Container>
        </Stack>
    );
}

function getTopicTypeBadge(type: TopicType) {
    if (type === 'THEORY') {
        return (
            <Badge colorPalette='green' px={2} py={1} border='1px solid' borderColor='green.300'>
                Learn
            </Badge>
        );
    }
    if (type === 'VALIDATION') {
        return (
            <Badge colorPalette='orange' px={2} py={1} border='1px solid' borderColor='orange.300'>
                Validation test
            </Badge>
        );
    }
    if (type === 'PRACTICE') {
        return (
            <Badge colorPalette='blue' px={2} py={1} border='1px solid' borderColor='blue.300'>
                Practice
            </Badge>
        );
    }
}

function completedTopicsCount(topic: {
    type: TopicType;
    practiceTopics: PracticeTopic[];
    theoryTopics: TheoryTopic[];
    validationTopics: ValidationTopic[];
}): { total: number; completed: number } {
    let completed = 0;
    let total = 0;
    if (topic.type === 'THEORY') {
        completed = topic.theoryTopics.filter((t) => t.isCompleted).length;
        total = topic.theoryTopics.length;
    }
    if (topic.type === 'VALIDATION') {
        completed = topic.validationTopics.filter((t) => t.isCompleted).length;
        total = topic.validationTopics.length;
    }
    if (topic.type === 'PRACTICE') {
        completed = topic.practiceTopics.filter((t) => t.isCompleted).length;
        total = topic.practiceTopics.length;
    }

    return { total, completed };
}
