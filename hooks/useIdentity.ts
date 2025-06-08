import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { unstable_cache } from 'next/cache';
import { redirect } from 'next/navigation';

const getUserById = unstable_cache(
    async (id: string) => {
        return await prisma.user.findUniqueOrThrow({
            where: { id },
            select: {
                id: true,
                role: true,
                firstName: true,
                lastName: true,
                email: true,
                createdAt: true,
                schoolId: true,
                studentProfile: {
                    select: {
                        id: true,
                        level: true,
                        classes: { select: { id: true } }
                    }
                },
                teacherProfile: {
                    select: {
                        id: true,
                        classes: { select: { id: true } }
                    }
                },
                schoolProfile: {
                    select: {
                        id: true,
                        classes: { select: { id: true } }
                    }
                }
            }
        });
    },
    ['identity'],
    { revalidate: 3600, tags: ['identity'] }
);

export async function getIdentity() {
    const session = await getServerSession(authOptions);
    if (session == null || session.user == null) {
        return redirect('/login');
    }

    return getUserById(session.user.id);
}
