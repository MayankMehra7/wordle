'use client';

import { useState } from 'react';
import ModeSelector from '@/components/ModeSelector';
import GameContainerSolo from '@/components/GameContainerSolo';
import GameContainerMultiplayer from '@/components/GameContainerMultiplayer';

type AppMode = 'menu' | 'solo' | 'multiplayer';

interface MultiplayerData {
  roomCode: string;
  playerName: string;
  difficulty: 'easy' | 'medium' | 'hard';
  targetWord: string;
}

export default function Home() {
  const [mode, setMode] = useState<AppMode>('menu');
  const [multiplayerData, setMultiplayerData] = useState<MultiplayerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSelectMode = (selectedMode: 'solo' | 'multiplayer') => {
    if (selectedMode === 'solo') {
      setMode('solo');
    }
    // For multiplayer, wait for room creation/join
  };

  const handleCreateRoom = async (playerName: string, difficulty: string) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/room/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName, difficulty }),
      });

      if (!response.ok) {
        throw new Error('Failed to create room');
      }

      const data = await response.json();
      setMultiplayerData({
        roomCode: data.roomCode,
        playerName,
        difficulty: difficulty as 'easy' | 'medium' | 'hard',
        targetWord: data.targetWord,
      });
      setMode('multiplayer');
    } catch (err) {
      setError('Failed to create room. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (roomCode: string, playerName: string) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/room/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode, playerName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to join room');
      }

      const data = await response.json();
      setMultiplayerData({
        roomCode: data.roomCode,
        playerName,
        difficulty: data.difficulty,
        targetWord: data.targetWord,
      });
      setMode('multiplayer');
    } catch (err: any) {
      setError(err.message || 'Failed to join room. Please try again.');
      console.error(err);
      alert(err.message || 'Failed to join room');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToMenu = () => {
    setMode('menu');
    setMultiplayerData(null);
    setError('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-2xl text-white">Loading...</div>
      </div>
    );
  }

  if (mode === 'menu') {
    return (
      <ModeSelector
        onSelectMode={handleSelectMode}
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
      />
    );
  }

  if (mode === 'solo') {
    return <GameContainerSolo onBackToMenu={handleBackToMenu} />;
  }

  if (mode === 'multiplayer' && multiplayerData) {
    return (
      <GameContainerMultiplayer
        roomCode={multiplayerData.roomCode}
        playerName={multiplayerData.playerName}
        difficulty={multiplayerData.difficulty}
        initialWord={multiplayerData.targetWord}
        onBackToMenu={handleBackToMenu}
      />
    );
  }

  return null;
}
