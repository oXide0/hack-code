import { NetworkTable } from '@/components/network/network-table';
import { getIdentity } from '@/hooks/useIdentity';
import { prisma } from '@/lib/prisma';
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
        select: { id: true, user: { select: { firstName: true, lastName: true } } }
    });
    const teachers = await prisma.teacher.findMany({
        where: { schoolId: identity.schoolId },
        select: { id: true, user: { select: { firstName: true, lastName: true } } }
    });

    return (
        <NetworkTable
            schoolId={identity.schoolId}
            items={classes}
            students={students.map((student) => ({
                label: `${student.user.firstName} ${student.user.lastName}`,
                value: student.id
            }))}
            teachers={teachers.map((student) => ({
                label: `${student.user.firstName} ${student.user.lastName}`,
                value: student.id
            }))}
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
        />
    );
}
