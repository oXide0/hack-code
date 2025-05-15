import { createSystem, defineConfig, defaultConfig } from '@chakra-ui/react';

const config = defineConfig({
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
