'use client';

import React, { useState, useEffect, useCallback } from 'react';
import GameBoard from './GameBoard';
import Keyboard from './Keyboard';
import Modal from './Modal';
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
  const [showModal, setShowModal] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [roundComplete, setRoundComplete] = useState<boolean>(false);
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
        if (winner) {
          setGameWinner(winner.name);
        }
      }
    } catch (err) {
      console.error('Error fetching room status:', err);
    }
  }, [roomCode]);

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
        setRoundComplete(true);
        setTimeout(() => setShowModal(true), 500);
        await updateRoom();
        return;
      }

      // Check loss condition
      if (newGuesses.length >= maxGuesses) {
        setGameStatus('lost');
        setRoundComplete(true);
        setTimeout(() => setShowModal(true), 500);
        await updateRoom();
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
      setShowModal(false);
      setRoundComplete(false);
      
      // Fetch updated room status
      await fetchRoomStatus();
    } catch (err) {
      setError('Failed to load new word. Please try again.');
      console.error(err);
    }
  };

  // Handle key press
  const handleKeyPress = useCallback((key: string) => {
    if (gameStatus !== 'playing') return;

    if (key === 'ENTER') {
      submitGuess();
    } else if (key === 'BACK') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < 5 && /^[A-Z]$/.test(key)) {
      setCurrentGuess(prev => prev + key);
    }
  }, [currentGuess, gameStatus]);

  // Physical keyboard handler
  useEffect(() => {
    const handlePhysicalKeyPress = (event: KeyboardEvent) => {
      if (gameStatus !== 'playing') return;

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
  }, [handleKeyPress, gameStatus]);



  return (
    <div className="flex flex-col items-center justify-between min-h-screen py-8 bg-gray-900">
      <div className="w-full max-w-4xl px-4">
        <div className="flex justify-start items-center mb-4">
          <button
            onClick={onBackToMenu}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          >
            ← Back to Menu
          </button>
        </div>

        <h1 className="text-4xl font-bold text-center mb-2 text-white">Wordle Competition</h1>
        <p className="text-center text-gray-400 mb-4">
          First to {winningScore} points wins! • Round {roundNumber + 1} • {currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)} Mode
        </p>
        <p className="text-center text-sm text-gray-500 mb-4">
          🔄 Difficulty rotates: Easy → Medium → Hard → Easy...
        </p>

        {gameWinner && (
          <div className="bg-yellow-500 text-black font-bold text-center py-3 px-4 rounded-lg mb-4 text-xl">
            🎉 {gameWinner} wins the competition with {winningScore}+ points! 🎉
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2">
            {error && (
              <div className="text-center text-red-500 mb-4">{error}</div>
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

      <Modal
        isOpen={showModal}
        gameWon={gameStatus === 'won'}
        targetWord={targetWord}
        onPlayAgain={startNewRound}
        attempts={guesses.length}
      />
    </div>
  );
};

export default GameContainerMultiplayer;
