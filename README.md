# HackCode

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Seed Data

This project includes a seed script to initialize the database with sample data for demonstration and testing purposes. The `seedUsers` function programmatically creates the following entities:

1. **School Admin**  
   - **Email:** `principal.skinner@springfield.edu` 
   - **Password:** `SecurePassword123!`
   - **Name:** Seymour Skinner
   - **Role:** SCHOOL_ADMIN

2. **Teacher**  
   - **Email:** `edna.krabappel@springfield.edu`
   - **Password:** `TeacherPass123!`
   - **Name:** Edna Krabappel
   - **Role:** TEACHER  

3. **Student**  
   - **Email:** `bart.simpson@springfield.edu`
   - **Password:** `StudentPass123!`
   - **Name:** Bart Simpson
   - **Role:** STUDENT

