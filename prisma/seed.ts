import { prisma, Role, UserStatus } from '../lib/prisma';
import { hashPassword } from '../lib/utils';

const SCHOOL_ID = 'school-123';

async function seedUsers() {
    // 1. Create school admin
    const user = await prisma.user.create({
        data: {
            email: 'principal.skinner@springfield.edu',
            password: await hashPassword('SecurePassword123!'),
            firstName: 'Seymour',
            lastName: 'Skinner',
            role: Role.SCHOOL_ADMIN,
            schoolId: SCHOOL_ID,
            status: 'active'
        },
        select: { id: true }
    });

    // 2. Create school
    const school = await prisma.school.create({
        data: { id: SCHOOL_ID, adminId: user.id, name: 'Springfield Elementary' },
        select: { id: true }
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
            status: 'active',
            teacherProfile: {
                create: {
                    schoolId: school.id
                }
            }
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
            status: 'active',
            studentProfile: {
                create: {
                    schoolId: school.id,
                    studentId: 'S-2023-001',
                    level: 1
                }
            }
        }
    });

    console.log('Users seed data created successfully');
}

async function seedClasses() {
    const school = await prisma.school.findFirstOrThrow({
        where: { id: SCHOOL_ID }
    });

    // Get teachers and students
    const [teachers, students] = await Promise.all([
        prisma.teacher.findMany({
            include: { user: true },
            where: { schoolId: school.id }
        }),
        prisma.student.findMany({
            include: { user: true },
            where: { schoolId: school.id }
        })
    ]);

    // Create additional teachers if needed
    if (teachers.length < 3) {
        const newTeachersData = [
            {
                email: 'elizabeth.hoover@springfield.edu',
                password: await hashPassword('TeacherPass123!'),
                firstName: 'Elizabeth',
                lastName: 'Hoover',
                role: Role.TEACHER,
                schoolId: school.id,
                status: UserStatus.active
            },
            {
                email: 'seymour.skinner@springfield.edu',
                password: await hashPassword('PrincipalPass123!'),
                firstName: 'Seymour',
                lastName: 'Skinner',
                role: Role.TEACHER,
                schoolId: school.id,
                status: UserStatus.active
            }
        ];

        // Create users for new teachers
        for (const teacher of newTeachersData) {
            // Create user
            const user = await prisma.user.create({
                data: teacher
            });
            // Create teacher profile
            await prisma.teacher.create({
                data: {
                    userId: user.id,
                    schoolId: school.id
                }
            });
        }
    }

    // Refresh teachers list
    const allTeachers = await prisma.teacher.findMany({
        include: { user: true },
        where: { schoolId: school.id }
    });

    // Create additional students if needed
    if (students.length < 10) {
        const newStudents = [
            { firstName: 'Lisa', lastName: 'Simpson', studentId: 'S-2023-002', level: 2 },
            { firstName: 'Milhouse', lastName: 'Van Houten', studentId: 'S-2023-003', level: 1 },
            { firstName: 'Nelson', lastName: 'Muntz', studentId: 'S-2023-004', level: 1 },
            { firstName: 'Ralph', lastName: 'Wiggum', studentId: 'S-2023-005', level: 1 },
            { firstName: 'Martin', lastName: 'Prince', studentId: 'S-2023-006', level: 2 },
            { firstName: 'Janey', lastName: 'Powell', studentId: 'S-2023-007', level: 2 },
            { firstName: 'Sherri', lastName: 'Mackleberry', studentId: 'S-2023-008', level: 1 },
            { firstName: 'Terri', lastName: 'Mackleberry', studentId: 'S-2023-009', level: 1 },
            { firstName: 'Wendell', lastName: 'Borton', studentId: 'S-2023-010', level: 2 }
        ];
        const password = await hashPassword('StudentPass123!');
        for (const student of newStudents) {
            // Create user
            const user = await prisma.user.create({
                data: {
                    email: `${student.firstName.toLowerCase()}.${student.lastName.toLowerCase()}@springfield.edu`,
                    password,
                    firstName: student.firstName,
                    lastName: student.lastName,
                    role: 'STUDENT',
                    schoolId: school.id,
                    status: 'active'
                }
            });
            // Create student profile
            await prisma.student.create({
                data: {
                    userId: user.id,
                    schoolId: school.id,
                    studentId: student.studentId,
                    level: student.level
                }
            });
        }
    }

    // Refresh students list
    const allStudents = await prisma.student.findMany({
        include: { user: true },
        where: { schoolId: school.id }
    });

    // Create classes if not exist
    const classNames = ['Grade 1 - A', 'Grade 1 - B', 'Grade 2 - A', 'Grade 2 - B', 'Music Class', 'Art Class'];

    for (const className of classNames) {
        await prisma.class.create({
            data: { name: className, schoolId: school.id }
        });
    }

    // Get all classes
    const allClasses = await prisma.class.findMany({
        where: { schoolId: school.id }
    });

    // Assign teachers to classes
    const krabappel = allTeachers.find((t) => t.user.lastName === 'Krabappel');
    const hoover = allTeachers.find((t) => t.user.lastName === 'Hoover');
    const skinner = allTeachers.find((t) => t.user.lastName === 'Skinner');

    // Helper to find class by name
    const findClass = (className: string) => allClasses.find((c) => c.name === className);

    // Connect teachers to classes, using upsert for idempotency
    if (krabappel) {
        for (const name of ['Grade 1 - A', 'Grade 1 - B']) {
            const cls = findClass(name);
            if (cls) {
                await prisma.class.update({
                    where: { id: cls.id },
                    data: {
                        teachers: { connect: [{ id: krabappel.id }] }
                    }
                });
            }
        }
    }
    if (hoover) {
        for (const name of ['Grade 2 - A', 'Grade 2 - B']) {
            const cls = findClass(name);
            if (cls) {
                await prisma.class.update({
                    where: { id: cls.id },
                    data: {
                        teachers: { connect: [{ id: hoover.id }] }
                    }
                });
            }
        }
    }
    if (skinner) {
        for (const name of ['Music Class', 'Art Class']) {
            const cls = findClass(name);
            if (cls) {
                await prisma.class.update({
                    where: { id: cls.id },
                    data: {
                        teachers: { connect: [{ id: skinner.id }] }
                    }
                });
            }
        }
    }

    // Assign students to classes
    const grade1Students = allStudents.filter((s) => s.level === 1);
    const grade2Students = allStudents.filter((s) => s.level === 2);

    // Grade 1 classes
    const grade1A = findClass('Grade 1 - A');
    const grade1B = findClass('Grade 1 - B');
    if (grade1A) {
        await prisma.class.update({
            where: { id: grade1A.id },
            data: {
                students: {
                    connect: grade1Students.slice(0, 5).map((s) => ({ id: s.id }))
                }
            }
        });
    }
    if (grade1B) {
        await prisma.class.update({
            where: { id: grade1B.id },
            data: {
                students: {
                    connect: grade1Students.slice(5).map((s) => ({ id: s.id }))
                }
            }
        });
    }

    // Grade 2 classes
    const grade2A = findClass('Grade 2 - A');
    const grade2B = findClass('Grade 2 - B');
    if (grade2A) {
        await prisma.class.update({
            where: { id: grade2A.id },
            data: {
                students: {
                    connect: grade2Students.slice(0, 4).map((s) => ({ id: s.id }))
                }
            }
        });
    }
    if (grade2B) {
        await prisma.class.update({
            where: { id: grade2B.id },
            data: {
                students: {
                    connect: grade2Students.slice(4).map((s) => ({ id: s.id }))
                }
            }
        });
    }

    // Music and Art classes (all students)
    for (const name of ['Music Class', 'Art Class']) {
        const cls = findClass(name);
        if (cls) {
            await prisma.class.update({
                where: { id: cls.id },
                data: {
                    students: {
                        connect: allStudents.map((s) => ({ id: s.id }))
                    }
                }
            });
        }
    }

    console.log('Classes seed data created successfully');
}

