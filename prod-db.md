# Production Database Seeding Guide for Next.js App

This guide provides step-by-step instructions for manually seeding your production database with the necessary initial data for your Next.js application. Make sure to follow the prescribed model relationships and data requirements.

---

## Table of Contents

1. [User](#user)
2. [School](#school)
3. [Teacher](#teacher)
4. [Student](#student)
5. [Class](#class)
6. [Section & Topic](#section--topic)
7. [Exercise](#exercise)
8. [Challenge](#challenge)
9. [Solution](#solution)
10. [General Notes](#general-notes)

---

## User

**Steps:**

1. **Generate a UUID:**  
   - Go to [uuidgenerator.net](https://www.uuidgenerator.net).
   - Copy a generated UUID for use as the `id`.

2. **Hash the Password:**  
   - Go to [bcrypt-generator.com](https://bcrypt-generator.com).
   - Use 12 rounds for hashing.
   - Hash the password (e.g., `artemis`) and copy the result.

3. **Create the User Record:**  
   - Example:
     ```json
     {
       "id": "<UUID>",
       "email": "michaela.vavrova@hackcode.net",
       "password": "<BCRYPT_HASHED_PASSWORD>",
       "updatedAt": "<current_timestamp>"
     }
     ```

---

## School

**Steps:**

1. **Generate a UUID** for the school as `id`.
2. **Set `adminId`:** Use the `id` of the user who is the school admin.
   - Note: Each school can have only one admin.

3. **Create the School Record:**  
   - Example:
     ```json
     {
       "id": "<UUID>",
       "name": "Springfield Elementary",
       "adminId": "<USER_ID>",
       "updatedAt": "<current_timestamp>"
     }
     ```

---

## Teacher

- Teachers extend from the User model.

**Steps:**

1. **Create a User** (see [User](#user)).
2. **Generate a UUID** for the teacher as `id`.
3. **Set `userId`:** Use the user’s `id` (from previous step).
4. **Set `schoolId`:** Use the `id` of the school to which this teacher belongs.

5. **Create the Teacher Record:**
   ```json
   {
     "id": "<UUID>",
     "userId": "<USER_ID>",
     "schoolId": "<SCHOOL_ID>",
     "updatedAt": "<current_timestamp>"
   }
   ```

---

## Student

- Students extend from the User model.

**Steps:**

1. **Create a User** (see [User](#user)).
2. **Generate a UUID** for the student as `id`.
3. **Set `userId`:** Use the user’s `id`.
4. **Set `schoolId`:** Use the `id` of the school to which this student belongs.
5. **Set `studentId`:** School-specific student ID.
6. **Set `level`:** Default is `1`.

7. **Create the Student Record:**
   ```json
   {
     "id": "<UUID>",
     "userId": "<USER_ID>",
     "schoolId": "<SCHOOL_ID>",
     "studentId": "<SCHOOL_SPECIFIC_ID>",
     "level": 1,
     "updatedAt": "<current_timestamp>"
   }
   ```

---

## Class

**Steps:**

1. **Generate a UUID** for the class as `id`.
2. **Set `schoolId`:** Use the school’s `id`.

3. **Create the Class Record:**
   ```json
   {
     "id": "<UUID>",
     "schoolId": "<SCHOOL_ID>",
     "updatedAt": "<current_timestamp>"
   }
   ```

---

## Section & Topic

- Both models follow the same pattern as above.

**Steps:**

1. **Generate a UUID** for each as `id`.
2. **Set the relevant foreign keys (`schoolId`, `classId`, or as per your schema).**
3. **Set `updatedAt`:** Use the current timestamp.

---

## Exercise

There are three types of exercises, each with different requirements:

### Common Fields

- `id`: Generate a UUID.
- `content`: Main content of the exercise.
- `order`: Integer order within the topic.
- `topicId`: ID of the topic this exercise belongs to.
- `updatedAt`: Current timestamp.

### By Type

#### 1. THEORY

- **Fields:**  
  - `content` (required)
  - `codeSample` (optional)
  - `order`
  - `topicId`

#### 2. VALIDATION

- **Fields:**  
  - `content` (required)
  - `codeSample` (required)
  - `order`
  - `topicId`
  - `options`:  
    ```json
    {
      "choices": ["Option 1", "Option 2", "..."],
      "correctIndex": 1
    }
    ```

#### 3. PRACTICE

- **Fields:**  
  - `content` (required)
  - `starterCode` (required)
  - `order`
  - `topicId`

---

## Challenge

Represents a challenge assigned to students or classes.

**Fields:**
- `id`: UUID (use uuidgenerator.net)
- `title`: Challenge title
- `description`: Challenge description
- `difficulty`: Integer (difficulty level)
- `deadline`: DateTime (ISO 8601 format)
- `exampleContent`: (optional) Example content
- `createdAt`: Current timestamp
- `updatedAt`: Current timestamp
- `createdBy`: User ID of the creator
- `schoolId`: ID of the associated school
- `assignedClasses`: List of Class IDs
- `assignedStudents`: List of Student IDs

**Example:**
```json
{
  "id": "<UUID>",
  "title": "Build a Calculator",
  "description": "Create a simple calculator app.",
  "difficulty": 2,
  "deadline": "2025-06-30T23:59:59Z",
  "exampleContent": "See provided starter files.",
  "createdAt": "<current_timestamp>",
  "updatedAt": "<current_timestamp>",
  "createdBy": "<USER_ID>",
  "schoolId": "<SCHOOL_ID>",
  "assignedClasses": ["<CLASS_ID_1>", "<CLASS_ID_2>"],
  "assignedStudents": ["<STUDENT_ID_1>", "<STUDENT_ID_2>"]
}
```

---

## Solution

Represents a student's submission for a challenge.

**Fields:**
- `id`: UUID (use uuidgenerator.net)
- `code`: Solution code
- `createdAt`: Current timestamp
- `updatedAt`: Current timestamp
- `challengeId`: ID of the associated challenge
- `studentId`: ID of the student submitting

**Example:**
```json
{
  "id": "<UUID>",
  "code": "// Solution code here",
  "createdAt": "<current_timestamp>",
  "updatedAt": "<current_timestamp>",
  "challengeId": "<CHALLENGE_ID>",
  "studentId": "<STUDENT_ID>"
}
```

---

## General Notes

- **Timestamps:**  
  - For all models, set `updatedAt` to the current timestamp when inserting.
  - For models with `createdAt`, set it to the current timestamp as well.

- **UUIDs:**  
  - Always generate UUIDs using [uuidgenerator.net](https://www.uuidgenerator.net).

- **Password Hashing:**  
  - Always use 12 rounds of hashing at [bcrypt-generator.com](https://bcrypt-generator.com).

- **Model Relationships:**  
  - Respect all foreign key relationships (e.g., `userId`, `schoolId`, etc.).
  - Always create User records before related Teacher/Student records.

- **Single Admin per School:**  
  - Each school can have only one admin.

- **Exercise Types:**  
  - Ensure you set the correct fields based on the exercise type.

---

**Happy Seeding!**