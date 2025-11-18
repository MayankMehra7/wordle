'use client';

import React from 'react';

type LetterStatus = 'correct' | 'present' | 'absent' | 'empty';

interface GameBoardProps {
  guesses: string[];
  currentGuess: string;
  gameStatus: 'playing' | 'won' | 'lost';
  feedback: LetterStatus[][];
}

const GameBoard: React.FC<GameBoardProps> = ({ guesses, currentGuess, gameStatus, feedback }) => {
  const rows = 6;
  const cols = 5;

  const getTileClass = (status: LetterStatus) => {
    const baseClass = 'w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold uppercase transition-all duration-300';
    
    switch (status) {
      case 'correct':
        return `${baseClass} bg-correct border-correct text-white`;
      case 'present':
        return `${baseClass} bg-present border-present text-white`;
      case 'absent':
        return `${baseClass} bg-absent border-absent text-white`;
      default:
        return `${baseClass} bg-transparent border-gray-600 text-white`;
    }
  };

  const renderRow = (rowIndex: number) => {
    let letters: string[] = [];
    let statuses: LetterStatus[] = [];

    if (rowIndex < guesses.length) {
      // Completed guess
      letters = guesses[rowIndex].split('');
      statuses = feedback[rowIndex] || [];
    } else if (rowIndex === guesses.length && gameStatus === 'playing') {
      // Current guess being typed
      letters = currentGuess.split('');
      statuses = new Array(letters.length).fill('empty');
    }

    // Fill remaining tiles
    while (letters.length < cols) {
      letters.push('');
      statuses.push('empty');
    }

    return (
      <div key={rowIndex} className="flex gap-1 justify-center mb-1">
        {letters.map((letter, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={getTileClass(statuses[colIndex])}
          >
            {letter}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center py-4">
      {Array.from({ length: rows }, (_, i) => renderRow(i))}
    </div>
  );
};

export default GameBoard;
