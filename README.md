# Wordle Game

A feature-rich Wordle game built with Next.js, TypeScript, MongoDB, and Tailwind CSS.

## Features

### 🎮 Game Modes
- **Solo Play**: Play alone with daily words
- **Competition Mode**: Compete with friends in real-time

### 🎯 Difficulty Levels
- **Easy**: 1000+ common words
- **Medium**: 350+ moderate difficulty words
- **Hard**: 113 challenging words with tricky patterns

### 🏆 Competition Features
- Generate unique 6-character codes
- Join competitions with friends
- Real-time leaderboard
- Score tracking (7 - attempts for wins, 0 for losses)
- See who's on top!

### 📸 Screenshot Feature
- Capture your game results
- Share on social media
- Download as PNG

### 🌍 Daily Word System
- All players get the same word per day (per difficulty)
- Fair competition across all players

### 🎨 Visual Feedback
- 🟩 Green: Correct letter in correct position
- 🟨 Yellow: Correct letter in wrong position
- ⬜ Gray: Letter not in word
- Keyboard tracking of letter states

## Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)

### Installation

1. Clone the repository
```bash
git clone https://github.com/MayankMehra7/wordle.git
cd wordle/wordle
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=wordle
```

4. Seed the database
```bash
npm run seed
```

This will populate your MongoDB with 1000+ words across all difficulty levels.

5. Run the development server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Deployment on Vercel

1. Push your code to GitHub

2. Go to [vercel.com](https://vercel.com) and import your repository

3. Add environment variables in Vercel dashboard:
   - `MONGODB_URI`: Your MongoDB connection string
   - `MONGODB_DB`: `wordle`

4. Deploy!

## How to Play

### Solo Mode
1. Select "Solo Play" from the main menu
2. Choose your difficulty level
3. Guess the 5-letter word in 6 tries
4. Use the color feedback to guide your guesses
5. Take a screenshot of your results!

### Competition Mode

#### Create Competition
1. Select "Competition" from the main menu
2. Click "Create Competition"
3. Enter your name
4. Choose difficulty level
5. Share the generated code with friends

#### Join Competition
1. Select "Competition" from the main menu
2. Click "Join Competition"
3. Enter your name
4. Enter the 6-character code
5. Start playing!

### Scoring System
- Win in 1 attempt: 6 points
- Win in 2 attempts: 5 points
- Win in 3 attempts: 4 points
- Win in 4 attempts: 3 points
- Win in 5 attempts: 2 points
- Win in 6 attempts: 1 point
- Loss: 0 points

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB
- **Deployment**: Vercel
- **Screenshot**: html2canvas

## Database Collections

### words
```javascript
{
  _id: ObjectId,
  word: String,        // 5-letter word in uppercase
  difficulty: String,  // 'easy', 'medium', or 'hard'
  createdAt: Date
}
```

### competitions
```javascript
{
  _id: ObjectId,
  code: String,        // 6-character unique code
  difficulty: String,
  targetWord: String,
  createdAt: Date,
  players: [{
    name: String,
    guesses: [String],
    completed: Boolean,
    attempts: Number,
    won: Boolean,
    score: Number
  }]
}
```

## API Routes

- `GET /api/word?difficulty=<level>` - Get daily word
- `POST /api/validate` - Validate a guess
- `POST /api/competition/create` - Create competition
- `POST /api/competition/join` - Join competition
- `POST /api/competition/update` - Update player progress
- `GET /api/competition/status?code=<code>` - Get competition status

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run seed` - Seed database with words
- `npm test` - Run tests

## License

MIT

## Author

Mayank Mehra
