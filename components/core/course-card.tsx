import { Box, Heading, Text, VStack } from '@chakra-ui/react';

interface CourseCardProps {
    readonly title: string;
    readonly description: string | null;
}

export function CourseCard({ title, description }: CourseCardProps) {
    return (
        <Box
            p={6}
            bg='gray.800'
            borderRadius='2xl'
            border='1px solid'
            borderColor='green.400'
            boxShadow='lg'
            transition='all 0.3s ease'
            _hover={{
                transform: 'translateY(-4px)',
                boxShadow: 'xl',
                borderColor: 'green.300',
                bg: 'gray.700'
            }}
            role='group'
        >
            <VStack gap={3} align='start'>
                <Heading as='h3' size='md' color='green.300' _groupHover={{ color: 'green.200' }}>
                    {title}
                </Heading>

                {description && (
                    <Text color='gray.300' fontSize='sm'>
                        {description}
                    </Text>
                )}
            </VStack>
        </Box>
    );
}
