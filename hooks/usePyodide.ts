import { useState, useEffect } from 'react';
import { useScript } from 'usehooks-ts';
const PYODIDE_VERSION = '0.25.0';

export function usePythonRunner() {
    const [pyodide, setPyodide] = useState(null);
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

    return { pyodide };
}
