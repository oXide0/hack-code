import { ChallengeCard } from '@/components/core/challenge-card';
import { ChallengesFilters } from '@/components/core/challenges-filters';
import { getIdentity } from '@/hooks/useIdentity';
import { prisma, Prisma } from '@/lib/prisma';
import { Flex } from '@chakra-ui/react';

interface PageProps {
    readonly searchParams?: Promise<{ query?: string; difficulty?: string; sort?: string }>;
}

export default async function Page(props: PageProps) {
    const identity = await getIdentity();

    const searchParams = await props.searchParams;
    const search = searchParams?.query?.trim() || '';
    const difficulty = searchParams?.difficulty;
    const sort = searchParams?.sort === 'old' ? 'asc' : 'desc';

    const challenges = await prisma.challenge.findMany({
        where: challengesWhere({ schoolId: identity.schoolId, search, difficulty }),
        select: {
            id: true,
            title: true,
            description: true,
            difficulty: true,
            createdAt: true,
            school: { select: { id: true } }
        },
        orderBy: { createdAt: sort }
    });
    const sortedChallenges = challenges.sort((a, b) => a.difficulty - b.difficulty);

    return (
        <Flex gap={4} py={2}>
            <ChallengesFilters />
            <Flex flexDir='column' gap={4} w='full' pl='396px'>
                {sortedChallenges.map((challenge) => (
                    <ChallengeCard
                        key={challenge.id}
                        id={challenge.id}
                        title={challenge.title}
                        description={challenge.description}
                        difficulty={challenge.difficulty}
                        createdAt={challenge.createdAt}
                        schoolName={challenge.school.id}
                    />
                ))}
            </Flex>
        </Flex>
    );
}

function challengesWhere({
    schoolId,
    search,
    difficulty
}: {
    search: string;
    difficulty: string | undefined;
    schoolId: string;
}): Prisma.ChallengeWhereInput {
    const where: Prisma.ChallengeWhereInput = { schoolId };

    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
        ];
    }
    if (difficulty && !Number.isNaN(difficulty)) {
        where.difficulty = Number(difficulty);
    }

    return where;
}
