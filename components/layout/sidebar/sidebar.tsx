import { Center, Flex, Separator } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';
import { SidebarNavigation } from './sidebar-navigation';

interface SidebarProps {
    readonly items: Array<{ label: string; value: string; icon: ReactNode }>;
}

export function Sidebar({ items }: SidebarProps) {
    return (
        <Flex
            direction='column'
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
        >
            <Link href='/courses'>
                <Center>
                    <Image src='/logo.svg' height={30} width={184} alt='logo' priority />
                </Center>
            </Link>

            <Separator borderColor='gray.700' size='md' mt={4.5} />

            <SidebarNavigation items={items} />
        </Flex>
    );
}
