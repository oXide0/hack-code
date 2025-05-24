import { Box, Flex, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface TopicCardProps {
    readonly isActive?: boolean;
    readonly isCompleted?: boolean;
    readonly label: string;
    readonly title: string;
    readonly badge: ReactNode;
    readonly rightElement: ReactNode;
}

export function TopicCard(props: TopicCardProps) {
    return (
        <Box
            display='flex'
            justifyContent='space-between'
            bg='#232323'
            borderWidth='2px'
            borderRadius='full'
            px={6}
            py={5}
            cursor='pointer'
            borderColor={props.isActive ? 'green.300' : 'gray.700'}
            bgColor={props.isCompleted ? 'green.700' : '#232323'}
        >
            <Flex alignItems='center' justify='space-between'>
                <Text color='gray.300'>{props.label}</Text>
                <Text fontSize='xl' color='white' fontWeight='medium' pl={4}>
                    {props.title}
                </Text>
            </Flex>
            <Flex alignItems='center' gap={4}>
                {props.badge}
                {props.rightElement}
            </Flex>
        </Box>
    );
}
