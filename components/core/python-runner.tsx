'use client';

import { useEffect } from 'react';
import { usePythonRunner } from '@/hooks/usePyodide';

export function PythonRunner() {
    const { pyodide } = usePythonRunner();

    const runPythonCode = async () => {
        // if (pyodide) {
        //     try {
        //         let result = await pyodide.runPython('print("Hello from Python")');
        //         console.log(result);
        //     } catch (error) {
        //         console.error('Error running Python code:', error);
        //     }
        // }
    };
    useEffect(() => {
        if (pyodide) {
            runPythonCode();
        }
    }, [pyodide]);

    return <div></div>;
}
