'use client';

import { Heading } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';

export function HeaderHeading() {
    const pathname = usePathname();

    function getHeadingText(pathname: string) {
        if (pathname === '') return 'Languages';
        if (pathname.includes('/courses')) return 'Learn';
        if (pathname.includes('/challenges')) return 'Challenges';
        return pathname.split('/').pop()?.replace(/-/g, ' ');
    }

    return (
        <Heading as='h1' textTransform='uppercase' fontSize='32px' fontWeight='semibold' color='whiteAlpha.900'>
            {getHeadingText(pathname)}
        </Heading>
    );
}
