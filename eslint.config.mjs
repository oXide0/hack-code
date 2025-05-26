import { FlatCompat } from '@eslint/eslintrc';
import prettierPlugin from 'eslint-plugin-prettier';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname
});

const eslintConfig = [
    ...compat.extends('next/core-web-vitals', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'),
    {
        plugins: {
            prettier: prettierPlugin
        },
        rules: {
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-explicit-any': 'warn',
            'react-hooks/exhaustive-deps': 'warn',
            'prettier/prettier': 'warn'
        },
        settings: {
            next: {
                rootDir: './'
            }
        }
    }
];

export default eslintConfig;
