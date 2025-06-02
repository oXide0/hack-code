import { createSystem, defineConfig, defaultConfig } from '@chakra-ui/react';

const config = defineConfig({
    globalCss: {
        '*': {
            boxSizing: 'border-box',
            borderColor: 'gray.600'
        },
        body: {
            bg: '#1C1C1C',
            fontFamily: 'var(--font-poppins), sans-serif'
        }
    },
    theme: {
        tokens: {
            colors: {
                green: {
                    300: { value: '#2ECC71' }
                }
            },
            fonts: {
                heading: { value: 'var(--font-poppins), sans-serif' },
                body: { value: 'var(--font-poppins), sans-serif' }
            }
        },
        semanticTokens: {
            fonts: {
                heading: { value: 'var(--font-poppins), sans-serif' },
                body: { value: 'var(--font-poppins), sans-serif' }
            }
        }
    }
});

export const system = createSystem(defaultConfig, config);
