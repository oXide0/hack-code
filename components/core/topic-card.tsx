import { Box, Flex, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface TopicCardProps {
    readonly isActive?: boolean;
    readonly number: string;
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
            borderWidth='1px'
            borderRadius='full'
            px={6}
            py={5}
            cursor='pointer'
            _hover={{
                borderColor: '#10B981',
                textDecoration: 'none'
            }}
            borderColor={props.isActive ? '#10B981' : 'gray.700'}
        >
            <Flex alignItems='center' gap={4}>
                <Text color='#999' fontWeight='medium'>
                    {props.number}
                </Text>
                <Text fontSize='xl' fontWeight='medium'>
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
