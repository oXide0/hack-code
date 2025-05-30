import { ChallengeForm } from '@/components/forms/challenge-form';
import { getIdentity } from '@/hooks/useIdentity';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function Page() {
    const identity = await getIdentity();
    const classes = await prisma.class.findMany({
        where: { schoolId: identity.schoolId },
        select: { id: true, name: true }
    });
    const students = await prisma.student.findMany({
        where: { schoolId: identity.schoolId },
        select: { id: true, user: { select: { firstName: true, lastName: true } } }
    });

    return (
        <ChallengeForm
            classes={classes.map((cls) => ({ label: cls.name, value: cls.id }))}
            students={students.map((student) => ({
                label: `${student.user.firstName} ${student.user.lastName}`,
                value: student.id
            }))}
            onSubmit={async (data) => {
                'use server';
                await prisma.challenge.create({
                    data: {
                        title: data.title,
                        description: data.description,
                        difficulty: data.difficulty,
                        exampleContent: data.exampleContent || undefined,
                        assignedStudents: {
                            connect: data.assignedStudents.map((id) => ({ id }))
                        },
                        assignedClasses: {
                            connect: data.assignedClasses.map((id) => ({ id }))
                        },
                        schoolId: identity.schoolId
                    }
                });
                redirect('/challenges');
            }}
        />
    );
}
