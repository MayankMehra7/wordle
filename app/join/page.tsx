'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function JoinTeamPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [competitionInfo, setCompetitionInfo] = useState<any>(null);

  // Auto-fill code from URL if present
  useEffect(() => {
    const urlCode = searchParams.get('code');
    if (urlCode) {
      setCode(urlCode.toUpperCase());
      // Auto-verify if code is 6 characters
      if (urlCode.length === 6) {
        handleVerifyCode(urlCode.toUpperCase());
      }
    }
  }, [searchParams]);

  const handleVerifyCode = async (codeToVerify?: string) => {
    const verifyCode = codeToVerify || code;
    
    if (!verifyCode.trim()) {
      setError('Please enter a competition code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/competition/status?code=${verifyCode.toUpperCase()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Competition not found');
      }

      const data = await response.json();
      setCompetitionInfo(data);
    } catch (err: any) {
      setError(err.message);
      setCompetitionInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/competition/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.toUpperCase(),
          playerName: playerName.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to join competition');
      }

      // Redirect to game with competition data
      router.push(`/?mode=competition&code=${code.toUpperCase()}&player=${encodeURIComponent(playerName.trim())}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">🏆</h1>
          <h2 className="text-3xl font-bold text-white mb-2">Join Competition</h2>
          <p className="text-gray-300">Enter the code to join your team</p>
        </div>

        {/* Main Card */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8">
          {/* Step 1: Enter Code */}
          {!competitionInfo && (
            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">
                  Competition Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.toUpperCase());
                    setError('');
                  }}
                  placeholder="Enter 6-character code"
                  className="w-full px-4 py-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 uppercase text-center text-2xl tracking-widest font-mono"
                  maxLength={6}
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="bg-red-500 text-white p-3 rounded-lg text-center">
                  {error}
                </div>
              )}

              <button
                onClick={handleVerifyCode}
                disabled={loading || code.length !== 6}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>

              <div className="text-center">
                <button
                  onClick={() => router.push('/')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ← Back to Home
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Competition Found - Enter Name */}
          {competitionInfo && (
            <div className="space-y-6">
              {/* Competition Info */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400">Code:</span>
                  <span className="text-white font-mono font-bold text-xl">{competitionInfo.code}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400">Difficulty:</span>
                  <span className={`font-semibold px-3 py-1 rounded ${
                    competitionInfo.difficulty === 'easy' ? 'bg-green-500 text-white' :
                    competitionInfo.difficulty === 'medium' ? 'bg-yellow-500 text-white' :
                    'bg-red-500 text-white'
                  }`}>
                    {competitionInfo.difficulty.charAt(0).toUpperCase() + competitionInfo.difficulty.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Players:</span>
                  <span className="text-white font-semibold">{competitionInfo.players.length}</span>
                </div>
              </div>

              {/* Current Players */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-white font-semibold mb-3">Current Players:</h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {competitionInfo.players.map((player: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-gray-300">
                      <span className="text-lg">👤</span>
                      <span>{player.name}</span>
                      {player.completed && (
                        <span className="ml-auto text-xs">
                          {player.won ? '✅' : '❌'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Enter Name */}
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">
                  Your Name
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => {
                    setPlayerName(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  maxLength={20}
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="bg-red-500 text-white p-3 rounded-lg text-center">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setCompetitionInfo(null);
                    setPlayerName('');
                    setError('');
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleJoin}
                  disabled={loading || !playerName.trim()}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Joining...' : 'Join Game'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-gray-800 bg-opacity-50 rounded-lg p-4 text-center">
          <p className="text-gray-400 text-sm">
            💡 Ask your friend for the 6-character competition code
          </p>
        </div>
      </div>
    </div>
  );
}
