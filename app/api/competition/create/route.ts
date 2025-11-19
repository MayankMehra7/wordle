import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

// Generate a random 6-character code
function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(request: Request) {
  try {
    const { playerName, difficulty } = await request.json();

    if (!playerName || !difficulty) {
      return NextResponse.json(
        { error: 'Player name and difficulty are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const collection = db.collection('competitions');

    // Generate unique code
    let code = generateCode();
    let existing = await collection.findOne({ code });
    
    while (existing) {
      code = generateCode();
      existing = await collection.findOne({ code });
    }

    // Get today's word for this difficulty
    const wordsCollection = db.collection('words');
    const dailySeed = getDailySeed();
    const count = await wordsCollection.countDocuments({ difficulty });
    const dailyIndex = dailySeed % count;
    
    const words = await wordsCollection
      .find({ difficulty })
      .skip(dailyIndex)
      .limit(1)
      .toArray();

    if (words.length === 0) {
      return NextResponse.json(
        { error: 'Failed to fetch word' },
        { status: 500 }
      );
    }

    const targetWord = words[0].word;

    // Create competition
    const competition = {
      code,
      difficulty,
      targetWord,
      createdAt: new Date(),
      players: [
        {
          name: playerName,
          guesses: [],
          completed: false,
          attempts: 0,
          won: false,
          score: 0
        }
      ]
    };

    await collection.insertOne(competition);

    return NextResponse.json({
      code,
      difficulty,
      playerName
    });
  } catch (error) {
    console.error('Error creating competition:', error);
    return NextResponse.json(
      { error: 'Failed to create competition' },
      { status: 500 }
    );
  }
}

function getDailySeed(): number {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  return year * 10000 + month * 100 + day;
}
