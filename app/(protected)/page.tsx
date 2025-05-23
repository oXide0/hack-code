import { CourseCard } from '@/components/core/course-card';
import { prisma } from '@/lib/prisma';
import { Box, Container, Grid, Heading, Text, VStack } from '@chakra-ui/react';
import Link from 'next/link';

export default async function Page() {
    const courses = await prisma.course.findMany({ select: { id: true, title: true, description: true } });

    return (
        <Box minH='100vh' p={5}>
            <Container maxW='6xl'>
                <VStack as='header' textAlign='center' mb={10} gap={2}>
                    <Heading as='h1' size='2xl' color='white' fontWeight='bold'>
                        Hey coders!
                    </Heading>
                    <Text fontSize='lg' color='gray.300'>
                        Explore the courses and gain the highest level!
                    </Text>
                </VStack>

                <Grid
                    templateColumns={{
                        base: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)'
                    }}
                    gap={6}
                >
                    {courses.map((course) => (
                        <Link key={course.id} href={`courses/${course.id}`}>
                            <CourseCard title={course.title} description={course.description} />
                        </Link>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
