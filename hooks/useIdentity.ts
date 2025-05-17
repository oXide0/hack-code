import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';

export async function useIdentity() {
    const session = await getServerSession(authOptions);
    if (session == null || session.user == null) {
        return notFound();
    }

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: session.user.id
        },
        select: {
            id: true,
            role: true,
            firstName: true,
            lastName: true,
            email: true,
            school: true,
            createdAt: true
        }
    });

    return user;
}
