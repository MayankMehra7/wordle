import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get('difficulty') || 'easy'; // Default to easy
    
    // Validate difficulty
    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return NextResponse.json(
        { error: 'Invalid difficulty level. Use: easy, medium, or hard' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const collection = db.collection('words');

    // Get count for specific difficulty
    const count = await collection.countDocuments({ difficulty });
    
    if (count === 0) {
      return NextResponse.json(
        { error: `No ${difficulty} words available in database` },
        { status: 500 }
      );
    }

    // Get random word with specific difficulty
    const randomIndex = Math.floor(Math.random() * count);
    const words = await collection
      .find({ difficulty })
      .skip(randomIndex)
      .limit(1)
      .toArray();
    
    if (words.length === 0) {
      return NextResponse.json(
        { error: 'Failed to fetch word' },
        { status: 500 }
      );
    }

    const word = words[0];

    return NextResponse.json({
      word: word.word,
      wordId: word._id.toString(),
      difficulty: word.difficulty
    });
  } catch (error) {
    console.error('Error fetching word:', error);
    return NextResponse.json(
      { error: 'Failed to fetch word from database' },
      { status: 500 }
    );
  }
}
