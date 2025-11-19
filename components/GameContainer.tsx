'use client';

import React, { useState, useEffect, useCallback } from 'react';
import GameBoard from './GameBoard';
import Keyboard from './Keyboard';
import Modal from './Modal';
import Leaderboard from './Leaderboard';

type GameStatus = 'playing' | 'won' | 'lost';
type LetterStatus = 'correct' | 'present' | 'absent' | 'empty';
type KeyStatus = 'correct' | 'present' | 'absent' | 'unused';

interface CompetitionData {
  code: string;
  playerName: string;
  difficulty: 'easy' | 'medium' | 'hard';
  targetWord: string;
}

interface Player {
  name: string;
  guesses: string[];
  completed: boolean;
  attempts: number;
  won: boolean;
  score: number;
}

interface GameContainerProps {
  competitionMode?: boolean;
  competitionData?: CompetitionData | null;
  onBackToMenu?: () => void;
}

const GameContainer: React.FC<GameContainerProps> = ({
  competitionMode = false,
  competitionData = null,
  onBackToMenu,
}) => {
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
  const [players, setPlayers] = useState<Player[]>([]);

  const maxGuesses = 6;

  // Fetch new word
  const fetchNewWord = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      if (competitionMode && competitionData) {
        // Use competition word
        setTargetWord(competitionData.targetWord);
        setDifficulty(competitionData.difficulty);
      } else {
        // Fetch solo word
        const response = await fetch(`/api/word?difficulty=${difficulty}`);
        if (!response.ok) {
          throw new Error('Failed to fetch word');
        }
        const data = await response.json();
        setTargetWord(data.word);
      }
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
  }, [difficulty, competitionMode, competitionData]);

  // Fetch competition status
  const fetchCompetitionStatus = useCallback(async () => {
    if (!competitionMode || !competitionData) return;

    try {
      const response = await fetch(`/api/competition/status?code=${competitionData.code}`);
      if (response.ok) {
        const data = await response.json();
        setPlayers(data.players);
      }
    } catch (err) {
      console.error('Error fetching competition status:', err);
    }
  }, [competitionMode, competitionData]);

  // Initialize game
  useEffect(() => {
    fetchNewWord();
  }, [fetchNewWord]);

  // Poll competition status
  useEffect(() => {
    if (competitionMode) {
      fetchCompetitionStatus();
      const interval = setInterval(fetchCompetitionStatus, 3000);
      return () => clearInterval(interval);
    }
  }, [competitionMode, fetchCompetitionStatus]);

  // Update letter states based on feedback
  const updateLetterStates = (guess: string, guessFeedback: LetterStatus[]) => {
    const newStates = { ...letterStates };
    
    guess.split('').forEach((letter, index) => {
      const status = guessFeedback[index];
      const currentStatus = newStates[letter];
      
      // Priority: correct > present > absent
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
        
        // Update competition if in competition mode
        if (competitionMode && competitionData) {
          await updateCompetitionStatus(newGuesses, true, newGuesses.length);
        } else {
          // Auto-start new game after win in solo mode
          setTimeout(() => {
            fetchNewWord();
          }, 3000);
        }
        return;
      }

      // Check loss condition
      if (newGuesses.length >= maxGuesses) {
        setGameStatus('lost');
        setTimeout(() => setShowModal(true), 500);
        
        // Update competition if in competition mode
        if (competitionMode && competitionData) {
          await updateCompetitionStatus(newGuesses, false, newGuesses.length);
        }
      }
    } catch (err) {
      console.error('Error submitting guess:', err);
      setError('Failed to submit guess. Please try again.');
    }
  };

  // Update competition status
  const updateCompetitionStatus = async (guesses: string[], won: boolean, attempts: number) => {
    if (!competitionData) return;

    try {
      const response = await fetch('/api/competition/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: competitionData.code,
          playerName: competitionData.playerName,
          guesses,
          completed: true,
          won,
          attempts,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPlayers(data.players);
      }
    } catch (err) {
      console.error('Error updating competition:', err);
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (error && !targetWord) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-2xl text-red-500 mb-4">{error}</div>
          <button
            onClick={fetchNewWord}
            className="bg-correct hover:bg-green-600 text-white font-bold py-2 px-6 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen py-8">
      <div className="w-full max-w-2xl px-4">
        {onBackToMenu && (
          <button
            onClick={onBackToMenu}
            className="mb-4 text-gray-400 hover:text-white"
          >
            ← Back to Menu
          </button>
        )}

        <h1 className="text-4xl font-bold text-center mb-2">Wordle</h1>
        <p className="text-center text-gray-400 mb-4">
          Guess the 5-letter word in {maxGuesses} tries
        </p>
        
        {/* Competition Leaderboard */}
        {competitionMode && competitionData && players.length > 0 && (
          <Leaderboard
            players={players}
            currentPlayer={competitionData.playerName}
            code={competitionData.code}
          />
        )}

        {/* Difficulty Selector - Only in solo mode */}
        {!competitionMode && (
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
        )}

        {!competitionMode && (
          <p className="text-center text-sm text-gray-500 mb-4">
            🌍 Everyone gets the same {difficulty} word today!
          </p>
        )}

        {competitionMode && (
          <p className="text-center text-sm text-gray-500 mb-4">
            🏆 {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} difficulty
          </p>
        )}
        
        {error && (
          <div className="text-center text-red-500 mb-4">{error}</div>
        )}

        <div id="game-board-container">
          <GameBoard
            guesses={guesses}
            currentGuess={currentGuess}
            gameStatus={gameStatus}
            feedback={feedback}
          />
        </div>
      </div>

      <div className="w-full max-w-2xl px-4">
        <Keyboard onKeyPress={handleKeyPress} letterStates={letterStates} />
      </div>

      <Modal
        isOpen={showModal}
        gameWon={gameStatus === 'won'}
        targetWord={targetWord}
        onPlayAgain={competitionMode ? () => setShowModal(false) : fetchNewWord}
        attempts={guesses.length}
      />
    </div>
  );
};

export default GameContainer;
