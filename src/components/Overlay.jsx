import React, { useState, useEffect, useRef } from 'react';

const WEBSITE_DETAILS = {
  name: "yess25-website",
  author: 'danielpaul-sandraalex ',
};

const PROMPT = '$';

const SECRET_MESSAGES = [
  'tho joker was here ;)��🃏🎭✨',
  'the cake is a lie 🎂🚫',
  '42 is the answer to everything 🧮',
  'hello from the other side 🎶',
  'you found the easter egg! 🥚🐇',
  'keep calm and code on 💻',
  'may the source be with you 🌌',
  'sudo make me a sandwich 🥪',
  'to the moon! 🚀',
  '404: joke not found 😂',
];

const Overlay = ({ visible }) => {
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState([]); // {cmd, output}
  const terminalRef = useRef(null);

  useEffect(() => {
    if (!visible) {
      setInputValue('');
      setHistory([]);
    }
  }, [visible]);

  useEffect(() => {
    // Scroll to bottom on new output
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  if (!visible) return null;

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      const cmd = inputValue.trim();
      let output = '';
      if (cmd.toLowerCase() === 'help') {
        output = 'Available commands:\n' +
          'help      - Show this help message\n' +
          'yess      - Reveal a secret message\n' +
          'whoami    - Show website and owner info';
      } else if (cmd.toLowerCase() === 'yess') {
        const randomIdx = Math.floor(Math.random() * SECRET_MESSAGES.length);
        output = SECRET_MESSAGES[randomIdx];
      } else if (cmd.toLowerCase() === 'whoami') {
        output = `${WEBSITE_DETAILS.name}\nowner: ${WEBSITE_DETAILS.author}`;
      } else if (cmd) {
        output = `command not found: ${cmd}`;
      }
      // If help was typed, don't overwrite output with command not found
      if (cmd.toLowerCase() === 'help') {
        setHistory(prev => [...prev, { cmd, output }]);
        setInputValue('');
        return;
      }
      setHistory(prev => [...prev, { cmd, output }]);
      setInputValue('');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85">
      <div className="bg-zinc-900 rounded-xl shadow-2xl border border-zinc-700 w-full max-w-2xl min-h-[340px] max-h-[80vh] flex flex-col p-0 mx-2 sm:mx-4 md:mx-0 md:p-0" style={{width: '100%', maxWidth: '32rem'}}>
        <div
          ref={terminalRef}
          className="flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-6 font-mono text-sm sm:text-base text-zinc-100 custom-scrollbar"
          style={{background: '#18181b'}}
        >
          {/* <div className="text-[#fe4a56] text-sm mb-4 select-none">YESS'25 Terminal - type <span className="font-bold">whoami</span> or <span className="font-bold">yess</span></div> */}
          {history.map((entry, idx) => (
            <div key={idx} className="mb-2">
              <div><span className="text-green-400">{PROMPT}</span> <span>{entry.cmd}</span></div>
              {entry.output && (
                <pre className="whitespace-pre-wrap text-yellow-200 ml-6">{entry.output}</pre>
              )}
            </div>
          ))}
        </div>
        <div className="border-t border-zinc-800 px-3 py-3 sm:px-6 sm:py-4 bg-zinc-950 rounded-b-xl flex items-center">
          <span className="text-green-400 font-mono mr-2">{PROMPT}</span>
          <input
            type="text"
            placeholder='Type "help"'
            className="flex-1 bg-transparent text-zinc-100 border-none outline-none font-mono text-sm sm:text-base"
            autoFocus
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
          />
        </div>
      </div>
    </div>
  );
};

export default Overlay; 