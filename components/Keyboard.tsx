'use client';

import React from 'react';

type KeyStatus = 'correct' | 'present' | 'absent' | 'unused';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  letterStates: { [key: string]: KeyStatus };
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, letterStates }) => {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']
  ];

  const getKeyClass = (key: string) => {
    const status = letterStates[key] || 'unused';
    const baseClass = 'px-3 py-4 rounded font-bold text-sm cursor-pointer transition-colors duration-200';
    
    const sizeClass = key === 'ENTER' || key === 'BACK' ? 'px-4' : 'px-3';

    switch (status) {
      case 'correct':
        return `${baseClass} ${sizeClass} bg-correct text-white`;
      case 'present':
        return `${baseClass} ${sizeClass} bg-present text-white`;
      case 'absent':
        return `${baseClass} ${sizeClass} bg-absent text-white`;
      default:
        return `${baseClass} ${sizeClass} bg-gray-500 text-white hover:bg-gray-400`;
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 mt-4 px-2">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              className={getKeyClass(key)}
            >
              {key === 'BACK' ? '⌫' : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
