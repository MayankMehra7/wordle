'use client';

import React, { useState } from 'react';

interface ModeSelectorProps {
  onSelectMode: (mode: 'solo' | 'multiplayer') => void;
  onCreateRoom: (playerName: string, difficulty: string) => void;
  onJoinRoom: (roomCode: string, playerName: string) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({
  onSelectMode,
  onCreateRoom,
  onJoinRoom
}) => {
  const [mode, setMode] = useState<'select' | 'create' | 'join'>('select');
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [error, setError] = useState('');

  const handleSoloMode = () => {
    onSelectMode('solo');
  };

  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }
    setError('');
    onCreateRoom(playerName.trim(), difficulty);
  };

  const handleJoinRoom = () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!roomCode.trim()) {
      setError('Please enter room code');
      return;
    }
    setError('');
    onJoinRoom(roomCode.trim().toUpperCase(), playerName.trim());
  };

  if (mode === 'select') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8">
          <h1 className="text-4xl font-bold text-center mb-2 text-white">Wordle</h1>
          <p className="text-center text-gray-400 mb-8">Choose your game mode</p>
          
          <div className="space-y-4">
            <button
              onClick={handleSoloMode}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg"
            >
              🎮 Play Solo
            </button>
            
            <button
              onClick={() => setMode('create')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg"
            >
              🏆 Create Competition
            </button>
            
            <button
              onClick={() => setMode('join')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg"
            >
              🤝 Join Competition
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'create') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-6 text-white">Create Competition</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2 font-semibold">Your Name</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={20}
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2 font-semibold">Difficulty</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setDifficulty('easy')}
                  className={`py-2 rounded-lg font-semibold transition-colors ${
                    difficulty === 'easy'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Easy
                </button>
                <button
                  onClick={() => setDifficulty('medium')}
                  className={`py-2 rounded-lg font-semibold transition-colors ${
                    difficulty === 'medium'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Medium
                </button>
                <button
                  onClick={() => setDifficulty('hard')}
                  className={`py-2 rounded-lg font-semibold transition-colors ${
                    difficulty === 'hard'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Hard
                </button>
              </div>
            </div>
            
            {error && (
              <div className="text-red-400 text-center">{error}</div>
            )}
            
            <button
              onClick={handleCreateRoom}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Create Room & Get Code
            </button>
            
            <button
              onClick={() => setMode('select')}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'join') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-6 text-white">Join Competition</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2 font-semibold">Your Name</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                maxLength={20}
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2 font-semibold">Room Code</label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-character code"
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 uppercase text-center text-2xl tracking-widest"
                maxLength={6}
              />
            </div>
            
            {error && (
              <div className="text-red-400 text-center">{error}</div>
            )}
            
            <button
              onClick={handleJoinRoom}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Join Room
            </button>
            
            <button
              onClick={() => setMode('select')}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ModeSelector;
