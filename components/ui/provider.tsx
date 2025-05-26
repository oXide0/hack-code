'use client';

import { system } from '@/lib/theme';
import { ChakraProvider } from '@chakra-ui/react';
import type { ThemeProviderProps } from 'next-themes';
import { ColorModeProvider } from './color-mode';
import { Toaster } from './toaster';

export function Provider(props: ThemeProviderProps) {
    return (
        <ChakraProvider value={system}>
            <Toaster />
            <ColorModeProvider defaultTheme='dark' {...props} />
        </ChakraProvider>
    );
}
