'use client';

import { Heading } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';

export function HeaderHeading() {
    const pathname = usePathname();

    function getHeadingText(pathname: string) {
        if (pathname === '/profile') return 'Profile';
        if (pathname === '/challenges') return 'Challenges';
    }

    return (
        <Heading as='h1' textTransform='uppercase' fontSize='32px' fontWeight='semibold' color='whiteAlpha.900'>
            {getHeadingText(pathname)}
        </Heading>
    );
}
