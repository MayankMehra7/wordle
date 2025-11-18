/**
 * Unit tests for guess validation logic
 * Tests the feedback calculation algorithm for various scenarios
 */

type FeedbackType = 'correct' | 'present' | 'absent';

// Extracted validation logic for testing
function validateGuess(guess: string, targetWord: string): FeedbackType[] {
  const guessUpper = guess.toUpperCase();
  const targetUpper = targetWord.toUpperCase();

  const targetLetters = targetUpper.split('');
  const guessLetters = guessUpper.split('');
  
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
    
    for (let j = 0; j < 5; j++) {
      if (!targetUsed[j] && guessLetters[i] === targetLetters[j]) {
        result[i] = 'present';
        targetUsed[j] = true;
        break;
      }
    }
  }

  return result;
}

describe('Guess Validation Logic', () => {
  describe('Correct positions', () => {
    test('all letters correct', () => {
      const result = validateGuess('HELLO', 'HELLO');
      expect(result).toEqual(['correct', 'correct', 'correct', 'correct', 'correct']);
    });

    test('some letters correct', () => {
      const result = validateGuess('HELLO', 'HELPS');
      expect(result).toEqual(['correct', 'correct', 'correct', 'absent', 'absent']);
    });

    test('first letter correct', () => {
      const result = validateGuess('HELLO', 'HAPPY');
      expect(result[0]).toBe('correct');
    });

    test('last letter correct', () => {
      const result = validateGuess('HELLO', 'TEMPO');
      expect(result[4]).toBe('correct');
    });
  });

  describe('Present but wrong position', () => {
    test('letter exists but wrong position', () => {
      const result = validateGuess('HELLO', 'LEMON');
      expect(result[2]).toBe('present'); // L in HELLO is at position 2, in LEMON at position 0
    });

    test('multiple present letters', () => {
      const result = validateGuess('STEAL', 'LEAST');
      // S: position 0 in guess, position 3 in target -> present
      // T: position 1 in guess, position 4 in target -> present
      // E: position 2 in guess, position 1 in target -> present
      // A: position 3 in guess, position 2 in target -> present
      // L: position 4 in guess, position 0 in target -> present
      expect(result).toEqual(['present', 'present', 'present', 'present', 'present']);
    });
  });

  describe('Absent letters', () => {
    test('no matching letters', () => {
      const result = validateGuess('HELLO', 'STAMP');
      expect(result).toEqual(['absent', 'absent', 'absent', 'absent', 'absent']);
    });

    test('mix of correct and absent', () => {
      const result = validateGuess('HELLO', 'HAPPY');
      expect(result[1]).toBe('absent'); // E not in HAPPY
      expect(result[2]).toBe('absent'); // First L not in HAPPY
      expect(result[3]).toBe('absent'); // Second L not in HAPPY
      expect(result[4]).toBe('absent'); // O not in HAPPY
    });
  });

  describe('Duplicate letter handling', () => {
    test('duplicate in guess, single in target - correct position', () => {
      const result = validateGuess('HELLO', 'WORLD');
      // H: absent
      // E: absent
      // L: correct (position 2)
      // L: absent (already used)
      // O: correct (position 4)
      expect(result).toEqual(['absent', 'absent', 'correct', 'absent', 'correct']);
    });

    test('duplicate in guess, single in target - one present', () => {
      const result = validateGuess('SPEED', 'ERASE');
      // S: absent
      // P: absent
      // E: present (first E matches)
      // E: absent (already used)
      // D: absent
      expect(result[2]).toBe('present');
      expect(result[3]).toBe('absent');
    });

    test('duplicate in target, single in guess', () => {
      const result = validateGuess('WORLD', 'HELLO');
      // W: absent
      // O: present (matches one O in HELLO)
      // R: absent
      // L: correct (position 3)
      // D: absent
      expect(result).toEqual(['absent', 'present', 'absent', 'correct', 'absent']);
    });

    test('duplicate in both - complex case', () => {
      const result = validateGuess('LLAMA', 'HELLO');
      // L: correct (position 0 matches position 2 in HELLO)
      // L: correct (position 1 matches position 3 in HELLO)
      // A: absent
      // M: absent
      // A: absent
      expect(result[0]).toBe('present');
      expect(result[1]).toBe('present');
    });
  });

  describe('Edge cases', () => {
    test('case insensitive matching', () => {
      const result1 = validateGuess('hello', 'HELLO');
      const result2 = validateGuess('HELLO', 'hello');
      expect(result1).toEqual(['correct', 'correct', 'correct', 'correct', 'correct']);
      expect(result2).toEqual(['correct', 'correct', 'correct', 'correct', 'correct']);
    });

    test('mixed case', () => {
      const result = validateGuess('HeLLo', 'hEllO');
      expect(result).toEqual(['correct', 'correct', 'correct', 'correct', 'correct']);
    });
  });

  describe('Real game scenarios', () => {
    test('common wordle pattern 1', () => {
      const result = validateGuess('CRANE', 'TRACE');
      // C: present (position 0 in guess, position 3 in target)
      // R: correct (position 1)
      // A: correct (position 2)
      // N: absent
      // E: correct (position 4)
      expect(result).toEqual(['present', 'correct', 'correct', 'absent', 'correct']);
    });

    test('common wordle pattern 2', () => {
      const result = validateGuess('STARE', 'TEARS');
      // S: present (position 0 in guess, position 4 in target)
      // T: correct (position 1)
      // A: correct (position 2)
      // R: present (position 3 in guess, position 3 in target)
      // E: correct (position 4 in guess, position 1 in target)
      expect(result).toEqual(['present', 'correct', 'correct', 'present', 'present']);
    });
  });
});
