'use client';

import React, { useState, useEffect, useCallback } from 'react';
import GameBoard from './GameBoard';
import Keyboard from './Keyboard';
import Modal from './Modal';

type GameStatus = 'playing' | 'won' | 'lost';
type LetterStatus = 'correct' | 'present' | 'absent' | 'empty';
type KeyStatus = 'correct' | 'present' | 'absent' | 'unused';

interface GameContainerSoloProps {
  onBackToMenu: () => void;
}

const GameContainerSolo: React.FC<GameContainerSoloProps> = ({ onBackToMenu }) => {
  const [targetWord, setTargetWord] = useState<string>('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [feedback, setFeedback] = useState<LetterStatus[][]>([]);
  const [letterStates, setLetterStates] = useState<{ [key: string]: KeyStatus }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

  const maxGuesses = 6;

  // Fetch new word
  const fetchNewWord = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/word?difficulty=${difficulty}`);
      if (!response.ok) {
        throw new Error('Failed to fetch word');
      }
      const data = await response.json();
      setTargetWord(data.word);
      setGuesses([]);
      setCurrentGuess('');
      setGameStatus('playing');
      setFeedback([]);
      setLetterStates({});
      setShowModal(false);
    } catch (err) {
      setError('Failed to load word. Please refresh the page.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [difficulty]);

  // Initialize game
  useEffect(() => {
    fetchNewWord();
  }, [fetchNewWord]);

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
    if (currentGuess.length !== 5) {
      return;
    }

    try {
      const response = await fetch('/api/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        setTimeout(() => setShowModal(true), 500);
        // Auto-start new game after win
        setTimeout(() => {
          fetchNewWord();
        }, 3000);
        return;
      }

      // Check loss condition
      if (newGuesses.length >= maxGuesses) {
        setGameStatus('lost');
        setTimeout(() => setShowModal(true), 500);
      }
    } catch (err) {
      console.error('Error submitting guess:', err);
      setError('Failed to submit guess. Please try again.');
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



  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-2xl text-white">Loading...</div>
      </div>
    );
  }

  if (error && !targetWord) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="text-2xl text-red-500 mb-4">{error}</div>
          <button
            onClick={fetchNewWord}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen py-8 bg-gray-900">
      <div className="w-full max-w-2xl px-4">
        <div className="flex justify-start items-center mb-4">
          <button
            onClick={onBackToMenu}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          >
            ← Back to Menu
          </button>
        </div>

        <h1 className="text-4xl font-bold text-center mb-2 text-white">Wordle</h1>
        <p className="text-center text-gray-400 mb-4">
          Guess the 5-letter word in {maxGuesses} tries
        </p>
        
        {/* Difficulty Selector */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setDifficulty('easy')}
            disabled={gameStatus !== 'playing' && guesses.length > 0}
            className={`px-4 py-2 rounded font-semibold transition-colors ${
              difficulty === 'easy'
                ? 'bg-green-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            } ${gameStatus !== 'playing' && guesses.length > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Easy
          </button>
          <button
            onClick={() => setDifficulty('medium')}
            disabled={gameStatus !== 'playing' && guesses.length > 0}
            className={`px-4 py-2 rounded font-semibold transition-colors ${
              difficulty === 'medium'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            } ${gameStatus !== 'playing' && guesses.length > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Medium
          </button>
          <button
            onClick={() => setDifficulty('hard')}
            disabled={gameStatus !== 'playing' && guesses.length > 0}
            className={`px-4 py-2 rounded font-semibold transition-colors ${
              difficulty === 'hard'
                ? 'bg-red-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            } ${gameStatus !== 'playing' && guesses.length > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Hard
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mb-4">
          🌍 Everyone gets the same {difficulty} word today!
        </p>
        
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

      <div className="w-full max-w-2xl px-4">
        <Keyboard onKeyPress={handleKeyPress} letterStates={letterStates} />
      </div>

      <Modal
        isOpen={showModal}
        gameWon={gameStatus === 'won'}
        targetWord={targetWord}
        onPlayAgain={fetchNewWord}
        attempts={guesses.length}
      />
    </div>
  );
};

export default GameContainerSolo;
