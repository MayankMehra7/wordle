'use client';

import React, { useState, useEffect, useCallback } from 'react';
import GameBoard from './GameBoard';
import Keyboard from './Keyboard';
import Leaderboard from './Leaderboard';

type GameStatus = 'playing' | 'won' | 'lost';
type LetterStatus = 'correct' | 'present' | 'absent' | 'empty';
type KeyStatus = 'correct' | 'present' | 'absent' | 'unused';

interface Player {
  name: string;
  score: number;
  attempts: number;
  completed: boolean;
  guesses: string[];
}

interface GameContainerMultiplayerProps {
  roomCode: string;
  playerName: string;
  difficulty: 'easy' | 'medium' | 'hard';
  initialWord: string;
  onBackToMenu: () => void;
}

const GameContainerMultiplayer: React.FC<GameContainerMultiplayerProps> = ({
  roomCode,
  playerName,
  difficulty,
  initialWord,
  onBackToMenu,
}) => {
  const [targetWord, setTargetWord] = useState<string>(initialWord);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [feedback, setFeedback] = useState<LetterStatus[][]>([]);
  const [letterStates, setLetterStates] = useState<{ [key: string]: KeyStatus }>({});
  const [error, setError] = useState<string>('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameWinner, setGameWinner] = useState<string | null>(null);
  const [currentDifficulty, setCurrentDifficulty] = useState<string>(difficulty);
  const [roundNumber, setRoundNumber] = useState<number>(0);

  const maxGuesses = 6;
  const winningScore = 200;

  // Fetch room status
  const fetchRoomStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/room/status?roomCode=${roomCode}`);
      if (response.ok) {
        const data = await response.json();
        setPlayers(data.players);
        setCurrentDifficulty(data.currentDifficulty || data.difficulty);
        setRoundNumber(data.roundNumber || 0);
        
        // Check if anyone reached 200 points
        const winner = data.players.find((p: Player) => p.score >= winningScore);
        if (winner && !gameWinner) {
          setGameWinner(winner.name);
        }
      }
    } catch (err) {
      console.error('Error fetching room status:', err);
    }
  }, [roomCode, gameWinner]);

  // Poll room status every 3 seconds
  useEffect(() => {
    fetchRoomStatus();
    const interval = setInterval(fetchRoomStatus, 3000);
    return () => clearInterval(interval);
  }, [fetchRoomStatus]);

  // Update room with player progress
  const updateRoom = useCallback(async () => {
    try {
      await fetch('/api/room/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomCode,
          playerName,
          guesses,
          completed: gameStatus !== 'playing',
          attempts: guesses.length,
        }),
      });
      await fetchRoomStatus();
    } catch (err) {
      console.error('Error updating room:', err);
    }
  }, [roomCode, playerName, guesses, gameStatus, fetchRoomStatus]);

  // Update letter states based on feedback
  const updateLetterStates = (guess: string, guessFeedback: LetterStatus[]) => {
    const newStates = { ...letterStates };
    
    guess.split('').forEach((letter, index) => {
      const status = guessFeedback[index];
      const currentStatus = newStates[letter];
      
      if (status === 'correct') {
        newStates[letter] = 'correct';
      } else if (status === 'present' && currentStatus !== 'correct') {
        newStates[letter] = 'present';
      } else if (status === 'absent' && !currentStatus) {
        newStates[letter] = 'absent';
      }
    });
    
    setLetterStates(newStates);
  };

  // Submit guess
  const submitGuess = async () => {
    if (currentGuess.length !== 5 || gameStatus !== 'playing') {
      return;
    }

    try {
      const response = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guess: currentGuess,
          targetWord: targetWord,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to validate guess');
      }

      const data = await response.json();
      const newGuesses = [...guesses, currentGuess];
      const newFeedback = [...feedback, data.feedback];

      setGuesses(newGuesses);
      setFeedback(newFeedback);
      updateLetterStates(currentGuess, data.feedback);
      setCurrentGuess('');

      // Check win condition
      if (data.isCorrect) {
        setGameStatus('won');
        await updateRoom();
        // Auto-start new round after 2 seconds
        setTimeout(() => {
          startNewRound();
        }, 2000);
        return;
      }

      // Check loss condition
      if (newGuesses.length >= maxGuesses) {
        setGameStatus('lost');
        await updateRoom();
        // Auto-start new round after 2 seconds
        setTimeout(() => {
          startNewRound();
        }, 2000);
      }
    } catch (err) {
      console.error('Error submitting guess:', err);
      setError('Failed to submit guess. Please try again.');
    }
  };

  // Start new round with rotating difficulty
  const startNewRound = async () => {
    try {
      const response = await fetch('/api/room/nextword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch word');
      }
      
      const data = await response.json();
      setTargetWord(data.word);
      setCurrentDifficulty(data.difficulty);
      setRoundNumber(data.roundNumber);
      setGuesses([]);
      setCurrentGuess('');
      setGameStatus('playing');
      setFeedback([]);
      setLetterStates({});
      
      // Fetch updated room status
      await fetchRoomStatus();
    } catch (err) {
      setError('Failed to load new word. Please try again.');
      console.error(err);
    }
  };

  // Handle key press
  const handleKeyPress = useCallback((key: string) => {
    if (gameStatus !== 'playing' || gameWinner) return;

    if (key === 'ENTER') {
      submitGuess();
    } else if (key === 'BACK') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < 5 && /^[A-Z]$/.test(key)) {
      setCurrentGuess(prev => prev + key);
    }
  }, [currentGuess, gameStatus, gameWinner]);

  // Physical keyboard handler
  useEffect(() => {
    const handlePhysicalKeyPress = (event: KeyboardEvent) => {
      if (gameStatus !== 'playing' || gameWinner) return;

      const key = event.key.toUpperCase();
      
      if (key === 'ENTER') {
        handleKeyPress('ENTER');
      } else if (key === 'BACKSPACE') {
        handleKeyPress('BACK');
      } else if (/^[A-Z]$/.test(key)) {
        handleKeyPress(key);
      }
    };

    window.addEventListener('keydown', handlePhysicalKeyPress);
    return () => window.removeEventListener('keydown', handlePhysicalKeyPress);
  }, [handleKeyPress, gameStatus, gameWinner]);

  // Reset game for new competition
  const handlePlayAgain = async () => {
    setGameWinner(null);
    await startNewRound();
  };

  // Show winner modal
  if (gameWinner) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
        <div className="max-w-2xl w-full bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-yellow-400 mb-4">🎉 WINNER! 🎉</h1>
            <h2 className="text-3xl font-bold text-white mb-6">{gameWinner}</h2>
            <p className="text-xl text-gray-300 mb-8">
              Reached {winningScore} points and won the competition!
            </p>
            
            <div className="bg-gray-700 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Final Standings</h3>
              <div className="space-y-2">
                {players.map((player, index) => (
                  <div
                    key={player.name}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      player.name === gameWinner
                        ? 'bg-yellow-600'
                        : 'bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </span>
                      <span className="font-semibold text-white">{player.name}</span>
                    </div>
                    <span className="text-2xl font-bold text-white">{player.score}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={handlePlayAgain}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg"
              >
                🔄 Play Again
              </button>
              <button
                onClick={onBackToMenu}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg"
              >
                🏠 End Game
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen py-8 bg-gray-900">
      <div className="w-full max-w-4xl px-4">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={onBackToMenu}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          >
            ← Leave Game
          </button>
          <div className="text-white font-bold">
            Room: <span className="font-mono bg-gray-700 px-3 py-1 rounded">{roomCode}</span>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-center mb-2 text-white">Wordle Competition</h1>
        <p className="text-center text-gray-400 mb-2">
          First to {winningScore} points wins! • Round {roundNumber + 1}
        </p>
        <p className="text-center text-sm text-gray-500 mb-4">
          Current: <span className={`font-bold ${
            currentDifficulty === 'easy' ? 'text-green-400' :
            currentDifficulty === 'medium' ? 'text-yellow-400' :
            'text-red-400'
          }`}>{currentDifficulty.toUpperCase()}</span> • 
          Next: Easy → Medium → Hard (rotating)
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2">
            {error && (
              <div className="text-center text-red-500 mb-4">{error}</div>
            )}

            {gameStatus !== 'playing' && (
              <div className={`text-center mb-4 p-3 rounded-lg ${
                gameStatus === 'won' ? 'bg-green-600' : 'bg-red-600'
              }`}>
                <p className="text-white font-bold text-lg">
                  {gameStatus === 'won' ? '✅ Correct! Starting next round...' : '❌ Out of guesses! Starting next round...'}
                </p>
                <p className="text-white text-sm">The word was: {targetWord}</p>
              </div>
            )}

            <GameBoard
              guesses={guesses}
              currentGuess={currentGuess}
              gameStatus={gameStatus}
              feedback={feedback}
            />
          </div>

          <div className="lg:col-span-1">
            <Leaderboard
              players={players}
              roomCode={roomCode}
              currentPlayer={playerName}
            />
          </div>
        </div>
      </div>

      <div className="w-full max-w-2xl px-4">
        <Keyboard onKeyPress={handleKeyPress} letterStates={letterStates} />
      </div>
    </div>
  );
};

export default GameContainerMultiplayer;
