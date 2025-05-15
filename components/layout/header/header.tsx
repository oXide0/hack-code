import { Box, Flex, Text } from '@chakra-ui/react';
import { HeaderHeading } from './heading';

interface HeaderProps {
    readonly user: {
        fullName: string;
        level: string;
        avatarUrl: string;
    };
}

export function Header({ user }: HeaderProps) {
    return (
        <Box
            position='fixed'
            zIndex='sticky'
            w='calc(100vw - 300px)'
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            pl={6}
            pr={2}
            py={2}
            bg='gray.800'
            borderWidth='2px'
            borderColor='gray.700'
            borderRadius='xl'
        >
            <HeaderHeading />

            <Flex gap={4} align='center'>
                <Flex
                    p={2}
                    bg='gray.700'
                    borderRadius='lg'
                    outline='1px solid'
                    outlineColor='gray.500'
                    outlineOffset='-1px'
                    justify='center'
                    align='center'
                    gap={2}
                    fontSize='xl'
                    fontWeight='medium'
                >
                    <Text>💠</Text>
                    <Text>LVL - {user.level}</Text>
                </Flex>
            </Flex>
        </Box>
    );
}
