import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

// Get today's date as a seed for consistent daily word
function getDailySeed(): number {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  // Create a unique number for each day
  return year * 10000 + month * 100 + day;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get('difficulty') || 'medium'; // Default to medium
    
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

    // Use daily seed to get the same word for all users today
    const dailySeed = getDailySeed();
    const dailyIndex = dailySeed % count;
    
    const words = await collection
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

    const word = words[0];

    return NextResponse.json({
      word: word.word,
      wordId: word._id.toString(),
      difficulty: word.difficulty,
      date: new Date().toISOString().split('T')[0] // Return today's date
    });
  } catch (error) {
    console.error('Error fetching word:', error);
    return NextResponse.json(
      { error: 'Failed to fetch word from database' },
      { status: 500 }
    );
  }
}
