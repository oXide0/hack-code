import { compare } from 'bcryptjs';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { prisma } from './prisma';
import { loginSchema } from './validation';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text', required: true },
                password: { label: 'Password', type: 'password', required: true }
            },
            async authorize(credentials) {
                try {
                    const validatedCredentials = loginSchema.parse(credentials);
                    const { email, password } = validatedCredentials;

                    const user = await prisma.user.findUnique({
                        where: { email }
                    });

                    if (user == null) {
                        throw new Error('User not found');
                    }

                    const isPasswordValid = await compare(password, user.password);

                    if (!isPasswordValid) {
                        throw new Error('Invalid password');
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        role: user.role
                    };
                } catch (error) {
                    if (error instanceof z.ZodError) {
                        throw new Error(fromZodError(error).toString());
                    }
                    throw error;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.exp = Math.floor(Date.now() / 1000) + 30 * 60;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.expires = new Date(Date.now() + 30 * 60 * 1000).toISOString();
            }
            return session;
        }
    },
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60 // 1 day
    },
    jwt: {
        maxAge: 24 * 60 * 60 // 1 day
    },
    pages: {
        signIn: '/login',
        error: '/login'
    }
};
