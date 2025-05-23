import { Avatar, Card, Heading, Text } from '@chakra-ui/react';

interface CourseCardProps {
    readonly title: string;
    readonly description: string | null;
}

export function CourseCard({ title, description }: CourseCardProps) {
    return (
        <Card.Root
            variant='outline'
            width='100%'
            borderColor='green.400'
            bg='gray.800'
            borderRadius='2xl'
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
            <Card.Body gap={3} alignItems='start'>
                <Avatar.Root size='sm' bg='green.400' color='white'>
                    <Avatar.Fallback name={title[0]} />
                </Avatar.Root>

                <Heading as={Card.Title} size='md' color='green.300' _groupHover={{ color: 'green.200' }}>
                    {title}
                </Heading>

                {description && (
                    <Text as={Card.Description} color='gray.300' fontSize='sm'>
                        {description}
                    </Text>
                )}
            </Card.Body>
        </Card.Root>
    );
}
