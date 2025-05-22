'use client';

import { Avatar, Box, Button, Flex, Text } from '@chakra-ui/react';
import { ChevronDown } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useRef, useState } from 'react';

export function HeaderDropdown({ username }: { readonly username: string }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    return (
        <Box position='relative' ref={dropdownRef}>
            <Flex
                h='56px'
                px={2}
                bg='gray.700'
                borderRadius='xl'
                outline='1px solid'
                outlineColor='gray.500'
                outlineOffset='-1px'
                justify='start'
                align='center'
                gap={2.5}
                cursor='pointer'
                _hover={{ bg: 'gray.600' }}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
                <ChevronDown size={20} />
                <Text fontSize='xl' fontWeight='medium'>
                    {username}
                </Text>
                <Avatar.Root size='md' borderRadius='md'>
                    <Avatar.Fallback name={username} />
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
