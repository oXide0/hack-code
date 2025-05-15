import { Box, Flex } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';
import { SidebarNavigation } from './sidebar-navigation';

interface SidebarProps {
    readonly items: Array<{ label: string; value: string; icon: ReactNode }>;
}

export function Sidebar({ items }: SidebarProps) {
    return (
        <Box
            bg='gray.800'
            borderWidth='2px'
            borderColor='gray.700'
            borderRadius='xl'
            py={6}
            px={3}
            w='264px'
            h='calc(100vh - 24px)'
            position='fixed'
            zIndex='sticky'
            display='flex'
            flexDirection='column'
        >
            <Flex justify='center' borderBottom='2px solid' borderColor='gray.700' pb={4}>
                <Link href='/' passHref>
                    <Image src='/logo.svg' height={30} width={184} alt='logo' priority />
                </Link>
            </Flex>

            <SidebarNavigation items={items} />
        </Box>
    );
}
