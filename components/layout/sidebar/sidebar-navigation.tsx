'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

interface SidebarNavigationProps {
    readonly items: Array<{ label: string; value: string; icon: ReactNode }>;
}

export function SidebarNavigation({ items }: SidebarNavigationProps) {
    const pathname = usePathname();

    return (
        <Flex direction='column' gap={6} pt={10} pl={8} flex='1'>
            {items.map((item) => (
                <Link key={item.value} href={item.value} passHref>
                    <Flex
                        align='center'
                        gap={4}
                        color={pathname === `/${item.value}` ? 'green.400' : 'whiteAlpha.900'}
                        _hover={{
                            textDecoration: 'none',
                            color: 'green.300'
                        }}
                    >
                        <Box>{item.icon}</Box>
                        <Text textTransform='uppercase' fontWeight='medium'>
                            {item.label}
                        </Text>
                    </Flex>
                </Link>
            ))}
        </Flex>
    );
}
