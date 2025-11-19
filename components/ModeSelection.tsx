'use client';

import React, { useState } from 'react';

interface ModeSelectionProps {
  onSelectMode: (mode: 'solo' | 'competition') => void;
}

const ModeSelection: React.FC<ModeSelectionProps> = ({ onSelectMode }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <h1 className="text-5xl font-bold text-white mb-4">Wordle</h1>
      <p className="text-gray-400 mb-12 text-center">Choose your game mode</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        {/* Solo Mode */}
        <button
          onClick={() => onSelectMode('solo')}
          className="bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white p-8 rounded-xl shadow-lg transform transition-all hover:scale-105"
        >
          <div className="text-6xl mb-4">🎮</div>
          <h2 className="text-2xl font-bold mb-2">Solo Play</h2>
          <p className="text-blue-100">
            Play alone and guess the daily word
          </p>
        </button>

        {/* Competition Mode */}
        <button
          onClick={() => onSelectMode('competition')}
          className="bg-gradient-to-br from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white p-8 rounded-xl shadow-lg transform transition-all hover:scale-105"
        >
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold mb-2">Competition</h2>
          <p className="text-purple-100">
            Compete with friends and see who's on top
          </p>
        </button>
      </div>
    </div>
  );
};

export default ModeSelection;
