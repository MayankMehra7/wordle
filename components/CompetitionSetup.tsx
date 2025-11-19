'use client';

import React, { useState } from 'react';

interface CompetitionSetupProps {
  onBack: () => void;
  onStart: (data: {
    mode: 'create' | 'join';
    playerName: string;
    code?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
  }) => void;
}

const CompetitionSetup: React.FC<CompetitionSetupProps> = ({ onBack, onStart }) => {
  const [setupMode, setSetupMode] = useState<'select' | 'create' | 'join'>('select');
  const [playerName, setPlayerName] = useState('');
  const [code, setCode] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [error, setError] = useState('');

  const handleCreate = () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }
    onStart({ mode: 'create', playerName: playerName.trim(), difficulty });
  };

  const handleJoin = () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!code.trim()) {
      setError('Please enter competition code');
      return;
    }
    onStart({ mode: 'join', playerName: playerName.trim(), code: code.trim().toUpperCase() });
  };

  if (setupMode === 'select') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 text-gray-400 hover:text-white"
        >
          ← Back
        </button>

        <h1 className="text-4xl font-bold text-white mb-4">Competition Mode</h1>
        <p className="text-gray-400 mb-12 text-center">Create or join a competition</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          {/* Create Competition */}
          <button
            onClick={() => setSetupMode('create')}
            className="bg-gradient-to-br from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white p-8 rounded-xl shadow-lg transform transition-all hover:scale-105"
          >
            <div className="text-6xl mb-4">➕</div>
            <h2 className="text-2xl font-bold mb-2">Create Competition</h2>
            <p className="text-green-100">
              Generate a code and invite friends
            </p>
          </button>

          {/* Join Competition */}
          <button
            onClick={() => setSetupMode('join')}
            className="bg-gradient-to-br from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white p-8 rounded-xl shadow-lg transform transition-all hover:scale-105"
          >
            <div className="text-6xl mb-4">🔗</div>
            <h2 className="text-2xl font-bold mb-2">Join Competition</h2>
            <p className="text-orange-100">
              Enter a code to join existing game
            </p>
          </button>
        </div>
      </div>
    );
  }

  if (setupMode === 'create') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
        <button
          onClick={() => setSetupMode('select')}
          className="absolute top-4 left-4 text-gray-400 hover:text-white"
        >
          ← Back
        </button>

        <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Create Competition</h2>

          {error && (
            <div className="bg-red-500 text-white p-3 rounded mb-4 text-center">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Your Name</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => {
                setPlayerName(e.target.value);
                setError('');
              }}
              placeholder="Enter your name"
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              maxLength={20}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Difficulty</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setDifficulty('easy')}
                className={`py-3 rounded-lg font-semibold transition-colors ${
                  difficulty === 'easy'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Easy
              </button>
              <button
                onClick={() => setDifficulty('medium')}
                className={`py-3 rounded-lg font-semibold transition-colors ${
                  difficulty === 'medium'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Medium
              </button>
              <button
                onClick={() => setDifficulty('hard')}
                className={`py-3 rounded-lg font-semibold transition-colors ${
                  difficulty === 'hard'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Hard
              </button>
            </div>
          </div>

          <button
            onClick={handleCreate}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Create Competition
          </button>
        </div>
      </div>
    );
  }

  // Join mode
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <button
        onClick={() => setSetupMode('select')}
        className="absolute top-4 left-4 text-gray-400 hover:text-white"
      >
        ← Back
      </button>

      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Join Competition</h2>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Your Name</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => {
              setPlayerName(e.target.value);
              setError('');
            }}
            placeholder="Enter your name"
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            maxLength={20}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Competition Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError('');
            }}
            placeholder="Enter 6-character code"
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 uppercase text-center text-2xl tracking-widest"
            maxLength={6}
          />
        </div>

        <button
          onClick={handleJoin}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors"
        >
          Join Competition
        </button>
      </div>
    </div>
  );
};

export default CompetitionSetup;
