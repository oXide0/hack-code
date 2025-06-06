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
                                                content: `
In programming, each piece of data has its own unique type, which determines what kind of values it can hold and what operations can be performed on it. Understanding data types is fundamental to writing robust programs.

### Primitive Data Types

- **Number:** Represents both integer and floating point numbers (e.g., 42, 3.14).
- **String:** Represents sequences of characters (e.g., "Hello, World!").
- **Boolean:** Represents logical values: true or false.
- **Null & Undefined:** Null represents an intentional absence of value, while undefined means a variable has been declared but not assigned a value.

### Complex Data Types

- **Object:** Used to store collections of data and more complex entities.
- **Array:** A special type of object for storing ordered collections.

Data types help programming languages prevent errors and allow the interpreter or compiler to optimize code execution.
    `.trim(),
                                                codeSample: `// Example: Defining variables with different data types in JavaScript
const age = 30; // Number
const name = "Seymour Skinner"; // String
const isAdmin = true; // Boolean
const student = { id: 1, name: "Bart" }; // Object
const grades = [90, 85, 100]; // Array`
                                            },
                                            {
                                                type: 'THEORY',
                                                order: 2,
                                                content: `
= Hello, AsciiDoc!

AsciiDoc is a lightweight markup language commonly used for documentation, similar to Markdown but with more powerful features.

== Key Features

- **Section Titles:** Use one or more equals signs for headings.
- **Lists:** Supports both ordered and unordered lists.
- **Formatting:** Bold, italics, code blocks, and tables.
- **Links and Images:** Rich support for hyperlinks and embedding images.

== Example

\`\`\`asciidoc
= Sample Document
John Doe <john.doe@example.com>

== Introduction

AsciiDoc is easy to write and read!
\`\`\`

AsciiDoc is widely used for writing technical documentation, books, and even slide decks. Its plain text format makes it easy to version control and collaborate on.
    `.trim(),
                                                codeSample: `// Example: Importing modules in JavaScript
import mongoose, { Schema } from 'mongoose'

// Define a schema for a MongoDB collection
const userSchema = new Schema({
  name: String,
  email: String
});
`
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
                                                content: `
If statements allow your program to make decisions by executing certain blocks of code only if a specific condition is true. They are fundamental to controlling the flow of your program.

### How If Statements Work

The basic syntax in Python is:

\`\`\`python
if condition:
    # code to execute if the condition is True
\`\`\`

You can also use \`elif\` (else if) and \`else\` to check multiple conditions:

\`\`\`python
if condition1:
    # code if condition1 is True
elif condition2:
    # code if condition2 is True and condition1 is False
else:
    # code if neither condition1 nor condition2 is True
\`\`\`

### Example

Suppose you want to print a message if someone is an adult:

- If the person's age is 18 or older, print "You're an adult".
- Otherwise, print "You're not an adult yet".

This demonstrates how conditional logic works in practice.
    `.trim(),
                                                codeSample: `age = 18
if age >= 18:
    print("You're an adult")
else:
    print("You're not an adult yet")`
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
                                                content: `
Loops allow you to repeat actions in your code automatically, which helps you efficiently handle repetitive tasks without writing the same code multiple times.

### Types of Loops in Python

- **For loops:** Used to iterate over a sequence (like a list, tuple, string, or range).
- **While loops:** Repeats as long as a certain condition is true.

#### For Loops

A for loop lets you execute a block of code a specific number of times or for each item in a sequence.

\`\`\`python
for item in [1, 2, 3]:
    print(item)
\`\`\`

You can also use the \`range()\` function to loop a set number of times.

#### While Loops

A while loop keeps running as long as a condition remains true:

\`\`\`python
count = 0
while count < 5:
    print(count)
    count += 1
\`\`\`

Loops are fundamental for processing collections, automating repetitive tasks, and handling data in programs.
    `.trim(),
                                                codeSample: `# For loop example
for i in range(5):
    print(i)

# While loop example
count = 0
while count < 5:
    print(count)
    count += 1`
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
                                                content: `
Functions are reusable blocks of code that perform specific tasks. By defining a function, you can organize your code, avoid repetition, and make it more readable and maintainable.

### Why Use Functions?
- **Reusability:** Write code once and use it many times.
- **Organization:** Break complex tasks into smaller, manageable pieces.
- **Abstraction:** Hide details and expose only what is necessary.
- **Testing:** Make it easier to test individual pieces of code.

### Defining a Function

In Python, you define a function using the \`def\` keyword, followed by the function name and parentheses (which can include parameters):

\`\`\`python
def function_name(parameters):
    # code block
    return value
\`\`\`

### Example

Below is a simple function that greets a person by name. It takes one parameter and returns a greeting message:

    `.trim(),
                                                codeSample: `def greet(name):
    return f"Hello, {name}!"

# Usage example
message = greet("Lisa")
print(message)  # Output: Hello, Lisa!`
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
                                                content: `
Lists are ordered collections of items that allow you to store multiple values in a single variable. In Python, lists are one of the most versatile and commonly used data structures.

### Key Features of Lists

- **Ordered:** The order of elements is preserved. The first item has index 0, the second index 1, and so on.
- **Mutable:** Lists can be changed after creation — you can add, remove, or modify items.
- **Heterogeneous:** Lists can contain elements of different types (e.g., strings, numbers, even other lists).

### Creating and Accessing Lists

You create a list by placing items inside square brackets, separated by commas. Individual elements are accessed using their index.

\`\`\`python
fruits = ['apple', 'banana', 'cherry']
print(fruits[1])  # Outputs 'banana'
\`\`\`

### Common List Operations

- **Append an item:** \`fruits.append('orange')\`
- **Remove an item:** \`fruits.remove('banana')\`
- **Get the length:** \`len(fruits)\`
- **Slice a list:** \`fruits[0:2]\`

Lists are essential for storing and manipulating sequences of data in your programs.
    `.trim(),
                                                codeSample: `fruits = ['apple', 'banana', 'cherry']
print(fruits[1])  # Outputs 'banana'

# Add a new fruit
fruits.append('orange')
print(fruits)  # Outputs ['apple', 'banana', 'cherry', 'orange']`
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
                                                content: `
Dictionaries are collections in Python that store data in key-value pairs. Each key in a dictionary is unique and is used to access its corresponding value. Dictionaries are especially useful for representing structured data, such as information about a person or an object.

### Key Features of Dictionaries

- **Unordered:** The order of items is not guaranteed (prior to Python 3.7).
- **Key-Value Pairs:** Data is stored as pairs, where each key maps to a value.
- **Mutable:** You can add, update, or remove key-value pairs after creation.
- **Efficient Lookup:** Accessing a value by its key is fast.

### Creating and Accessing Dictionaries

You create a dictionary using curly braces , with each key and value separated by a colon:

\`\`\`python
person = {
    "name": "Alice",
    "age": 25
}
\`\`\`

You can access values using their keys:

\`\`\`python
print(person["name"])  # Outputs: Alice
\`\`\`

### Common Dictionary Operations

- **Add or Update:** \`person["city"] = "New York"\`
- **Remove:** \`del person["age"]\`
- **Check Key:** \`"name" in person\`
- **Get All Keys/Values:** \`person.keys()\`, \`person.values()\`

Dictionaries are widely used for data that is best represented as pairs, making them a fundamental part of Python programming.
    `.trim(),
                                                codeSample: `person = {
    "name": "Alice",
    "age": 25
}

# Access a value by its key
print(person["name"])  # Outputs: Alice

# Add a new key-value pair
person["city"] = "New York"
print(person)  # Outputs: {'name': 'Alice', 'age': 25, 'city': 'New York'}`
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
                                                content: `
Files allow you to store data permanently on your computer, making it possible to save information for later use, share it between different programs, or process large datasets. In Python, you can work with files using built-in functions.

### Why Work With Files?

- **Persistence:** Data is saved even after your program stops running.
- **Data Exchange:** Share information with other applications.
- **Large Data Handling:** Store and process data that doesn't fit in memory.

### Common File Operations

- **Reading:** Retrieve data from a file.
- **Writing:** Save new data to a file.
- **Appending:** Add data to the end of an existing file.

### Reading a File Example

You can use the \`with\` statement to open a file, which ensures the file is properly closed after its suite finishes:

\`\`\`python
with open('data.txt') as file:
    content = file.read()
    print(content)
\`\`\`

This reads the entire contents of \`data.txt\` into the variable \`content\`.

### Writing to a File Example

\`\`\`python
with open('output.txt', 'w') as file:
    file.write("Hello, world!")
\`\`\`

Files are essential for tasks like saving user input, logging, and data analysis.
    `.trim(),
                                                codeSample: `# Reading a file
with open('data.txt') as file:
    content = file.read()
    print(content)

# Writing to a file
with open('output.txt', 'w') as file:
    file.write("Hello, world!")`
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
                                                content: `
Writing to files allows your program to save data permanently, so that information is not lost when the program ends. This is useful for creating logs, saving user preferences, or exporting results for later analysis.

### Why Write to Files?

- **Persistence:** Data remains available even after the program exits.
- **Data Sharing:** Stored files can be opened and read by other applications.
- **Record Keeping:** Useful for logs, reports, and configuration data.

### How to Write to a File in Python

You can write to a file using the \`open()\` function with the mode set to \`'w'\` (write). The \`with\` statement ensures the file is properly closed after writing.

\`\`\`python
with open('output.txt', 'w') as file:
    file.write('Hello World!')
\`\`\`

This code creates (or overwrites) a file named \`output.txt\` and writes the text "Hello World!" inside it.

### Appending to a File

To add content to the end of an existing file without deleting previous data, use the mode \`'a'\` (append):

\`\`\`python
with open('output.txt', 'a') as file:
    file.write('\\nAnother line')
\`\`\`

Writing to files is an essential part of building useful, real-world applications that need to remember information across sessions.
    `.trim(),
                                                codeSample: `# Writing to a file
with open('output.txt', 'w') as file:
    file.write('Hello World!')

# Appending to a file
with open('output.txt', 'a') as file:
    file.write('\\nAnother line')`
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
                                                content: `
Classes are blueprints for creating objects in object-oriented programming. They allow you to bundle data and behaviors together, making your code more organized, reusable, and easier to maintain.

### What is a Class?

A class defines the structure and behavior (methods) that its objects (instances) will have. You can think of a class as a template, and each object created from that class is an instance of the template.

### Defining a Class in Python

In Python, you define a class using the \`class\` keyword. You can add an initializer method (\`__init__\`) to set up instance variables, and define other methods to describe behaviors.

\`\`\`python
class Dog:
    def __init__(self, name):
        self.name = name  # Instance variable

    def bark(self):
        return "Woof!"
\`\`\`

### Using the Class

\`\`\`python
my_dog = Dog("Buddy")
print(my_dog.name)  # Outputs: Buddy
print(my_dog.bark())  # Outputs: Woof!
\`\`\`

### Why Use Classes?

- **Encapsulation:** Bundle data and methods together.
- **Reusability:** Create multiple objects from the same blueprint.
- **Inheritance:** Build new classes based on existing ones (not shown here).

Classes are fundamental for organizing code in large or complex programs.
    `.trim(),
                                                codeSample: `class Dog:
    def __init__(self, name):
        self.name = name

    def bark(self):
        return "Woof!"

# Creating an instance of Dog
my_dog = Dog("Buddy")
print(my_dog.name)    # Outputs: Buddy
print(my_dog.bark())  # Outputs: Woof!`
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
                                                content: `
Inheritance allows you to create specialized classes that share behavior and attributes from a more general class. This is a core concept of object-oriented programming and enables code reusability and organization.

### What is Inheritance?

A **parent class** (or base class) defines common functionality. **Child classes** (or subclasses) can inherit this functionality and override or extend it as needed.

- **Parent/Base Class:** The general class that defines shared attributes and methods.
- **Child/Subclass:** The specialized class that inherits from the parent and can add or modify behaviors.

### Example

Here, \`Animal\` is the parent class with a generic \`speak\` method. \`Cat\` is a child class that inherits from \`Animal\` and provides its own version of \`speak\`:

\`\`\`python
class Animal:
    def speak(self):
        pass

class Cat(Animal):
    def speak(self):
        return "Meow!"
\`\`\`

### Why Use Inheritance?

- **Code Reuse:** Write shared logic once in the base class.
- **Extendability:** Easily create new classes that build on existing functionality.
- **Organization:** Structure related classes logically.

Inheritance is powerful for building complex systems where many classes share common traits but also need their own unique behavior.
    `.trim(),
                                                codeSample: `class Animal:
    def speak(self):
        pass

class Cat(Animal):
    def speak(self):
        return "Meow!"

# Usage example
cat = Cat()
print(cat.speak())  # Outputs: Meow!`
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
