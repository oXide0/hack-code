import { getTimeLeft } from '@/lib/utils';
import { Badge, Button, Card, Flex, Heading, Text } from '@chakra-ui/react';
import { useMemo } from 'react';
import { ConditionalLink } from '../core/conditional-link';
import { Check, CheckCircle2, Edit } from 'lucide-react';
import Link from 'next/link';

interface ChallengeCardProps {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly difficulty: number;
    readonly deadline: Date;
    readonly createdAt: string;
    readonly isStudent: boolean;
    readonly isOwner: boolean;
    readonly isDone: boolean;
    readonly schoolName?: string;
}

export function ChallengeCard(props: ChallengeCardProps) {
    const timeLeft = useMemo(() => getTimeLeft(props.deadline), [props.deadline]);

    return (
        <Card.Root bg='gray.800' borderWidth='1px' borderColor='gray.700' borderRadius='xl' p={4}>
            <Card.Header>
                <Flex justify='space-between' align='center'>
                    <ConditionalLink href={`/challenges/${props.id}`} passHref disabled={!props.isStudent}>
                        <Heading
                            size='md'
                            color={props.isDone ? 'green.300' : 'white'}
                            display='flex'
                            alignItems='center'
                            gap={2}
                            _hover={props.isStudent ? { color: 'green.400', textDecoration: 'underline' } : {}}
                        >
                            {props.title}
                            {props.isDone && props.isStudent && <Check />}
                        </Heading>
                    </ConditionalLink>
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
                <Flex w='full' justify='space-between'>
                    <Flex direction='column' align='flex-start'>
                        <Text fontSize='xs' color='gray.500'>
                            Created: {props.createdAt}
                        </Text>
                        <Text fontSize='xs' color='green.400'>
                            {timeLeft}
                        </Text>
                    </Flex>
                    <Flex gap={2}>
                        {props.isOwner && (
                            <Link href={`challenges/edit/${props.id}`} passHref>
                                <Button size='xs'>
                                    <Edit /> Edit
                                </Button>
                            </Link>
                        )}
                        <Link href={`challenges/${props.id}/solutions`} passHref>
                            <Button colorPalette='green' size='xs'>
                                <CheckCircle2 /> See {props.isStudent ? 'my' : ''} solutions
                            </Button>
                        </Link>
                    </Flex>
                </Flex>
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
