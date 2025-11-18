import { NextRequest, NextResponse } from 'next/server';

type FeedbackType = 'correct' | 'present' | 'absent';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { guess, targetWord } = body;

    // Validate input
    if (!guess || !targetWord) {
      return NextResponse.json(
        { error: 'Missing guess or targetWord' },
        { status: 400 }
      );
    }

    if (guess.length !== 5 || targetWord.length !== 5) {
      return NextResponse.json(
        { error: 'Guess and target word must be 5 letters' },
        { status: 400 }
      );
    }

    const guessUpper = guess.toUpperCase();
    const targetUpper = targetWord.toUpperCase();

    // Calculate feedback
    const feedback: FeedbackType[] = [];
    const targetLetters = targetUpper.split('');
    const guessLetters = guessUpper.split('');
    
    // Track which letters in target have been matched
    const targetUsed = new Array(5).fill(false);
    const result = new Array(5).fill('absent') as FeedbackType[];

    // First pass: mark correct positions
    for (let i = 0; i < 5; i++) {
      if (guessLetters[i] === targetLetters[i]) {
        result[i] = 'correct';
        targetUsed[i] = true;
      }
    }

    // Second pass: mark present letters
    for (let i = 0; i < 5; i++) {
      if (result[i] === 'correct') continue;
      
      // Find if this letter exists elsewhere in target
      for (let j = 0; j < 5; j++) {
        if (!targetUsed[j] && guessLetters[i] === targetLetters[j]) {
          result[i] = 'present';
          targetUsed[j] = true;
          break;
        }
      }
    }

    const isCorrect = guessUpper === targetUpper;

    return NextResponse.json({
      feedback: result,
      isCorrect
    });
  } catch (error) {
    console.error('Error validating guess:', error);
    return NextResponse.json(
      { error: 'Failed to validate guess' },
      { status: 500 }
    );
  }
}
