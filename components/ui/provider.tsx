'use client';

import { system } from '@/lib/theme';
import { ChakraProvider } from '@chakra-ui/react';
import { ColorModeProvider, type ColorModeProviderProps } from './color-mode';
import { Toaster } from './toaster';

export function Provider(props: ColorModeProviderProps) {
    return (
        <ChakraProvider value={system}>
            <Toaster />
            <ColorModeProvider defaultTheme='dark' {...props} />
        </ChakraProvider>
    );
}
