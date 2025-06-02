import {
    Box,
    Button,
    Center,
    Container,
    Flex,
    Heading,
    Image,
    SimpleGrid,
    Stack,
    Text,
    VStack
} from '@chakra-ui/react';
import { BookOpen, Code, GraduationCap, MoveRight, Rocket, Users } from 'lucide-react';
import Link from 'next/link';

export default function Page() {
    return (
        <Box minH='100vh' bg='gray.900' color='gray.100' pt={{ base: 12, md: 24 }} pb={16}>
            <Container maxW='5xl'>
                <Flex direction={{ base: 'column', md: 'row' }} align='center' justify='space-between' gap={12}>
                    <VStack align='flex-start' gap={8} flex={1}>
                        <Heading
                            as='h1'
                            size='2xl'
                            bgGradient='linear(to-r, #43e97b, #38f9d7)'
                            bgClip='text'
                            fontWeight='extrabold'
                            lineHeight='1.1'
                            mb={2}
                        >
                            HackCode
                        </Heading>
                        <Text fontSize='2xl' fontWeight='medium' color='gray.300'>
                            Learn to code by doing.
                        </Text>
                        <Text fontSize='lg' color='gray.400' maxW='lg'>
                            Master coding through hands-on projects, real-world challenges, and interactive lessons.
                            HackCode is built for learners and educators alike.
                        </Text>
                        <Stack direction={{ base: 'column', sm: 'row' }} gap={5} pt={2}>
                            <Link href='/login' passHref>
                                <Button size='lg' colorScheme='green' fontWeight='bold' px={8}>
                                    Start Learning
                                    <MoveRight />
                                </Button>
                            </Link>
                        </Stack>
                    </VStack>
                    <Box flex={1} minW={0} display={{ base: 'none', md: 'block' }}>
                        <Image
                            src='/og-image.png'
                            alt='HackCode – Learn to Code by Doing'
                            borderRadius='2xl'
                            boxShadow='2xl'
                            w='100%'
                            h='auto'
                            maxH='340px'
                            objectFit='cover'
                        />
                    </Box>
                </Flex>

                <Stack gap={16} mt={24}>
                    <SimpleGrid columns={{ base: 1, md: 3 }} gap={10}>
                        <VStack align='center' gap={5}>
                            <Code size={40} color='#38f9d7' />
                            <Text fontSize='xl' fontWeight='bold' textAlign='center'>
                                Real-World Coding Challenges
                            </Text>
                            <Text color='gray.400' textAlign='center'>
                                Learn programming by solving practical challenges that mimic real software development
                                scenarios.
                            </Text>
                        </VStack>
                        <VStack align='center' gap={5}>
                            <BookOpen size={40} color='#43e97b' />
                            <Text fontSize='xl' fontWeight='bold' textAlign='center'>
                                Interactive Lessons & Guided Paths
                            </Text>
                            <Text color='gray.400' textAlign='center'>
                                Progress through curated, interactive lessons and guided learning paths designed by
                                experienced educators.
                            </Text>
                        </VStack>
                        <VStack align='center' gap={5}>
                            <Users size={40} color='#38f9d7' />
                            <Text fontSize='xl' fontWeight='bold' textAlign='center'>
                                Built for Schools & Teams
                            </Text>
                            <Text color='gray.400' textAlign='center'>
                                Manage classes, collaborate with peers, and empower teachers with powerful admin tools.
                            </Text>
                        </VStack>
                    </SimpleGrid>

                    {/* Highlight for educators and schools */}
                    <Flex
                        direction={{ base: 'column', md: 'row' }}
                        justify='center'
                        align='center'
                        bg='gray.800'
                        p={10}
                        borderRadius='2xl'
                        boxShadow='lg'
                        gap={10}
                    >
                        <GraduationCap size={60} color='#43e97b' />
                        <VStack align='flex-start' gap={3} maxW='2xl'>
                            <Heading as='h2' size='lg' color='green.300'>
                                For Educators & Schools
                            </Heading>
                            <Text fontSize='lg' color='gray.200'>
                                HackCode makes it easy for teachers and school admins to create classes, assign
                                challenges, and track student progress — all in a modern, collaborative environment.
                            </Text>
                        </VStack>
                    </Flex>

                    {/* Call to action */}
                    <Center>
                        <Stack direction={{ base: 'column', sm: 'row' }} gap={5}>
                            <Link href='/login' passHref>
                                <Button colorScheme='green' size='lg' px={8} fontWeight='bold'>
                                    Get Started for Free
                                    <Rocket />
                                </Button>
                            </Link>

                            <Link href='https://www.linkedin.com/company/argonteam' passHref target='_blank'>
                                <Button rel='noopener' variant='ghost' colorPalette='cyan' size='lg'>
                                    Learn more about Argon
                                </Button>
                            </Link>
                        </Stack>
                    </Center>
                </Stack>
            </Container>
        </Box>
    );
}
