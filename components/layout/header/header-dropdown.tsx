'use client';

import { Avatar, Box, Button, Flex, Text } from '@chakra-ui/react';
import { ChevronDown } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface HeaderDropdownProps {
    readonly username: string;
    readonly userId: string;
}

export function HeaderDropdown(props: HeaderDropdownProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    return (
        <Box position='relative' ref={dropdownRef}>
            <Flex
                px={2}
                py={2}
                bg='gray.700'
                borderRadius='xl'
                border='1px solid gray'
                align='center'
                gap={2.5}
                cursor='pointer'
                _hover={{ bg: 'gray.600' }}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
                <ChevronDown size={20} />
                <Text fontSize='xl' fontWeight='medium'>
                    {props.username}
                </Text>
                <Avatar.Root size='md' borderRadius='md'>
                    <Avatar.Fallback name={props.username} />
                    <Avatar.Image src='https://bit.ly/broken-link' />
                </Avatar.Root>
            </Flex>

            {isDropdownOpen && (
                <Box
                    position='absolute'
                    right={0}
                    mt={2}
                    w='160px'
                    bg='gray.800'
                    border='1px solid'
                    borderColor='gray.600'
                    borderRadius='md'
                    boxShadow='lg'
                    zIndex='dropdown'
                    overflow='hidden'
                >
                    <Button
                        w='full'
                        fontSize='lg'
                        color='white'
                        justifyContent='flex-start'
                        px={4}
                        py={2}
                        bg='transparent'
                        borderRadius={0}
                        _hover={{ bg: 'gray.700' }}
                        onClick={() => router.push(`/profile/${props.userId}`)}
                    >
                        Profile
                    </Button>
                    <Button
                        w='full'
                        fontSize='lg'
                        color='white'
                        justifyContent='flex-start'
                        px={4}
                        py={2}
                        bg='transparent'
                        borderRadius={0}
                        _hover={{ bg: 'gray.700' }}
                        onClick={() => signOut({ redirect: true, callbackUrl: '/login' })}
                    >
                        Sign out
                    </Button>
                </Box>
            )}
        </Box>
    );
}
