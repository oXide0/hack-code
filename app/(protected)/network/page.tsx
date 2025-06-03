import { NetworkTable } from '@/components/network/network-table';
import { getIdentity } from '@/hooks/useIdentity';
import { sendInviteEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';
import { getOrigin } from '@/lib/origin';
import { Heading } from '@chakra-ui/react';

export default async function Page() {
    const identity = await getIdentity();
    if (identity.role !== 'SCHOOL_ADMIN' && identity.role !== 'TEACHER') {
        return <Heading>Access Denied</Heading>;
    }
    const classes = await prisma.class.findMany({
        where: { schoolId: identity.schoolId },
        include: {
            students: { select: { id: true, user: { select: { firstName: true, lastName: true, email: true } } } },
            teachers: { select: { id: true, user: { select: { firstName: true, lastName: true, email: true } } } }
        }
    });
    const students = await prisma.student.findMany({
        where: { schoolId: identity.schoolId },
        select: { id: true, user: { select: { email: true, firstName: true, lastName: true, status: true } } }
    });
    const teachers = await prisma.teacher.findMany({
        where: { schoolId: identity.schoolId },
        select: { id: true, user: { select: { email: true, firstName: true, lastName: true, status: true } } }
    });

    return (
        <NetworkTable
            userRole={identity.role}
            schoolId={identity.schoolId}
            classes={classes}
            students={students.map((student) => ({
                label: `${student.user.firstName} ${student.user.lastName}`,
                value: student.id,
                status: student.user.status
            }))}
            teachers={teachers.map((teacher) => ({
                label: `${teacher.user.firstName} ${teacher.user.lastName}`,
                value: teacher.id,
                status: teacher.user.status
            }))}
            invitedStudents={students
                .filter((student) => student.user.status === 'invited')
                .map((student) => student.user.email)}
            invitedTeachers={teachers
                .filter((teacher) => teacher.user.status === 'invited')
                .map((teacher) => teacher.user.email)}
            onCreateClass={async ({ schoolId, data }) => {
                'use server';
                await prisma.class.create({
                    data: {
                        name: data.name,
                        schoolId: schoolId,
                        students: {
                            connect: data.students.map((studentId) => ({ id: studentId }))
                        },
                        teachers: {
                            connect: data.teachers.map((teacherId) => ({ id: teacherId }))
                        }
                    }
                });
            }}
            onUpdateClass={async ({ schoolId, data, classId }) => {
                'use server';
                await prisma.class.update({
                    where: { id: classId },
                    data: {
                        name: data.name,
                        schoolId: schoolId,
                        students: {
                            set: data.students.map((studentId) => ({ id: studentId }))
                        },
                        teachers: {
                            set: data.teachers.map((teacherId) => ({ id: teacherId }))
                        }
                    }
                });
            }}
            onDeleteClass={async (classIds) => {
                'use server';
                await prisma.class.deleteMany({ where: { id: { in: classIds } } });
            }}
            onInviteUsers={async ({ data, schoolId }) => {
                'use server';
                const origin = await getOrigin();

                for (const email of data.emails) {
                    if (data.variant === 'students') {
                        const { id } = await prisma.user.create({
                            data: {
                                email,
                                firstName: '',
                                lastName: '',
                                password: '',
                                role: 'STUDENT',
                                status: 'invited',
                                schoolId: schoolId,
                                studentProfile: {
                                    create: {
                                        level: 1,
                                        studentId: '', // change to real student id of school
                                        schoolId: schoolId
                                    }
                                }
                            }
                        });
                        await sendInviteEmail({
                            to: email,
                            variant: data.variant,
                            inviteLink: `${origin}/onboarding/${id}`
                        });
                    } else if (data.variant === 'teachers') {
                        const { id } = await prisma.user.create({
                            data: {
                                email,
                                firstName: '',
                                lastName: '',
                                password: '',
                                role: 'TEACHER',
                                status: 'invited',
                                schoolId: schoolId,
                                teacherProfile: {
                                    create: {
                                        schoolId: schoolId
                                    }
                                }
                            }
                        });
                        await sendInviteEmail({
                            to: email,
                            variant: data.variant,
                            inviteLink: `${origin}/onboarding/${id}`
                        });
                    }
                }
            }}
        />
    );
}
