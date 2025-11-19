import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

// Generate random 6-character room code
function generateRoomCode(): string {
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
    const roomsCollection = db.collection('rooms');

    // Generate unique room code
    let roomCode = generateRoomCode();
    let existingRoom = await roomsCollection.findOne({ roomCode });
    
    while (existingRoom) {
      roomCode = generateRoomCode();
      existingRoom = await roomsCollection.findOne({ roomCode });
    }

    // Get first word (always easy for round 0)
    const wordsCollection = db.collection('words');
    const firstDifficulty = 'easy';
    const count = await wordsCollection.countDocuments({ difficulty: firstDifficulty });
    const randomIndex = Math.floor(Math.random() * count);
    
    const words = await wordsCollection
      .find({ difficulty: firstDifficulty })
      .skip(randomIndex)
      .limit(1)
      .toArray();

    if (words.length === 0) {
      return NextResponse.json(
        { error: 'Failed to fetch word' },
        { status: 500 }
      );
    }

    const targetWord = words[0].word;

    // Create room - start with easy difficulty (round 0)
    const room = {
      roomCode,
      difficulty: 'easy', // First round is always easy
      currentDifficulty: 'easy',
      targetWord,
      roundNumber: 0,
      players: [
        {
          name: playerName,
          score: 0,
          attempts: 0,
          completed: false,
          guesses: [],
          joinedAt: new Date()
        }
      ],
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };

    await roomsCollection.insertOne(room);

    return NextResponse.json({
      roomCode,
      targetWord,
      difficulty: 'easy',
      currentDifficulty: 'easy',
      roundNumber: 0
    });
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { error: 'Failed to create room' },
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
