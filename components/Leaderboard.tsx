'use client';

import React from 'react';

interface Player {
  name: string;
  score: number;
  attempts: number;
  completed: boolean;
}

interface LeaderboardProps {
  players: Player[];
  roomCode: string;
  currentPlayer: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ players, roomCode, currentPlayer }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">🏆 Leaderboard</h3>
        <div className="bg-gray-700 px-3 py-1 rounded">
          <span className="text-gray-400 text-sm">Room: </span>
          <span className="text-white font-mono font-bold">{roomCode}</span>
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
              <div className={`text-2xl ${
                index === 0 ? 'text-yellow-400' :
                index === 1 ? 'text-gray-300' :
                index === 2 ? 'text-orange-400' :
                'text-gray-500'
              }`}>
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
              </div>
              <div>
                <div className="font-semibold text-white">
                  {player.name}
                  {player.name === currentPlayer && (
                    <span className="ml-2 text-xs text-blue-400">(You)</span>
                  )}
                </div>
                <div className="text-sm text-gray-400">
                  {player.completed ? (
                    <>Solved in {player.attempts} {player.attempts === 1 ? 'try' : 'tries'}</>
                  ) : player.attempts > 0 ? (
                    <>Playing... ({player.attempts}/6)</>
                  ) : (
                    <>Not started</>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{player.score}</div>
              <div className="text-xs text-gray-400">points</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-gray-700 rounded-lg">
        <div className="text-sm text-gray-300 text-center">
          💡 Score: Fewer attempts = More points (Max 6 points)
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