export async function seedCourses() {
    await prisma.course.create({
        data: {
            title: 'Python for Beginners',
            description: 'A comprehensive introduction to Python programming from basics to intermediate concepts.',
            sections: {
                create: [
                    {
                        title: 'Introduction to Python',
                        description: 'Overview of Python and its uses.',
                        order: 1,
                        topics: {
                            create: [
                                {
                                    title: 'Basic Concepts',
                                    order: 1,
                                    exercises: {
                                        create: [
                                            {
                                                type: 'THEORY',
                                                order: 1,
                                                content:
                                                    'In programming, each piece of data has its own unique type...',
                                                codeSample: `// Imports\nimport mongoose, { Schema } from 'mongoose'`
                                            },
                                            {
                                                type: 'THEORY',
                                                order: 2,
                                                content: '= Hello, AsciiDoc!\n\nThis is an interactive editor...',
                                                codeSample: `// Imports\nimport mongoose, { Schema } from 'mongoose'`
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    },
                    {
                        title: 'Variables and Data Types',
                        description: 'Learn how to use variables and data types in Python.',
                        order: 2,
                        topics: {
                            create: [
                                {
                                    title: 'Working with Variables',
                                    order: 1,
                                    exercises: {
                                        create: [
                                            {
                                                type: 'VALIDATION',
                                                order: 1,
                                                content: 'What was written in this code?',
                                                codeSample: `// Imports\nimport mongoose, { Schema } from 'mongoose'`,
                                                options: {
                                                    choices: [
                                                        'How the data is stored',
                                                        'The color of the data',
                                                        'The operations that can be performed on it'
                                                    ],
                                                    correctIndex: 0
                                                }
                                            },
                                            {
                                                type: 'PRACTICE',
                                                order: 2,
                                                content:
                                                    'Declare a variable called `name` and assign your name to it. Then print it.',
                                                starterCode: `# Your code here\n`,
                                                solution: `name = "Your Name"\nprint(name)`
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    },
                    {
                        title: 'Control Flow',
                        description: 'Learn about conditionals and loops in Python.',
                        order: 3,
                        topics: {
                            create: [
                                {
                                    title: 'If Statements',
                                    order: 1,
                                    exercises: {
                                        create: [
                                            {
                                                type: 'THEORY',
                                                order: 1,
                                                content: 'If statements allow your program to make decisions...',
                                                codeSample: `age = 18\nif age >= 18:\n    print("You're an adult")`
                                            },
                                            {
                                                type: 'PRACTICE',
                                                order: 2,
                                                content:
                                                    'Write a program that checks if a number is positive, negative, or zero.',
                                                starterCode: `number = 10  # Try changing this value\n# Your code here`,
                                                solution: `number = 10\nif number > 0:\n    print("Positive")\nelif number < 0:\n    print("Negative")\nelse:\n    print("Zero")`
                                            }
                                        ]
                                    }
                                },
                                {
                                    title: 'Loops',
                                    order: 2,
                                    exercises: {
                                        create: [
                                            {
                                                type: 'THEORY',
                                                order: 1,
                                                content: 'Loops allow you to repeat actions in your code...',
                                                codeSample: `# For loop example\nfor i in range(5):\n    print(i)`
                                            },
                                            {
                                                type: 'PRACTICE',
                                                order: 2,
                                                content: 'Write a program that prints the first 10 even numbers.',
                                                starterCode: `# Your code here`,
                                                solution: `for i in range(2, 21, 2):\n    print(i)`
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    },
                    {
                        title: 'Functions',
                        description: 'Learn to create and use functions in Python.',
                        order: 4,
                        topics: {
                            create: [
                                {
                                    title: 'Function Basics',
                                    order: 1,
                                    exercises: {
                                        create: [
                                            {
                                                type: 'THEORY',
                                                order: 1,
                                                content:
                                                    'Functions are reusable blocks of code that perform specific tasks...',
                                                codeSample: `def greet(name):\n    return f"Hello, {name}!"`
                                            },
                                            {
                                                type: 'PRACTICE',
                                                order: 2,
                                                content: 'Create a function that calculates the area of a rectangle.',
                                                starterCode: `# Your code here`,
                                                solution: `def rectangle_area(length, width):\n    return length * width`
                                            }
                                        ]
                                    }
                                },
                                {
                                    title: 'Return Values',
                                    order: 2,
                                    exercises: {
                                        create: [
                                            {
                                                type: 'VALIDATION',
                                                order: 1,
                                                content: 'What does this function return when called with 5?',
                                                codeSample: `def square(x):\n    return x * x`,
                                                options: {
                                                    choices: ['10', '25', '5', 'None'],
                                                    correctIndex: 1
                                                }
                                            },
                                            {
                                                type: 'PRACTICE',
                                                order: 2,
                                                content: 'Write a function that checks if a number is prime.',
                                                starterCode: `def is_prime(n):\n    # Your code here`,
                                                solution: `def is_prime(n):\n    if n <= 1:\n        return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            return False\n    return True`
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    },
                    {
                        title: 'Data Structures',
                        description: 'Learn about lists, dictionaries, and other data structures.',
                        order: 5,
                        topics: {
                            create: [
                                {
                                    title: 'Lists',
                                    order: 1,
                                    exercises: {
                                        create: [
                                            {
                                                type: 'THEORY',
                                                order: 1,
                                                content: 'Lists are ordered collections of items...',
                                                codeSample: `fruits = ['apple', 'banana', 'cherry']\nprint(fruits[1])  # Outputs 'banana'`
                                            },
                                            {
                                                type: 'PRACTICE',
                                                order: 2,
                                                content:
                                                    'Write a function that returns the sum of all numbers in a list.',
                                                starterCode: `def sum_list(numbers):\n    # Your code here`,
                                                solution: `def sum_list(numbers):\n    total = 0\n    for num in numbers:\n        total += num\n    return total`
                                            }
                                        ]
                                    }
                                },
                                {
                                    title: 'Dictionaries',
                                    order: 2,
                                    exercises: {
                                        create: [
                                            {
                                                type: 'THEORY',
                                                order: 1,
                                                content: 'Dictionaries store key-value pairs...',
                                                codeSample: `person = {\n    "name": "Alice",\n    "age": 25\n}`
                                            },
                                            {
                                                type: 'PRACTICE',
                                                order: 2,
                                                content:
                                                    'Create a function that counts how many times each word appears in a string.',
                                                starterCode: `def word_count(text):\n    # Your code here`,
                                                solution: `def word_count(text):\n    words = text.split()\n    counts = {}\n    for word in words:\n        counts[word] = counts.get(word, 0) + 1\n    return counts`
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    },
                    {
                        title: 'File Handling',
                        description: 'Learn to read from and write to files in Python.',
                        order: 6,
                        topics: {
                            create: [
                                {
                                    title: 'Reading Files',
                                    order: 1,
                                    exercises: {
                                        create: [
                                            {
                                                type: 'THEORY',
                                                order: 1,
                                                content: 'Files allow you to store data permanently...',
                                                codeSample: `# Reading a file\nwith open('data.txt') as file:\n    content = file.read()`
                                            },
                                            {
                                                type: 'PRACTICE',
                                                order: 2,
                                                content: 'Write a function that counts lines in a file.',
                                                starterCode: `def count_lines(filename):\n    # Your code here`,
                                                solution: `def count_lines(filename):\n    with open(filename) as file:\n        return len(file.readlines())`
                                            }
                                        ]
                                    }
                                },
                                {
                                    title: 'Writing Files',
                                    order: 2,
                                    exercises: {
                                        create: [
                                            {
                                                type: 'THEORY',
                                                order: 1,
                                                content: 'Writing to files preserves data after program ends...',
                                                codeSample: `# Writing to a file\nwith open('output.txt', 'w') as file:\n    file.write('Hello World!')`
                                            },
                                            {
                                                type: 'PRACTICE',
                                                order: 2,
                                                content: 'Create a function that writes user data to a CSV file.',
                                                starterCode: `def save_to_csv(filename, data):\n    # Your code here`,
                                                solution: `def save_to_csv(filename, data):\n    import csv\n    with open(filename, 'w', newline='') as file:\n        writer = csv.writer(file)\n        writer.writerows(data)`
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    },
                    {
                        title: 'Object-Oriented Python',
                        description: 'Learn classes, objects, and OOP principles.',
                        order: 7,
                        topics: {
                            create: [
                                {
                                    title: 'Classes & Objects',
                                    order: 1,
                                    exercises: {
                                        create: [
                                            {
                                                type: 'THEORY',
                                                order: 1,
                                                content: 'Classes are blueprints for creating objects...',
                                                codeSample: `class Dog:\n    def __init__(self, name):\n        self.name = name\n\n    def bark(self):\n        return "Woof!"`
                                            },
                                            {
                                                type: 'PRACTICE',
                                                order: 2,
                                                content: 'Create a BankAccount class with deposit/withdraw methods.',
                                                starterCode: `class BankAccount:\n    # Your code here`,
                                                solution: `class BankAccount:\n    def __init__(self, balance=0):\n        self.balance = balance\n    \n    def deposit(self, amount):\n        self.balance += amount\n    \n    def withdraw(self, amount):\n        if amount <= self.balance:\n            self.balance -= amount\n        else:\n            print("Insufficient funds")`
                                            }
                                        ]
                                    }
                                },
                                {
                                    title: 'Inheritance',
                                    order: 2,
                                    exercises: {
                                        create: [
                                            {
                                                type: 'THEORY',
                                                order: 1,
                                                content: 'Inheritance allows creating specialized classes...',
                                                codeSample: `class Animal:\n    def speak(self):\n        pass\n\nclass Cat(Animal):\n    def speak(self):\n        return "Meow!"`
                                            },
                                            {
                                                type: 'PRACTICE',
                                                order: 2,
                                                content: 'Create a Vehicle base class and Car subclass.',
                                                starterCode: `# Your code here`,
                                                solution: `class Vehicle:\n    def __init__(self, make, model):\n        self.make = make\n        self.model = model\n\nclass Car(Vehicle):\n    def __init__(self, make, model, num_doors):\n        super().__init__(make, model)\n        self.num_doors = num_doors`
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    });

    console.log('Python course with 5 sections created successfully');
}

async function seedChallenges() {
    const school = await prisma.school.findFirstOrThrow({
        where: {
            id: SCHOOL_ID
        }
    });

    await prisma.challenge.createMany({
        data: [
            {
                title: 'Sum of Two Numbers',
                description: 'Write a function that returns the sum of two given numbers.',
                difficulty: 1,
                schoolId: school.id
            },
            {
                title: 'Find the Maximum',
                description: 'Write a function to find the maximum number in an array.',
                difficulty: 2,
                schoolId: school.id
            },
            {
                title: 'FizzBuzz',
                description:
                    'Write a function that prints the numbers from 1 to 100. But for multiples of three print "Fizz" instead of the number and for the multiples of five print "Buzz". For numbers which are multiples of both three and five print "FizzBuzz".',
                difficulty: 1,
                schoolId: school.id
            },
            {
                title: 'Palindrome Checker',
                description: 'Determine if a given string is a palindrome.',
                difficulty: 2,
                schoolId: school.id
            },
            {
                title: 'Factorial',
                description: 'Write a recursive function to find the factorial of a number.',
                difficulty: 3,
                schoolId: school.id
            }
        ]
    });

    console.log('Challenges seeded successfully');
}

async function main() {
    try {
        await seedUsers();
        await seedClasses();
        await seedCourses();
        await seedChallenges();
        console.log('Seeding completed successfully');
    } catch (error) {
        console.error(error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
