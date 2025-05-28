import { Flex, Text } from '@chakra-ui/react';
import { HeaderDropdown } from './header-dropdown';
import { HeaderHeading } from './header-heading';

interface HeaderProps {
    readonly username: string;
    readonly userId: string;
    readonly level: number | undefined;
}

export async function Header(props: HeaderProps) {
    return (
        <Flex
            justify='space-between'
            align='center'
            position='fixed'
            zIndex='sticky'
            w='calc(100vw - 300px)'
            bg='gray.800'
            borderWidth='2px'
            borderColor='gray.700'
            borderRadius='xl'
            px={4}
            py={2}
        >
            <HeaderHeading />

            <Flex gap={4} align='center'>
                {props.level != null && (
                    <Flex
                        px={2}
                        py={3}
                        bg='gray.700'
                        borderRadius='lg'
                        border='1px solid gray'
                        justify='center'
                        align='center'
                        gap={2}
                        fontSize='xl'
                        fontWeight='medium'
                    >
                        <Text>💠</Text>
                        <Text>LVL - {props.level}</Text>
                    </Flex>
                )}

                <HeaderDropdown userId={props.userId} username={props.username} />
            </Flex>
        </Flex>
    );
}
