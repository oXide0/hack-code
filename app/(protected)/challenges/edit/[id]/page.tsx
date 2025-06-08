import { ChallengeForm } from '@/components/challenges/challenge-form';
import { getIdentity } from '@/hooks/useIdentity';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const identity = await getIdentity();

    const challenge = await prisma.challenge.findUniqueOrThrow({
        where: { id },
        select: {
            title: true,
            description: true,
            difficulty: true,
            deadline: true,
            exampleContent: true,
            assignedClasses: { select: { id: true } },
            assignedStudents: { select: { id: true } }
        }
    });
    const classes = await prisma.class.findMany({
        where: { schoolId: identity.schoolId },
        select: {
            id: true,
            name: true,
            students: { select: { id: true, user: { select: { firstName: true, lastName: true } } } }
        }
    });

    const students = await prisma.student.findMany({
        where: { schoolId: identity.schoolId },
        select: { id: true, user: { select: { firstName: true, lastName: true } } }
    });

    return (
        <ChallengeForm
            initialValues={{
                title: challenge.title,
                description: challenge.description,
                difficulty: challenge.difficulty,
                deadline: challenge.deadline,
                exampleContent: challenge.exampleContent || undefined,
                assignedStudents: challenge.assignedStudents.map(({ id }) => id),
                assignedClasses: challenge.assignedClasses.map(({ id }) => id)
            }}
            classes={classes.map((cls) => ({
                label: cls.name,
                value: cls.id,
                students: cls.students.map((student) => ({
                    label: `${student.user.firstName} ${student.user.lastName}`,
                    value: student.id
                }))
            }))}
            students={students.map((student) => ({
                label: `${student.user.firstName} ${student.user.lastName}`,
                value: student.id
            }))}
            onSubmit={async (data) => {
                'use server';
                await prisma.challenge.update({
                    where: { id },
                    data: {
                        title: data.title,
                        description: data.description,
                        difficulty: data.difficulty,
                        deadline: data.deadline,
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
