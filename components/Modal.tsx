'use client';

import React, { useState } from 'react';
import { captureScreenshot, downloadScreenshot, shareScreenshot } from '@/lib/screenshot';

interface ModalProps {
  isOpen: boolean;
  gameWon: boolean;
  targetWord: string;
  onPlayAgain?: () => void;
  attempts: number;
}

const Modal: React.FC<ModalProps> = ({ isOpen, gameWon, targetWord, onPlayAgain, attempts }) => {
  const [screenshotLoading, setScreenshotLoading] = useState(false);

  if (!isOpen) return null;

  const handleScreenshot = async () => {
    setScreenshotLoading(true);
    try {
      const blob = await captureScreenshot('game-board-container');
      if (blob) {
        // Try to share, if not supported, download
        const shared = await shareScreenshot(blob);
        if (!shared) {
          downloadScreenshot(blob, `wordle-${gameWon ? 'win' : 'result'}-${Date.now()}.png`);
        }
      }
    } catch (error) {
      console.error('Screenshot error:', error);
    } finally {
      setScreenshotLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full text-center animate-fadeIn">
        <h2 className="text-3xl font-bold mb-4">
          {gameWon ? '🎉 Congratulations!' : '😔 Game Over'}
        </h2>
        
        <p className="text-xl mb-2">
          {gameWon 
            ? `You guessed the word in ${attempts} ${attempts === 1 ? 'attempt' : 'attempts'}!` 
            : 'Better luck next time!'}
        </p>
        
        <div className="my-6">
          <p className="text-gray-400 mb-2">The word was:</p>
          <p className="text-4xl font-bold text-correct tracking-wider">{targetWord}</p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleScreenshot}
            disabled={screenshotLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {screenshotLoading ? '📸 Capturing...' : '📸 Screenshot'}
          </button>

          {onPlayAgain && (
            <button
              onClick={onPlayAgain}
              className="bg-correct hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
            >
              Play Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
