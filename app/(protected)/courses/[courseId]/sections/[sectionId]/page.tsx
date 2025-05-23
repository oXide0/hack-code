import { TopicCard } from '@/components/core/topic-card';
import { prisma } from '@/lib/prisma';
import { Container, Heading, Text } from '@chakra-ui/react';

export default async function Page({ params }: { params: Promise<{ sectionId: string }> }) {
    const { sectionId } = await params;
    const section = await prisma.section.findUniqueOrThrow({
        where: { id: sectionId },
        select: { title: true, description: true, topics: true }
    });

    return (
        <Container maxW='2xl'>
            <Heading>{section.title}</Heading>
            <Text>{section.description}</Text>
            {section.topics.map((topic, index) => (
                <TopicCard
                    key={topic.id}
                    number={`0${index}`}
                    title={topic.title}
                    linkPath=''
                    rightElement={<></>}
                    badge={<></>}
                    isActive
                />
            ))}
        </Container>
    );
}
