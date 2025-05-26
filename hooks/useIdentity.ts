import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { unstable_cache } from 'next/cache';
import { redirect } from 'next/navigation';

// const getUserById = unstable_cache(
//     async (id: string) => {
//         return await prisma.user.findUniqueOrThrow({
//             where: { id },
//             select: {
//                 id: true,
//                 role: true,
//                 firstName: true,
//                 lastName: true,
//                 email: true,
//                 school: true,
//                 createdAt: true
//             }
//         });
//     },
//     ['identity'],
//     { revalidate: 3600, tags: ['identity'] }
// );

export async function useIdentity() {
    const session = await getServerSession(authOptions);
    if (session == null || session.user == null) {
        return redirect('/login');
    }

    return await prisma.user.findUniqueOrThrow({
        where: { id: session.user.id },
        select: {
            id: true,
            role: true,
            firstName: true,
            lastName: true,
            email: true,
            school: true,
            createdAt: true,
            studentProfile: {
                select: {
                    level: true
                }
            }
        }
    });
}
