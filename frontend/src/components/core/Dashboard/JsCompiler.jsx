import { useState } from 'react';
import Editor from '@monaco-editor/react';

const JsCompiler = () => {
  const [code, setCode] = useState(`// Write your JavaScript code here
console.log('Hello, World!');`);
  const [output, setOutput] = useState('');

  const runCode = () => {
    try {
      // Capture console.log
      let logs = [];
      const originalLog = console.log;
      console.log = (...args) => {
        logs.push(args.join(' '));
      };

      // Run the code
      eval(code);

      // Restore console.log
      console.log = originalLog;

      setOutput(logs.join('\n'));
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold text-white mb-4">JavaScript Compiler</h1>
      <div className="flex flex-col lg:flex-row gap-4 h-full">
        <div className="flex-1">
          <Editor
            height="400px"
            language="javascript"
            value={code}
            onChange={(value) => setCode(value)}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
            }}
          />
          <button
            onClick={runCode}
            className="mt-4 bg-yellow-50 text-black px-4 py-2 rounded hover:bg-yellow-100"
          >
            Run Code
          </button>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-white mb-2">Output</h2>
          <pre className="bg-richblack-800 text-white p-4 rounded h-400px overflow-auto">
            {output || 'Output will appear here...'}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default JsCompiler;