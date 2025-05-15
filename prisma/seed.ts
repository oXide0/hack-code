import { prisma, Role } from '../lib/prisma';
import { hash } from 'bcryptjs';

async function main() {
    try {
        // 1. Create a school
        const school = await prisma.school.create({
            data: {
                name: 'Springfield Elementary',
                address: '19 Plympton Street, Springfield',
                phone: '+1 555-123-4567',
                email: 'info@springfield.edu',
                website: 'https://springfield.edu'
            }
        });

        // Password hashing function
        const hashPassword = async (password: string) => {
            return await hash(password, 12);
        };

        // 2. Create school admin
        await prisma.user.create({
            data: {
                email: 'principal.skinner@springfield.edu',
                password: await hashPassword('SecurePassword123!'),
                firstName: 'Seymour',
                lastName: 'Skinner',
                role: Role.SCHOOL_ADMIN,
                schoolId: school.id
            }
        });

        // 3. Create teacher
        await prisma.user.create({
            data: {
                email: 'edna.krabappel@springfield.edu',
                password: await hashPassword('TeacherPass123!'),
                firstName: 'Edna',
                lastName: 'Krabappel',
                role: Role.TEACHER,
                schoolId: school.id,
                teacherProfile: {
                    create: {
                        schoolId: school.id
                    }
                }
            },
            include: {
                teacherProfile: true
            }
        });

        // 4. Create student
        await prisma.user.create({
            data: {
                email: 'bart.simpson@springfield.edu',
                password: await hashPassword('StudentPass123!'),
                firstName: 'Bart',
                lastName: 'Simpson',
                role: Role.STUDENT,
                schoolId: school.id,
                studentProfile: {
                    create: {
                        schoolId: school.id,
                        studentId: 'S-2023-001',
                        gradeLevel: '4'
                    }
                }
            },
            include: {
                studentProfile: true
            }
        });

        console.log('Seed data created successfully:');
    } catch (error) {
        console.error(error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
