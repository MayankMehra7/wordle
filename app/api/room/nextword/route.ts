import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { roomCode } = await request.json();

    if (!roomCode) {
      return NextResponse.json(
        { error: 'Room code is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const roomsCollection = db.collection('rooms');
    const wordsCollection = db.collection('words');

    // Get room data
    const room = await roomsCollection.findOne({ roomCode: roomCode.toUpperCase() });

    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    // Determine next difficulty in rotation: easy -> medium -> hard -> easy...
    const roundNumber = room.roundNumber || 0;
    const difficulties = ['easy', 'medium', 'hard'];
    const nextDifficulty = difficulties[roundNumber % 3];

    // Get a random word of the next difficulty
    const count = await wordsCollection.countDocuments({ difficulty: nextDifficulty });
    const randomIndex = Math.floor(Math.random() * count);
    
    const words = await wordsCollection
      .find({ difficulty: nextDifficulty })
      .skip(randomIndex)
      .limit(1)
      .toArray();

    if (words.length === 0) {
      return NextResponse.json(
        { error: 'Failed to fetch word' },
        { status: 500 }
      );
    }

    const newWord = words[0].word;

    // Update room with new word and increment round number
    await roomsCollection.updateOne(
      { roomCode: roomCode.toUpperCase() },
      {
        $set: {
          targetWord: newWord,
          currentDifficulty: nextDifficulty,
          roundNumber: roundNumber + 1,
        },
      }
    );

    return NextResponse.json({
      word: newWord,
      difficulty: nextDifficulty,
      roundNumber: roundNumber + 1,
    });
  } catch (error) {
    console.error('Error fetching next word:', error);
    return NextResponse.json(
      { error: 'Failed to fetch next word' },
      { status: 500 }
    );
  }
}
