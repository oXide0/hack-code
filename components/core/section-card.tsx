import { Badge, Card, Flex, Text } from '@chakra-ui/react';
import { LockKeyhole } from 'lucide-react';

interface SectionCardProps {
    readonly title: string;
    readonly isLocked: boolean;
    readonly totalTopics: number;
    readonly completedTopics: number;
}

export function SectionCard(props: SectionCardProps) {
    return (
        <Card.Root
            bg='gray.800'
            borderRadius='xl'
            minH='160px'
            minW='270px'
            maxW='270px'
            position='relative'
            borderWidth='2px'
            px={3}
            py={4}
            display='flex'
            flexDirection='column'
            h='full'
            borderColor={props.isLocked ? 'gray.700' : 'green.300'}
            transition='all 0.3s ease'
            _hover={
                props.isLocked
                    ? {}
                    : {
                          transform: 'translateY(-4px)',
                          boxShadow: 'xl',
                          borderColor: 'green.300',
                          bg: 'gray.700'
                      }
            }
        >
            <Badge
                colorPalette='green'
                position='absolute'
                top='-3'
                right='4'
                px={2}
                py={1}
                border='1px solid'
                borderColor='green.300'
            >
                Learn next
            </Badge>

            <Flex justify='space-between' gap={4} flex='1 1 auto' pt={1}>
                <Text fontWeight='semibold'>{props.title}</Text>
                {props.isLocked && <LockKeyhole color='#2ECC71' />}
            </Flex>

            <Flex justify='space-between'>
                <Text color='gray.300'>
                    {props.totalTopics} {props.totalTopics === 1 ? 'topic' : 'topics'}
                </Text>
                <Text>
                    {props.completedTopics}/{props.totalTopics} topics
                </Text>
            </Flex>
        </Card.Root>
    );
}
