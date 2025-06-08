import { prisma, Role } from '../lib/prisma';
import { hashPassword } from '../lib/utils';

const SCHOOL_ID = 'school-123';

async function seedUsers() {
    const user = await prisma.user.create({
        data: {
            email: 'michaela.vavrova@hackcode.net',
            password: await hashPassword('artemis'),
            firstName: 'Michaela',
            lastName: 'Vavrová',
            role: Role.SUPER_ADMIN,
            schoolId: SCHOOL_ID,
            status: 'active'
        },
        select: { id: true }
    });

    await prisma.school.create({
        data: { id: SCHOOL_ID, adminId: user.id, name: 'Springfield Elementary' },
        select: { id: true }
    });
}

async function main() {
    try {
        await seedUsers();

        console.log('Seeding completed successfully');
    } catch (error) {
        console.error(error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
