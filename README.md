# Wordle Game

A 5-letter word guessing game built with Next.js, React, TypeScript, Tailwind CSS, and MongoDB.

## Features

- 6 attempts to guess a 5-letter word
- Visual feedback with color-coded tiles:
  - 🟩 Green: Letter in correct position
  - 🟨 Yellow: Letter in word but wrong position
  - ⬜ Gray: Letter not in word
- Virtual and physical keyboard support
- Automatic new game on correct guess
- 500+ five-letter words in database
- Responsive design for mobile and desktop

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB instance)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=wordle
```

4. Seed the database with words:
```bash
npm run seed
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Import your repository in Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository

3. Configure environment variables in Vercel:
   - Go to Project Settings → Environment Variables
   - Add `MONGODB_URI` with your MongoDB connection string
   - Add `MONGODB_DB` with value `wordle`

4. Deploy:
   - Vercel will automatically build and deploy your application
   - Make sure to run the seed script after first deployment to populate the database

5. Run seed script (one-time setup):
   - You can run the seed script locally with your production MongoDB URI
   - Or use Vercel CLI: `vercel env pull` then `npm run seed`

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── word/          # GET endpoint for random word
│   │   └── validate/      # POST endpoint for guess validation
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── GameBoard.tsx      # 6x5 grid display
│   ├── GameContainer.tsx  # Main game logic
│   ├── Keyboard.tsx       # Virtual keyboard
│   └── Modal.tsx          # End game modal
├── lib/
│   └── mongodb.ts         # Database connection
├── scripts/
│   └── seedWords.js       # Database seeding script
└── package.json

```

## Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **MongoDB**: Database for word storage
- **Vercel**: Deployment platform

## Game Rules

1. Guess the 5-letter word in 6 tries
2. Each guess must be a valid 5-letter word
3. After each guess, tiles change color to show how close you are:
   - Green: Letter is correct and in the right position
   - Yellow: Letter is in the word but in the wrong position
   - Gray: Letter is not in the word
4. Win by guessing the word correctly
5. Game automatically starts a new round after a correct guess

## License

MIT
