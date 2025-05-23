import { TopicCard } from '@/components/core/topic-card';
import { prisma } from '@/lib/prisma';
import { Container, Heading, Text, Badge } from '@chakra-ui/react';
import Link from 'next/link';

export default async function Page({ params }: { params: Promise<{ sectionId: string }> }) {
    const { sectionId } = await params;
    const section = await prisma.section.findUniqueOrThrow({
        where: { id: sectionId },
        select: { title: true, description: true, topics: true }
    });

    return (
        <Container maxW='2xl'>
            <Heading>{section.title}</Heading>
            <Text color='gray.300'>{section.description}</Text>
            {section.topics.map((topic, index) => (
                <Link key={topic.id} href={`${sectionId}/topics/${topic.id}`}>
                    <TopicCard
                        number={`0${index}`}
                        title={topic.title}
                        rightElement={<></>}
                        badge={<Badge colorPalette='green'>Learn</Badge>}
                        isActive
                    />
                </Link>
            ))}
        </Container>
    );
}
