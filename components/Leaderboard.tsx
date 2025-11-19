'use client';

import React from 'react';

interface Player {
  name: string;
  guesses: string[];
  completed: boolean;
  attempts: number;
  won: boolean;
  score: number;
}

interface LeaderboardProps {
  players: Player[];
  currentPlayer: string;
  code: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ players, currentPlayer, code }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">Leaderboard</h3>
        <div className="bg-gray-700 px-4 py-2 rounded">
          <span className="text-gray-400 text-sm">Code: </span>
          <span className="text-white font-mono font-bold">{code}</span>
        </div>
      </div>

      <div className="space-y-2">
        {players.map((player, index) => (
          <div
            key={player.name}
            className={`flex items-center justify-between p-3 rounded-lg ${
              player.name === currentPlayer
                ? 'bg-blue-900 border-2 border-blue-500'
                : 'bg-gray-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`text-2xl ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-orange-400' : 'text-gray-500'}`}>
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
              </div>
              <div>
                <div className="text-white font-semibold">
                  {player.name}
                  {player.name === currentPlayer && (
                    <span className="ml-2 text-xs text-blue-400">(You)</span>
                  )}
                </div>
                <div className="text-sm text-gray-400">
                  {player.completed ? (
                    player.won ? (
                      <span className="text-green-400">Won in {player.attempts} tries</span>
                    ) : (
                      <span className="text-red-400">Failed</span>
                    )
                  ) : (
                    <span>Playing... ({player.attempts}/6)</span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-2xl font-bold text-white">
              {player.score}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center text-sm text-gray-400">
        Score: 7 - attempts (Win) | 0 (Loss)
      </div>
    </div>
  );
};

export default Leaderboard;
