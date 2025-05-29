'use client';

import { Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface SidebarNavigationProps {
    readonly items: Array<{ label: string; value: string; icon: ReactNode }>;
}

export function SidebarNavigation({ items }: SidebarNavigationProps) {
    const pathname = usePathname();

    return (
        <Flex direction='column' gap={6} pt={10} pl={8}>
            {items.map((item) => (
                <Link key={item.value} href={item.value} passHref>
                    <Flex
                        align='center'
                        gap={4}
                        color={pathname === `${item.value}` ? 'green.400' : 'whiteAlpha.900'}
                        _hover={{
                            color: 'green.300'
                        }}
                    >
                        {item.icon}
                        <Text textTransform='uppercase' fontWeight='medium'>
                            {item.label}
                        </Text>
                    </Flex>
                </Link>
            ))}
        </Flex>
    );
}
