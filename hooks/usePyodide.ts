import { useState, useEffect } from 'react';
import { useScript } from 'usehooks-ts';
const PYODIDE_VERSION = '0.25.0';

interface Pyodide {
    readonly setStdout: (options: { batched: (text: string) => void }) => void;
    readonly setStderr: (options: { batched: (text: string) => void }) => void;
    readonly runPython: (code: string) => Promise<void>;
}

export function usePythonRunner() {
    const [pyodide, setPyodide] = useState<Pyodide | null>(null);
    const pyodideScriptStatus = useScript(`https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/pyodide.js`);

    useEffect(() => {
        if (pyodideScriptStatus === 'ready' && !pyodide) {
            (async () => {
                const loadedPyodide = await globalThis.loadPyodide({
                    indexURL: `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`
                });
                setPyodide(loadedPyodide);
            })();
        }
    }, [pyodideScriptStatus, pyodide]);

    return { pyodide, isLoading: pyodideScriptStatus === 'loading' || !pyodide };
}
