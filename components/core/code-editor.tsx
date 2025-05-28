'use client';

import { python } from '@codemirror/lang-python';
import { tags as t } from '@lezer/highlight';
import { createTheme } from '@uiw/codemirror-themes';
import CodeMirror from '@uiw/react-codemirror';
import { useState } from 'react';
import { FileCode } from 'lucide-react';
import { Box, Flex, Text } from '@chakra-ui/react';

interface CodeEditorProps {
    readonly fileName: string;
    readonly initialContent?: string | null;
    readonly isReadOnly?: boolean;
    readonly minHeight?: string;
}

export function CodeEditor(props: CodeEditorProps) {
    const [value, setValue] = useState(props.initialContent ?? '');

    return (
        <Box width='100%' borderRadius='md' overflow='hidden' boxShadow='md'>
            <Flex bg='gray.700' px={3} py={2} alignItems='center' gap={2} maxWidth='fit-content' borderTopRadius='md'>
                <FileCode size={18} color='#EDF2F7' />
                <Text fontSize='sm' fontWeight='semibold' color='gray.300'>
                    {props.fileName}
                </Text>
            </Flex>
            <Box bg='gray.800' borderWidth='1px' borderColor='gray.700' borderTopWidth={0}>
                <CodeMirror
                    readOnly={props.isReadOnly}
                    value={value}
                    minHeight={props.minHeight}
                    extensions={[python()]}
                    onChange={setValue}
                    theme={editorTheme}
                    editable={!props.isReadOnly}
                    style={{
                        fontSize: '14px',
                        fontFamily: 'var(--font-mono), monospace'
                    }}
                />
            </Box>
        </Box>
    );
}

const editorTheme = createTheme({
    theme: 'dark',
    settings: {
        background: '#1e1e1e',
        foreground: '#d4d4d4',
        caret: '#569cd6',
        selection: '#264f78',
        selectionMatch: '#264f78',
        lineHighlight: '#ffffff0f',
        gutterBackground: '#1e1e1e',
        gutterForeground: '#858585'
    },
    styles: [
        { tag: t.comment, color: '#6A9955' },
        { tag: t.variableName, color: '#9CDCFE' },
        { tag: [t.string, t.special(t.brace)], color: '#CE9178' },
        { tag: t.number, color: '#B5CEA8' },
        { tag: t.bool, color: '#569CD6' },
        { tag: t.null, color: '#569CD6' },
        { tag: t.keyword, color: '#569CD6' },
        { tag: t.operator, color: '#D4D4D4' },
        { tag: t.className, color: '#4EC9B0' },
        { tag: t.definition(t.typeName), color: '#4EC9B0' },
        { tag: t.typeName, color: '#4EC9B0' },
        { tag: t.angleBracket, color: '#808080' },
        { tag: t.tagName, color: '#569CD6' },
        { tag: t.attributeName, color: '#9CDCFE' }
    ]
});
