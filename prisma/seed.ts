import { prisma, Role } from '../lib/prisma';
import { hash } from 'bcryptjs';

async function seedUsers() {
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

    console.log('Users seed data created successfully');
}

export async function seedCourses() {
    await prisma.course.create({
        data: {
            title: 'Python for Beginners',
            description: 'An introductory course to Python programming.',
            sections: {
                create: [
                    {
                        title: 'Introduction to Python',
                        description: 'Overview of Python and its uses.',
                        order: 1,
                        isCompleted: false,
                        topics: {
                            create: [
                                {
                                    title: 'What is Python?',
                                    order: 1,
                                    isCompleted: false,
                                    type: 'THEORY',
                                    theoryTopic: {
                                        create: {
                                            question: "Explain what Python is and what it's used for.",
                                            codeSample: `# Example Python code\nprint("Hello, world!")`
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    {
                        title: 'Variables and Data Types',
                        description: 'Learn how to use variables and data types in Python.',
                        order: 2,
                        isCompleted: false,
                        topics: {
                            create: [
                                {
                                    title: 'Variables and Data Types',
                                    order: 1,
                                    isCompleted: false,
                                    type: 'THEORY',
                                    theoryTopic: {
                                        create: {
                                            question:
                                                'What are variables in Python? Provide examples of different data types.',
                                            codeSample: `x = 5  # integer\ny = "hello"  # string\nz = 3.14  # float`
                                        }
                                    }
                                },
                                {
                                    title: 'Practice: Variables',
                                    order: 2,
                                    isCompleted: false,
                                    type: 'PRACTICE',
                                    practiceTopic: {
                                        create: {
                                            task: 'Declare a variable called `name` and assign your name to it. Then print it.',
                                            starterCode: `# Your code here\n`
                                        }
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    });

    console.log('Course seed data created successfully');
}

async function main() {
    try {
        await seedUsers();
        await seedCourses();
        console.log('Seeding completed successfully');
    } catch (error) {
        console.error(error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
