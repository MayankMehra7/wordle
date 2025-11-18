# Wordle Game Design Document

## Overview

The Wordle game is a full-stack web application built with Next.js, React, MongoDB, and deployed on Vercel. The application provides an interactive word-guessing game where users have 6 attempts to guess a randomly selected 5-letter word, with visual feedback after each guess.

## Architecture

### Technology Stack

- **Frontend**: Next.js 14+ with React, TypeScript, and Tailwind CSS
- **Backend**: Next.js API Routes (serverless functions)
- **Database**: MongoDB Atlas
- **Deployment**: Vercel
- **Environment Management**: .env files for configuration

### System Architecture

```
┌─────────────────┐
│   Next.js App   │
│   (Frontend)    │
└────────┬────────┘
         │
         ├─── API Routes ────┐
         │                   │
         ▼                   ▼
┌─────────────────┐   ┌──────────────┐
│  /api/word      │   │ /api/validate│
│  (Get word)     │   │ (Check guess)│
└────────┬────────┘   └──────┬───────┘
         │                   │
         └───────┬───────────┘
                 ▼
         ┌──────────────┐
         │   MongoDB    │
         │   (Words DB) │
         └──────────────┘
```

## Components and Interfaces

### Frontend Components

#### 1. GameBoard Component
- Displays the 6x5 grid of letter tiles
- Shows current and previous guesses
- Handles visual feedback (correct, present, incorrect)
- Props: `guesses`, `currentGuess`, `gameStatus`

#### 2. Keyboard Component
- Virtual on-screen keyboard
- Shows letter states based on previous guesses
- Handles user input
- Props: `onKeyPress`, `letterStates`

#### 3. GameContainer Component
- Main game logic container
- Manages game state (guesses, target word, game status)
- Handles guess submission and validation
- Displays end-game modal with results

#### 4. Modal Component
- Shows game results (win/loss)
- Displays the target word
- Provides "Play Again" button
- Props: `isOpen`, `gameWon`, `targetWord`, `onPlayAgain`

### API Endpoints

#### GET /api/word
- Returns a random 5-letter word from the database
- Response: `{ word: string, wordId: string }`
- Error handling: Returns 500 if database connection fails

#### POST /api/validate
- Validates a guess against the target word
- Request body: `{ guess: string, targetWord: string }`
- Response: `{ feedback: Array<'correct' | 'present' | 'absent'>, isCorrect: boolean }`
- Validates guess length and format

### Database Schema

#### Words Collection
```typescript
{
  _id: ObjectId,
  word: string,        // 5-letter word in uppercase
  createdAt: Date
}
```

## Data Models

### Game State (Frontend)
```typescript
interface GameState {
  targetWord: string;
  guesses: string[];
  currentGuess: string;
  gameStatus: 'playing' | 'won' | 'lost';
  attemptCount: number;
}

interface LetterFeedback {
  letter: string;
  status: 'correct' | 'present' | 'absent' | 'empty';
}

interface KeyboardLetterState {
  [key: string]: 'correct' | 'present' | 'absent' | 'unused';
}
```

### API Response Types
```typescript
interface WordResponse {
  word: string;
  wordId: string;
}

interface ValidationResponse {
  feedback: Array<'correct' | 'present' | 'absent'>;
  isCorrect: boolean;
}
```

## Error Handling

### Frontend Error Handling
- Display user-friendly error messages for invalid inputs
- Handle network errors when fetching words
- Validate guess length before submission
- Show loading states during API calls

### Backend Error Handling
- Catch and log database connection errors
- Return appropriate HTTP status codes (400, 500)
- Validate request payloads
- Handle missing environment variables gracefully

### Database Error Handling
- Implement connection retry logic
- Handle empty word bank scenario
- Log database errors for monitoring

## Testing Strategy

### Unit Tests
- Test validation logic for guess checking
- Test letter feedback calculation
- Test game state transitions

### Integration Tests
- Test API endpoints with mock database
- Test end-to-end game flow
- Test word selection randomization

### Manual Testing
- Test game playability across browsers
- Verify visual feedback accuracy
- Test deployment on Vercel
- Verify environment variable configuration

## Deployment Configuration

### Environment Variables
```
MONGODB_URI=mongodb+srv://...
MONGODB_DB=wordle
```

### Vercel Configuration
- Next.js automatic deployment
- Environment variables configured in Vercel dashboard
- Serverless functions for API routes
- Edge network for optimal performance

### Database Setup
- MongoDB Atlas cluster
- Words collection pre-populated with 50+ words
- Index on word field for faster queries

## Implementation Notes

### Word Bank Population
- Initial seed script to populate MongoDB with 5-letter words
- Minimum 50 words, expandable to hundreds
- Words stored in uppercase for consistency

### Game Logic
- Client-side game state management using React hooks
- Guess validation happens on both client and server
- Automatic refresh to new word on correct guess
- Session-based gameplay (no user accounts required)

### Visual Design
- Color-coded tiles: Green (correct), Yellow (present), Gray (absent)
- Responsive design for mobile and desktop
- Smooth animations for tile reveals
- Accessible keyboard navigation
