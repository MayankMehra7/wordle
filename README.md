# 🎮 Wordle Game - Multiplayer Edition

A feature-rich Wordle clone built with Next.js, TypeScript, MongoDB, and Tailwind CSS. Play solo or compete with friends in real-time!

## ✨ Features

### 🎯 Core Gameplay
- **6 Attempts**: Guess the 5-letter word in 6 tries
- **Color-Coded Feedback**:
  - 🟩 Green: Letter in correct position
  - 🟨 Yellow: Letter in word but wrong position
  - ⬜ Gray: Letter not in word
- **Virtual & Physical Keyboard**: Click on-screen or use your keyboard
- **Daily Word**: Everyone gets the same word each day

### 🎚️ Difficulty Levels
- **Easy**: 657 common words
- **Medium**: 368 moderate difficulty words
- **Hard**: 113 challenging words with tricky patterns
- **Total**: 1,138 five-letter words!

### 🏆 Multiplayer Competition Mode
- **Create Room**: Generate a unique 6-character room code
- **Join Room**: Enter a code to join friends
- **Real-time Leaderboard**: See who's winning live
- **Scoring System**: Fewer attempts = more points (max 6 points)
- **Same Word**: All players in a room get the same word

### 📸 Screenshot Feature
- Capture your game results
- Share your victories
- Download as PNG image

### 🌍 Daily Word System
- All solo players worldwide get the same word per difficulty each day
- Changes daily at midnight
- Fair competition for everyone

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

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=wordle
```

4. **Seed the database**
```bash
npm run seed
```

This will populate your MongoDB with 1,138 five-letter words across all difficulty levels.

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎮 How to Play

### Solo Mode
1. Click "Play Solo" from the main menu
2. Select difficulty (Easy/Medium/Hard)
3. Start guessing!
4. Everyone playing solo gets the same daily word

### Multiplayer Competition
1. Click "Create Competition" or "Join Competition"
2. **To Create**:
   - Enter your name
   - Choose difficulty
   - Share the 6-character room code with friends
3. **To Join**:
   - Enter your name
   - Enter the room code from your friend
4. Compete to solve the word in fewer attempts!
5. Watch the leaderboard update in real-time

## 📊 Scoring System (Multiplayer)

Points are awarded based on how many attempts it takes to solve:
- Solve in 1 attempt: **6 points** 🏆
- Solve in 2 attempts: **5 points**
- Solve in 3 attempts: **4 points**
- Solve in 4 attempts: **3 points**
- Solve in 5 attempts: **2 points**
- Solve in 6 attempts: **1 point**
- Failed to solve: **0 points**

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB Atlas
- **Screenshot**: html2canvas
- **Deployment**: Vercel-ready

## 📁 Project Structure

```
wordle/
├── app/
│   ├── api/
│   │   ├── room/
│   │   │   ├── create/route.ts    # Create competition room
│   │   │   ├── join/route.ts      # Join competition room
│   │   │   ├── update/route.ts    # Update player progress
│   │   │   └── status/route.ts    # Get leaderboard
│   │   ├── validate/route.ts      # Validate guesses
│   │   └── word/route.ts          # Get daily word
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                   # Main entry point
├── components/
│   ├── GameBoard.tsx              # 6x5 game grid
│   ├── GameContainer.tsx          # Main game logic
│   ├── Keyboard.tsx               # Virtual keyboard
│   ├── Leaderboard.tsx            # Multiplayer leaderboard
│   ├── Modal.tsx                  # End game modal
│   └── ModeSelector.tsx           # Game mode selection
├── lib/
│   ├── mongodb.ts                 # Database connection
│   └── screenshot.ts              # Screenshot utilities
├── scripts/
│   └── seedWords.js               # Database seeding script
└── .env.local                     # Environment variables
```

## 🚀 Deployment to Vercel

1. **Push to GitHub** (already done!)

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Choose the `wordle` folder as root directory

3. **Add Environment Variables**:
   - `MONGODB_URI`: Your MongoDB connection string
   - `MONGODB_DB`: `wordle`

4. **Deploy!**
   - Vercel will automatically build and deploy
   - Your app will be live in minutes

## 🎨 Features Breakdown

### Database Collections

**words** collection:
```javascript
{
  _id: ObjectId,
  word: "HELLO",
  difficulty: "easy",
  createdAt: Date
}
```

**rooms** collection:
```javascript
{
  roomCode: "ABC123",
  difficulty: "medium",
  targetWord: "HELLO",
  players: [
    {
      name: "Player1",
      score: 5,
      attempts: 2,
      completed: true,
      guesses: ["WORLD", "HELLO"],
      joinedAt: Date
    }
  ],
  createdAt: Date,
  expiresAt: Date
}
```

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run seed         # Seed database with words
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
```

## 🎯 API Endpoints

- `GET /api/word?difficulty=easy` - Get daily word
- `POST /api/validate` - Validate a guess
- `POST /api/room/create` - Create competition room
- `POST /api/room/join` - Join competition room
- `POST /api/room/update` - Update player progress
- `GET /api/room/status?roomCode=ABC123` - Get room status

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Inspired by the original Wordle by Josh Wardle
- Word list curated from common English words
- Built with ❤️ using Next.js and MongoDB

## 📞 Support

If you encounter any issues:
1. Check that MongoDB is properly connected
2. Ensure you've run `npm run seed`
3. Verify environment variables are set correctly
4. Check the browser console for errors

---

**Enjoy playing Wordle! 🎮**

Made with 💚 by [MayankMehra7](https://github.com/MayankMehra7)
