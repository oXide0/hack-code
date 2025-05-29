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
                                                solution: `name = "Your Name"\nprint(name)`,
                                                testCases: {
                                                    inputs: [],
                                                    expectedOutputs: ['Your Name']
                                                }
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
                                                solution: `number = 10\nif number > 0:\n    print("Positive")\nelif number < 0:\n    print("Negative")\nelse:\n    print("Zero")`,
                                                testCases: {
                                                    inputs: [5, -3, 0],
                                                    expectedOutputs: ['Positive', 'Negative', 'Zero']
                                                }
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
                                                solution: `for i in range(2, 21, 2):\n    print(i)`,
                                                testCases: {
                                                    inputs: [],
                                                    expectedOutputs: ['2\n4\n6\n8\n10\n12\n14\n16\n18\n20']
                                                }
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
                                                solution: `def rectangle_area(length, width):\n    return length * width`,
                                                testCases: {
                                                    inputs: [
                                                        [4, 5],
                                                        [3, 7]
                                                    ],
                                                    expectedOutputs: ['20', '21']
                                                }
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
                                                solution: `def is_prime(n):\n    if n <= 1:\n        return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            return False\n    return True`,
                                                testCases: {
                                                    inputs: [2, 7, 10, 1],
                                                    expectedOutputs: ['True', 'True', 'False', 'False']
                                                }
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
                                                solution: `def sum_list(numbers):\n    total = 0\n    for num in numbers:\n        total += num\n    return total`,
                                                testCases: {
                                                    inputs: [
                                                        [1, 2, 3],
                                                        [10, 20, 30]
                                                    ],
                                                    expectedOutputs: ['6', '60']
                                                }
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
                                                solution: `def word_count(text):\n    words = text.split()\n    counts = {}\n    for word in words:\n        counts[word] = counts.get(word, 0) + 1\n    return counts`,
                                                testCases: {
                                                    inputs: ['hello world hello'],
                                                    expectedOutputs: [{ hello: 2, world: 1 }]
                                                }
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
                                                solution: `def count_lines(filename):\n    with open(filename) as file:\n        return len(file.readlines())`,
                                                testCases: {
                                                    inputs: ['sample.txt'],
                                                    expectedOutputs: ['5'] // Assuming sample.txt has 5 lines
                                                }
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
                                                solution: `def save_to_csv(filename, data):\n    import csv\n    with open(filename, 'w', newline='') as file:\n        writer = csv.writer(file)\n        writer.writerows(data)`,
                                                testCases: {
                                                    inputs: [
                                                        [
                                                            'users.csv',
                                                            [
                                                                ['Name', 'Age'],
                                                                ['Alice', 25],
                                                                ['Bob', 30]
                                                            ]
                                                        ]
                                                    ],
                                                    expectedOutputs: ['File created successfully']
                                                }
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
                                                solution: `class BankAccount:\n    def __init__(self, balance=0):\n        self.balance = balance\n    \n    def deposit(self, amount):\n        self.balance += amount\n    \n    def withdraw(self, amount):\n        if amount <= self.balance:\n            self.balance -= amount\n        else:\n            print("Insufficient funds")`,
                                                testCases: {
                                                    inputs: [],
                                                    expectedOutputs: ['Class implemented correctly']
                                                }
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
                                                solution: `class Vehicle:\n    def __init__(self, make, model):\n        self.make = make\n        self.model = model\n\nclass Car(Vehicle):\n    def __init__(self, make, model, num_doors):\n        super().__init__(make, model)\n        self.num_doors = num_doors`,
                                                testCases: {
                                                    inputs: [],
                                                    expectedOutputs: ['Classes implemented correctly']
                                                }
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
