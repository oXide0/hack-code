import { createSystem, defineConfig, defaultConfig } from '@chakra-ui/react';

const config = defineConfig({
    globalCss: {
        body: {
            bg: '#1C1C1C'
        }
    },
    theme: {
        tokens: {
            colors: {
                green: {
                    300: { value: '#2ECC71' }
                }
            }
        }
    }
});

export const system = createSystem(defaultConfig, config);
