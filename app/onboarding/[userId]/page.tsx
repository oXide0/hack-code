import { OnboardingForm } from '@/components/onboarding/onboarding-form';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/utils';
import { Flex, Box, Heading } from '@chakra-ui/react';
import { redirect } from 'next/navigation';
import Image from 'next/image';

export default async function Page({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;

    return (
        <Flex minH='100vh' align='center' justify='center'>
            <Box w='full' maxW='md' p={8} borderWidth={1} borderRadius='lg' bg='#232323' boxShadow='lg'>
                <Flex justify='center' mb={8}>
                    <Image src='/logo.svg' alt='Company Logo' width={254} height={31} objectFit='contain' />
                </Flex>

                <Heading as='h1' size='lg' mb={6} textAlign='center'>
                    Accept invitation
                </Heading>

                <OnboardingForm
                    onSubmit={async (data) => {
                        'use server';
                        await prisma.user.update({
                            where: { id: userId },
                            data: {
                                firstName: data.firstName,
                                lastName: data.lastName,
                                password: await hashPassword(data.password),
                                status: 'active'
                            }
                        });
                        redirect('/login');
                    }}
                />
            </Box>
        </Flex>
    );
}
