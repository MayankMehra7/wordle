import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: 'Code is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const collection = db.collection('competitions');

    const competition = await collection.findOne({ code: code.toUpperCase() });

    if (!competition) {
      return NextResponse.json(
        { error: 'Competition not found' },
        { status: 404 }
      );
    }

    // Sort players by score (descending)
    const sortedPlayers = competition.players.sort((a: any, b: any) => b.score - a.score);

    return NextResponse.json({
      code: competition.code,
      difficulty: competition.difficulty,
      targetWord: competition.targetWord,
      players: sortedPlayers
    });
  } catch (error) {
    console.error('Error fetching competition status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch competition status' },
      { status: 500 }
    );
  }
}
