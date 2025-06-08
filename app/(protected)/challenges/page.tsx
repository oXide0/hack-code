import { ChallengeCard } from '@/components/challenges/challenge-card';
import { ChallengesFilters } from '@/components/challenges/challenges-filters';
import { getIdentity } from '@/hooks/useIdentity';
import { prisma, Prisma } from '@/lib/prisma';
import { call } from '@/lib/utils';
import { Flex } from '@chakra-ui/react';

interface PageProps {
    readonly searchParams?: Promise<{ query?: string; difficulty?: string; sort?: string }>;
}

export default async function Page(props: PageProps) {
    const identity = await getIdentity();

    const searchParams = await props.searchParams;
    const search = searchParams?.query?.trim() || '';
    const difficulty = searchParams?.difficulty;

    const challenges = await prisma.challenge.findMany({
        where: challengesWhere({
            schoolId: identity.schoolId,
            search,
            difficulty,
            classIds: call(() => {
                if (identity.role === 'SCHOOL_ADMIN' && identity.schoolProfile) {
                    return identity.schoolProfile.classes.map(({ id }) => id);
                }
                if (identity.role === 'TEACHER' && identity.teacherProfile) {
                    return identity.teacherProfile.classes.map(({ id }) => id);
                }
                if (identity.role === 'STUDENT' && identity.studentProfile) {
                    return identity.studentProfile.classes.map(({ id }) => id);
                }
            }),
            studentId: identity.studentProfile?.id
        }),
        select: {
            id: true,
            title: true,
            description: true,
            difficulty: true,
            deadline: true,
            createdAt: true,
            createdBy: true,
            school: { select: { id: true } },
            solutions: { select: { id: true } }
        },
        orderBy: { deadline: 'asc' }
    });

    return (
        <Flex gap={4} py={2}>
            <ChallengesFilters role={identity.role} />
            <Flex flexDir='column' gap={4} w='full' pl='396px'>
                {challenges.map((challenge) => (
                    <ChallengeCard
                        key={challenge.id}
                        id={challenge.id}
                        isStudent={identity.role === 'STUDENT'}
                        isOwner={identity.id === challenge.createdBy}
                        isDone={challenge.solutions.length > 0}
                        title={challenge.title}
                        deadline={challenge.deadline}
                        description={challenge.description}
                        difficulty={challenge.difficulty}
                        createdAt={challenge.createdAt.toLocaleDateString()}
                        schoolName={challenge.school.id}
                    />
                ))}
            </Flex>
        </Flex>
    );
}

interface ChallengesWhereArgs {
    readonly search: string;
    readonly difficulty: string | undefined;
    readonly schoolId: string;
    readonly studentId?: string;
    readonly classIds?: string[];
}

function challengesWhere(args: ChallengesWhereArgs): Prisma.ChallengeWhereInput {
    const where: Prisma.ChallengeWhereInput = { schoolId: args.schoolId };

    if (args.search) {
        where.OR = [
            { title: { contains: args.search, mode: 'insensitive' } },
            { description: { contains: args.search, mode: 'insensitive' } }
        ];
    }
    if (args.difficulty && !Number.isNaN(args.difficulty)) {
        where.difficulty = Number(args.difficulty);
    }
    if (args.studentId) {
        where.assignedStudents = {
            some: { id: args.studentId }
        };
    }
    if (args.classIds) {
        where.assignedClasses = {
            some: { id: { in: args.classIds } }
        };
    }

    return where;
}
