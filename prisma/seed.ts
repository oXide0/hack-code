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
                    level: 1
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
                                    title: 'What is data types?',
                                    order: 1,
                                    isCompleted: false,
                                    type: 'THEORY',
                                    theoryTopics: {
                                        createMany: {
                                            data: [
                                                {
                                                    order: 1,
                                                    content:
                                                        'In programming, each piece of data has its own unique type. This type is like a blueprint — it tells us how the data is stored in memory, what we can do with it, and how to perform those operations. Think of it as a playbook for each piece of data! As a real-world analogy, think of a dog as a type of biological species. Dogs can bark, right? That’s like an operation specific to that type.\n\nNow, in the upcoming steps, we’re going to dive into some basic data types in Python.\n\nIn programming, each piece of data has its own unique type. This type is like a blueprint — it tells us how the data is stored in memory, what we can do with it, and how to perform those operations. Think of it as a playbook for each piece of data!\nAs a real-world analogy, think of a dog as a type of biological species. Dogs can bark, right? That’s like an operation specific to that type.\n\nNow, in the upcoming steps, we’re going to dive into some basic data types in Python.',
                                                    codeSample: `// Imports\nimport mongoose, { Schema } from 'mongoose'\n\n// Collection name\nexport const collection = 'Product'\n\n// Schema\nconst schema = new Schema({\n  name: {\n    type: String,\n    required: true\n  },\n\n  description: {\n    type: String\n  }\n}, {timestamps: true})\n\n// Model\nexport default mongoose.model(collection, schema, collection)`,
                                                    isCompleted: false
                                                },
                                                {
                                                    order: 2,
                                                    content: `
                                                            = Hello, AsciiDoc!

This is an interactive editor.
Use it to try https://asciidoc.org[AsciiDoc].

== Section Title

* A list item
* Another list item

[,ruby]
----
puts 'Hello, World!'
----
                                                        `,
                                                    codeSample: `// Imports\nimport mongoose, { Schema } from 'mongoose'\n\n// Collection name\nexport const collection = 'Product'\n\n// Schema\nconst schema = new Schema({\n  name: {\n    type: String,\n    required: true\n  },\n\n  description: {\n    type: String\n  }\n}, {timestamps: true})\n\n// Model\nexport default mongoose.model(collection, schema, collection)`,
                                                    isCompleted: false
                                                }
                                            ]
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
                                    type: 'VALIDATION',
                                    validationTopics: {
                                        create: {
                                            order: 1,
                                            question: 'What was written in this code? ',
                                            codeSample: `// Imports\n import mongoose, { Schema } from 'mongoose'\n\n// Collection name export const collection = 'Product'`,
                                            isCompleted: false,
                                            validationAnswers: {
                                                create: [
                                                    { value: 'How the data is stored', isCorrect: true },
                                                    { value: 'The color of the data', isCorrect: false },
                                                    {
                                                        value: 'The operations that can be performed on it',
                                                        isCorrect: false
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                },
                                {
                                    title: 'Practice: Variables',
                                    order: 2,
                                    isCompleted: false,
                                    type: 'PRACTICE',
                                    practiceTopics: {
                                        create: {
                                            order: 1,
                                            task: 'Declare a variable called `name` and assign your name to it. Then print it.',
                                            starterCode: `# Your code here\n`,
                                            isCompleted: false
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
