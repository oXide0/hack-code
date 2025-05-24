import { TopicCard } from '@/components/core/topic-card';
import { PracticeTopic, prisma, TheoryTopic, TopicType, ValidationTopic } from '@/lib/prisma';
import { calculateCompleteness, call } from '@/lib/utils';
import { AbsoluteCenter, Badge, Box, Container, Flex, Heading, ProgressCircle, Stack, Text } from '@chakra-ui/react';
import { LockKeyhole } from 'lucide-react';
import Link from 'next/link';

export default async function Page({ params }: { params: Promise<{ sectionId: string }> }) {
    const { sectionId } = await params;
    const section = await prisma.section.findUniqueOrThrow({
        where: { id: sectionId },
        select: {
            title: true,
            description: true,
            topics: {
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
    const completeness = calculateCompleteness(section.topics);

    return (
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
                    value={completeness.completenessPercentage}
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
                {section.topics.map((topic, index) => (
                    <Link key={topic.id} href={`${sectionId}/topics/${topic.id}`}>
                        <TopicCard
                            label={index + 1 < 10 ? `0${index + 1}` : `${index + 1}`}
                            title={topic.title}
                            isActive={isTopicStarted(topic) || topic.order === 1}
                            isCompleted={topic.isCompleted}
                            rightElement={
                                isTopicStarted(topic) || topic.order === 1 ? (
                                    <Text>
                                        {call(() => {
                                            const { total, completed } = completedTopicsCount(topic);
                                            return `${completed} / ${total}`;
                                        })}
                                    </Text>
                                ) : (
                                    <LockKeyhole />
                                )
                            }
                            badge={getTopicTypeBadge(topic.type)}
                        />
                    </Link>
                ))}
            </Stack>
        </Container>
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
            <Badge colorPalette='orange' px={2} py={1} border='1px solid' borderColor='blue.300'>
                Validate
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

function isTopicStarted(topic: {
    practiceTopics: PracticeTopic[];
    theoryTopics: TheoryTopic[];
    validationTopics: ValidationTopic[];
}) {
    const practiceStarted = topic.practiceTopics.map((t) => t.isCompleted).some((started) => started);
    const theoryStarted = topic.theoryTopics.map((t) => t.isCompleted).some((started) => started);
    const validationStarted = topic.validationTopics.map((t) => t.isCompleted).some((started) => started);
    return practiceStarted || theoryStarted || validationStarted;
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
