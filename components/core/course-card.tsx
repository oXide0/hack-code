import { Avatar, Card } from '@chakra-ui/react';

interface CourseCardProps {
    readonly title: string;
    readonly description: string | null;
}

export function CourseCard({ title, description }: CourseCardProps) {
    return (
        <Card.Root
            variant='outline'
            borderColor='green.300'
            bg='gray.800'
            borderRadius='xl'
            borderWidth='2px'
            boxShadow='lg'
            transition='all 0.3s ease'
            _hover={{
                transform: 'translateY(-4px)',
                boxShadow: 'xl',
                borderColor: 'green.300',
                bg: 'gray.700'
            }}
        >
            <Card.Body gap={3} alignItems='start'>
                <Avatar.Root size='sm' bg='green.300' color='white'>
                    <Avatar.Fallback name={title[0]} />
                </Avatar.Root>

                <Card.Title>{title}</Card.Title>
                {description && <Card.Description>{description}</Card.Description>}
            </Card.Body>
        </Card.Root>
    );
}
