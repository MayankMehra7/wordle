import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { code, playerName } = await request.json();

    if (!code || !playerName) {
      return NextResponse.json(
        { error: 'Code and player name are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const collection = db.collection('competitions');

    // Find competition
    const competition = await collection.findOne({ code: code.toUpperCase() });

    if (!competition) {
      return NextResponse.json(
        { error: 'Competition not found' },
        { status: 404 }
      );
    }

    // Check if player already exists
    const existingPlayer = competition.players.find(
      (p: any) => p.name.toLowerCase() === playerName.toLowerCase()
    );

    if (existingPlayer) {
      return NextResponse.json(
        { error: 'Player name already taken in this competition' },
        { status: 400 }
      );
    }

    // Add player
    const newPlayer = {
      name: playerName,
      guesses: [],
      completed: false,
      attempts: 0,
      won: false,
      score: 0
    };

    await collection.updateOne(
      { code: code.toUpperCase() },
      { $push: { players: newPlayer } }
    );

    return NextResponse.json({
      code: code.toUpperCase(),
      difficulty: competition.difficulty,
      playerName,
      targetWord: competition.targetWord
    });
  } catch (error) {
    console.error('Error joining competition:', error);
    return NextResponse.json(
      { error: 'Failed to join competition' },
      { status: 500 }
    );
  }
}
