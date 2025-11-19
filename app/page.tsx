'use client';

import { useState } from 'react';
import GameContainer from '@/components/GameContainer';
import ModeSelection from '@/components/ModeSelection';
import CompetitionSetup from '@/components/CompetitionSetup';

type AppMode = 'select' | 'solo' | 'competition-setup' | 'competition-play';

interface CompetitionData {
  code: string;
  playerName: string;
  difficulty: 'easy' | 'medium' | 'hard';
  targetWord: string;
}

export default function Home() {
  const [mode, setMode] = useState<AppMode>('select');
  const [competitionData, setCompetitionData] = useState<CompetitionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleModeSelect = (selectedMode: 'solo' | 'competition') => {
    if (selectedMode === 'solo') {
      setMode('solo');
    } else {
      setMode('competition-setup');
    }
  };

  const handleCompetitionStart = async (data: {
    mode: 'create' | 'join';
    playerName: string;
    code?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
  }) => {
    setLoading(true);
    setError('');

    try {
      if (data.mode === 'create') {
        const response = await fetch('/api/competition/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            playerName: data.playerName,
            difficulty: data.difficulty,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create competition');
        }

        const result = await response.json();
        
        // Fetch the competition to get target word
        const statusResponse = await fetch(`/api/competition/status?code=${result.code}`);
        const statusData = await statusResponse.json();

        setCompetitionData({
          code: result.code,
          playerName: data.playerName,
          difficulty: result.difficulty,
          targetWord: statusData.targetWord,
        });
        setMode('competition-play');
      } else {
        const response = await fetch('/api/competition/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: data.code,
            playerName: data.playerName,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to join competition');
        }

        const result = await response.json();
        setCompetitionData({
          code: result.code,
          playerName: data.playerName,
          difficulty: result.difficulty,
          targetWord: result.targetWord,
        });
        setMode('competition-play');
      }
    } catch (err: any) {
      setError(err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </main>
    );
  }

  if (mode === 'select') {
    return (
      <main className="min-h-screen bg-gray-900">
        <ModeSelection onSelectMode={handleModeSelect} />
      </main>
    );
  }

  if (mode === 'competition-setup') {
    return (
      <main className="min-h-screen bg-gray-900">
        <CompetitionSetup
          onBack={() => setMode('select')}
          onStart={handleCompetitionStart}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900">
      <GameContainer
        competitionMode={mode === 'competition-play'}
        competitionData={competitionData}
        onBackToMenu={() => {
          setMode('select');
          setCompetitionData(null);
        }}
      />
    </main>
  );
}
