import { Badge, Card, Flex, Heading, Text } from '@chakra-ui/react';
import Link from 'next/link';

interface ChallengeCardProps {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly difficulty: number;
    readonly createdAt: Date;
    readonly schoolName?: string;
}

export function ChallengeCard(props: ChallengeCardProps) {
    return (
        <Card.Root bg='gray.800' borderWidth='1px' borderColor='gray.700' borderRadius='xl' p={4}>
            <Card.Header>
                <Flex justify='space-between' align='center'>
                    <Link href={`/challenges/${props.id}`} passHref>
                        <Heading size='md' color='white' _hover={{ color: 'green.400', textDecoration: 'underline' }}>
                            {props.title}
                        </Heading>
                    </Link>
                    <Badge colorPalette={difficultyColor(props.difficulty)} fontSize='0.9em' borderRadius='md' px={2}>
                        Difficulty: {props.difficulty}
                    </Badge>
                </Flex>
                {props.schoolName && (
                    <Text fontSize='sm' color='gray.400' mt={1}>
                        {props.schoolName}
                    </Text>
                )}
            </Card.Header>
            <Card.Body>
                <Text color='gray.200'>{props.description}</Text>
            </Card.Body>
            <Card.Footer>
                <Text fontSize='xs' color='gray.500'>
                    Created: {props.createdAt.toLocaleDateString()}
                </Text>
            </Card.Footer>
        </Card.Root>
    );
}

function difficultyColor(level: number): string {
    switch (level) {
        case 1:
            return 'green';
        case 2:
            return 'yellow';
        case 3:
            return 'orange';
        case 4:
            return 'red';
        default:
            return 'gray';
    }
}
