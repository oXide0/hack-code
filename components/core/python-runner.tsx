'use client';

import { usePythonRunner } from '@/hooks/usePyodide';
import { Box, Button, Flex, Spinner, Text } from '@chakra-ui/react';
import { python } from '@codemirror/lang-python';
import { tags as t } from '@lezer/highlight';
import { createTheme } from '@uiw/codemirror-themes';
import CodeMirror from '@uiw/react-codemirror';
import { CheckCircle2, CircleAlert, FileCode, Play } from 'lucide-react';
import { useState } from 'react';

interface PythonEditorProps {
    readonly fileName: string;
    readonly initialContent?: string;
    readonly minHeight?: string;
    readonly onCodeChange?: (code: string) => void;
}

export function PythonEditor(props: PythonEditorProps) {
    const [code, setCode] = useState(props.initialContent ?? '');
    const [output, setOutput] = useState<{ type: 'success' | 'error'; content: string }[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const { pyodide, isLoading } = usePythonRunner();

    const runPythonCode = async () => {
        if (!pyodide) return;

        setIsRunning(true);
        setOutput([]);

        try {
            const consoleOutput: string[] = [];
            pyodide.setStdout({
                batched: (text: string) => {
                    consoleOutput.push(text);
                    setOutput((prev) => [...prev, { type: 'success', content: text }]);
                }
            });

            pyodide.setStderr({
                batched: (text: string) => {
                    setOutput((prev) => [...prev, { type: 'error', content: text }]);
                }
            });

            await pyodide.runPython(code);

            if (consoleOutput.length === 0) {
                setOutput((prev) => [...prev, { type: 'success', content: 'Code executed successfully (no output)' }]);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setOutput((prev) => [...prev, { type: 'error', content: error.message }]);
        } finally {
            setIsRunning(false);
        }
    };

    const clearOutput = () => {
        setOutput([]);
    };

    return (
        <Box width='100%' borderRadius='md' overflow='hidden' boxShadow='md'>
            <Flex bg='gray.700' px={3} py={2} alignItems='center' justifyContent='space-between' borderTopRadius='md'>
                <Flex alignItems='center' gap={2}>
                    <FileCode size={18} color='#EDF2F7' />
                    <Text fontSize='sm' fontWeight='semibold' color='gray.300'>
                        {props.fileName}
                    </Text>
                </Flex>
                <Flex gap={2}>
                    <Button
                        size='sm'
                        colorScheme='gray'
                        variant='outline'
                        onClick={clearOutput}
                        disabled={output.length === 0 || isRunning}
                    >
                        Clear Output
                    </Button>
                    <Button
                        size='sm'
                        colorScheme='green'
                        onClick={runPythonCode}
                        disabled={isLoading || isRunning || !code.trim()}
                    >
                        {isRunning ? <Spinner size='sm' /> : <Play size={16} />}
                        {isRunning ? 'Running...' : 'Run Code'}
                    </Button>
                </Flex>
            </Flex>

            <Box bg='gray.800' borderWidth='1px' borderColor='gray.700' borderTopWidth={0}>
                <CodeMirror
                    value={code}
                    minHeight={props.minHeight || '200px'}
                    extensions={[python()]}
                    onChange={setCode}
                    theme={editorTheme}
                    style={{
                        fontSize: '14px',
                        fontFamily: 'var(--font-mono), monospace'
                    }}
                />
            </Box>

            {output.length > 0 && (
                <Box bg='gray.900' borderWidth='1px' borderColor='gray.700' borderTopWidth={0}>
                    <Flex px={3} py={2} bg='gray.800' alignItems='center'>
                        <Text fontSize='sm' fontWeight='semibold' color='gray.300'>
                            Output
                        </Text>
                    </Flex>
                    <Box p={3} fontFamily='var(--font-mono), monospace' whiteSpace='pre-wrap'>
                        {output.map((item, index) => (
                            <Flex key={index} alignItems='center' gap={2} mb={2}>
                                {item.type === 'success' ? (
                                    <CheckCircle2 size={16} color='#68D391' />
                                ) : (
                                    <CircleAlert size={16} color='#FC8181' />
                                )}
                                <Text fontSize='sm' color={item.type === 'success' ? 'green.300' : 'red.300'}>
                                    {item.content}
                                </Text>
                            </Flex>
                        ))}
                    </Box>
                </Box>
            )}
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
