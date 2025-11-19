'use client';

import React, { useState } from 'react';

interface CodeDisplayProps {
  code: string;
  onContinue: () => void;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ code, onContinue }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrl = `${window.location.origin}/join?code=${code}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my Wordle Competition!',
          text: `Join my Wordle competition with code: ${code}`,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: copy link
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-white mb-4">Competition Created!</h2>
        
        <p className="text-gray-400 mb-6">Share this code with your friends:</p>

        {/* Code Display */}
        <div className="bg-gray-700 rounded-lg p-6 mb-6">
          <div className="text-5xl font-mono font-bold text-white tracking-widest mb-4">
            {code}
          </div>
          <button
            onClick={handleCopy}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            {copied ? '✓ Copied!' : '📋 Copy Code'}
          </button>
        </div>

        {/* Share Options */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleShare}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <span>📤</span>
            Share Link
          </button>

          <div className="text-gray-400 text-sm">
            Or share this link:
            <div className="bg-gray-700 rounded p-2 mt-2 text-xs break-all">
              {shareUrl}
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={onContinue}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-lg transition-colors"
        >
          Start Playing
        </button>

        <p className="text-gray-500 text-sm mt-4">
          Your friends can join anytime using this code
        </p>
      </div>
    </div>
  );
};

export default CodeDisplay;
