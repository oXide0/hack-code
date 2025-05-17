import { prisma } from '@/lib/prisma';

export async function getUserById(id: string) {
    return await prisma.user.findUniqueOrThrow({
        where: { id },
        include: {
            school: true,
            teacherProfile: true,
            studentProfile: true
        },
        omit: {
            password: true
        }
    });
}

export type UserProfile = Awaited<ReturnType<typeof getUserById>>;
