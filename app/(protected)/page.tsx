import { LanguageCard } from '@/components/core/language-card';
import { Box, Container, Grid, Heading, Text, VStack } from '@chakra-ui/react';

export type ProgrammingLanguage = {
    name: string;
    description: string;
    icon: string;
    slug: string;
    enabled: boolean;
};

const programmingLanguages: ProgrammingLanguage[] = [
    { name: 'JavaScript', description: 'Web Development', icon: '🟨', slug: 'javascript', enabled: false },
    { name: 'Python', description: 'AI & Data Science', icon: '🐍', slug: 'python', enabled: true },
    { name: 'Java', description: 'Enterprise Applications', icon: '☕', slug: 'java', enabled: false },
    { name: 'C#', description: 'Game Development', icon: '🎮', slug: 'csharp', enabled: false },
    { name: 'Ruby', description: 'Web Applications', icon: '💎', slug: 'ruby', enabled: false },
    { name: 'PHP', description: 'Web Backend', icon: '🐘', slug: 'php', enabled: false },
    { name: 'Swift', description: 'iOS Development', icon: '🍎', slug: 'swift', enabled: false },
    { name: 'C++', description: 'High-Performance Apps', icon: '🔧', slug: 'cpp', enabled: false },
    { name: 'Rust', description: 'Systems Programming', icon: '🦀', slug: 'rust', enabled: false }
];

export default function Page() {
    return (
        <Box minH='100vh' p={5}>
            <Container maxW='6xl'>
                <VStack as='header' textAlign='center' mb={10} gap={2}>
                    <Heading as='h1' size='2xl' color='white' fontWeight='bold'>
                        Hey coders!
                    </Heading>
                    <Text fontSize='lg' color='gray.300'>
                        Explore the languages and gain the highest level!
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
                    {programmingLanguages.map((language) => (
                        <LanguageCard key={language.slug} language={language} />
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
