# 🎮 Wordle Game - Multiplayer Competition Edition

A feature-rich Wordle game built with Next.js, TypeScript, MongoDB, and Tailwind CSS. Play solo or compete with friends in real-time!

## ✨ Features

### 🎯 Game Modes
- **Solo Mode**: Play the classic Wordle game alone
- **Competition Mode**: Compete with friends in real-time
  - Create a room and share the 6-character code
  - Join existing rooms with a code
  - Live leaderboard showing all players
  - First to 200 points wins!

### 🎨 Difficulty Levels
- **Easy**: 657 common words
- **Medium**: 368 moderate difficulty words
- **Hard**: 113 challenging words with tricky patterns
- **Total**: 1,138 five-letter words!

### 🌟 Key Features
- ✅ **Daily Word**: All players get the same word each day (per difficulty)
- ✅ **Color-Coded Feedback**:
  - 🟩 Green = Correct position
  - 🟨 Yellow = Wrong position but in word
  - ⬜ Gray = Not in word
- ✅ **Screenshot Feature**: Capture and share your results
- ✅ **6 Attempts Maximum** per round
- ✅ **Real-time Leaderboard** in competition mode
- ✅ **Scoring System**: Fewer attempts = More points (max 6 points per round)
- ✅ **Auto-refresh** to new word on correct guess (solo mode)
- ✅ **Continuous Rounds** until someone reaches 200 points (competition mode)
- ✅ **Responsive Design**: Works on mobile and desktop
- ✅ **Keyboard Support**: Use physical or virtual keyboard

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free tier works!)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MayankMehra7/wordle.git
   cd wordle/wordle
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MongoDB**
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Get your connection string
   - Create a database named `wordle`

4. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
   MONGODB_DB=wordle
   ```

5. **Seed the database**
   ```bash
   npm run seed
   ```
   
   This will populate your database with 1,138 words across all difficulty levels.

6. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎮 How to Play

### Solo Mode
1. Click "Play Solo" from the main menu
2. Select your difficulty level (Easy/Medium/Hard)
3. Guess the 5-letter word in 6 tries
4. Use the color-coded feedback to guide your next guess
5. Click "📸 Screenshot" to capture your results
6. Game auto-refreshes to a new word when you win!

### Competition Mode

#### Creating a Room
1. Click "Create Competition" from the main menu
2. Enter your name
3. Select difficulty level
4. Click "Create Room & Get Code"
5. Share the 6-character room code with friends
6. Start playing!

#### Joining a Room
1. Click "Join Competition" from the main menu
2. Enter your name
3. Enter the 6-character room code
4. Click "Join Room"
5. Start competing!

#### Competition Rules
- All players in a room play the same word
- Each correct guess earns points based on attempts:
  - 1 attempt = 6 points
  - 2 attempts = 5 points
  - 3 attempts = 4 points
  - 4 attempts = 3 points
  - 5 attempts = 2 points
  - 6 attempts = 1 point
  - Failed = 0 points
- After completing a word, start a new round automatically
- **First player to reach 200 points wins the competition!**
- Live leaderboard updates every 3 seconds

## 📸 Screenshot Feature

Click the "📸 Screenshot" button at any time to capture your game board and save it as an image. Perfect for sharing your results on social media!

## 🏗️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB Atlas
- **Screenshot**: html2canvas
- **Deployment**: Vercel-ready
- **Testing**: Jest, React Testing Library

## 📁 Project Structure

```
wordle/
├── app/
│   ├── api/
│   │   ├── room/
│   │   │   ├── create/route.ts    # Create competition room
│   │   │   ├── join/route.ts      # Join competition room
│   │   │   ├── update/route.ts    # Update player progress
│   │   │   └── status/route.ts    # Get room status
│   │   ├── validate/route.ts      # Validate guesses
│   │   └── word/route.ts          # Get daily word
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                   # Main app entry
├── components/
│   ├── GameBoard.tsx              # Game grid display
│   ├── GameContainerSolo.tsx      # Solo game logic
│   ├── GameContainerMultiplayer.tsx # Multiplayer game logic
│   ├── Keyboard.tsx               # Virtual keyboard
│   ├── Leaderboard.tsx            # Competition leaderboard
│   ├── Modal.tsx                  # End game modal
│   └── ModeSelector.tsx           # Game mode selection
├── lib/
│   └── mongodb.ts                 # Database connection
├── scripts/
│   └── seedWords.js               # Database seeding script
├── .env.local                     # Environment variables (create this)
├── .env.example                   # Environment template
└── package.json
```

## 🚀 Deployment to Vercel

1. **Push to GitHub** (already done!)
   ```bash
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Connect your GitHub account
   - Select the `wordle` repository
   - Configure environment variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `MONGODB_DB`: `wordle`
   - Click "Deploy"

3. **Done!** Your Wordle game is now live! 🎉

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 📊 Database Collections

### `words` Collection
```javascript
{
  _id: ObjectId,
  word: String,           // 5-letter word in uppercase
  difficulty: String,     // 'easy', 'medium', or 'hard'
  createdAt: Date
}
```

### `rooms` Collection
```javascript
{
  _id: ObjectId,
  roomCode: String,       // 6-character unique code
  difficulty: String,
  targetWord: String,
  players: [
    {
      name: String,
      score: Number,
      attempts: Number,
      completed: Boolean,
      guesses: [String],
      joinedAt: Date
    }
  ],
  createdAt: Date,
  expiresAt: Date        // 24 hours from creation
}
```

## 🎯 Scoring System

Points are awarded based on the number of attempts:
- **6 points**: Solved in 1 attempt (perfect!)
- **5 points**: Solved in 2 attempts
- **4 points**: Solved in 3 attempts
- **3 points**: Solved in 4 attempts
- **2 points**: Solved in 5 attempts
- **1 point**: Solved in 6 attempts
- **0 points**: Failed to solve

**Win Condition**: First player to reach **200 points** wins the competition!

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Inspired by the original Wordle game by Josh Wardle
- Built with ❤️ using Next.js and MongoDB

## 📞 Support

If you encounter any issues:
1. Check that MongoDB connection string is correct in `.env.local`
2. Ensure database is seeded: `npm run seed`
3. Check browser console for errors
4. Open an issue on GitHub

---

**Enjoy playing Wordle! 🎮✨**

Repository: https://github.com/MayankMehra7/wordle
