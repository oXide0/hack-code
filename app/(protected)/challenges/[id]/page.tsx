import { TrainableChallenge } from '@/components/core/trainable-challenge';
import { getIdentity } from '@/hooks/useIdentity';
import { prisma } from '@/lib/prisma';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const identity = await getIdentity();
    const { id } = await params;
    const challenge = await prisma.challenge.findUniqueOrThrow({
        where: { id },
        select: { id: true, title: true, description: true, difficulty: true, exampleContent: true }
    });

    return (
        <TrainableChallenge
            title={challenge.title}
            description={challenge.description}
            difficulty={challenge.difficulty}
            exampleContent={challenge.exampleContent}
            onSubmit={async (solution: string) => {
                'use server';
                if (identity.studentProfile == null) throw new Error('You must be a student to submit a solution.');
                await prisma.challenge.update({
                    where: { id: challenge.id },
                    data: {
                        solutions: { create: { code: solution, studentId: identity.studentProfile.id } }
                    }
                });
            }}
        />
    );
}
