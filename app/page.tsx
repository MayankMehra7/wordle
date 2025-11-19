'use client';

import { useState } from 'react';
import GameContainer from '@/components/GameContainer';
import ModeSelector from '@/components/ModeSelector';

interface CompetitionData {
  roomCode: string;
  playerName: string;
  difficulty: 'easy' | 'medium' | 'hard';
  targetWord: string;
}

export default function Home() {
  const [gameMode, setGameMode] = useState<'menu' | 'solo' | 'multiplayer'>('menu');
  const [competitionData, setCompetitionData] = useState<CompetitionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSelectMode = (mode: 'solo' | 'multiplayer') => {
    if (mode === 'solo') {
      setGameMode('solo');
      setCompetitionData(null);
    }
  };

  const handleCreateRoom = async (playerName: string, difficulty: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/room/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerName, difficulty }),
      });

      if (!response.ok) {
        throw new Error('Failed to create room');
      }

      const data = await response.json();
      
      setCompetitionData({
        roomCode: data.roomCode,
        playerName,
        difficulty: difficulty as 'easy' | 'medium' | 'hard',
        targetWord: data.targetWord,
      });
      setGameMode('multiplayer');
    } catch (err) {
      setError('Failed to create room. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async (roomCode: string, playerName: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/room/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomCode, playerName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to join room');
      }

      const data = await response.json();
      
      setCompetitionData({
        roomCode: data.roomCode,
        playerName,
        difficulty: data.difficulty,
        targetWord: data.targetWord,
      });
      setGameMode('multiplayer');
    } catch (err: any) {
      setError(err.message || 'Failed to join room. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToMenu = () => {
    setGameMode('menu');
    setCompetitionData(null);
    setError('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-2xl text-white">Loading...</div>
      </div>
    );
  }

  if (gameMode === 'menu') {
    return (
      <>
        <ModeSelector
          onSelectMode={handleSelectMode}
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
        />
        {error && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
            {error}
          </div>
        )}
      </>
    );
  }

  return (
    <GameContainer
      competitionMode={gameMode === 'multiplayer'}
      competitionData={competitionData}
      onBackToMenu={handleBackToMenu}
    />
  );
}
