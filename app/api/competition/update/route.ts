import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { code, playerName, guesses, completed, won, attempts } = await request.json();

    if (!code || !playerName) {
      return NextResponse.json(
        { error: 'Code and player name are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const collection = db.collection('competitions');

    // Calculate score (lower is better)
    // Win: 7 - attempts, Loss: 0
    const score = won ? (7 - attempts) : 0;

    // Update player data
    await collection.updateOne(
      { code: code.toUpperCase(), 'players.name': playerName },
      {
        $set: {
          'players.$.guesses': guesses,
          'players.$.completed': completed,
          'players.$.won': won,
          'players.$.attempts': attempts,
          'players.$.score': score
        }
      }
    );

    // Get updated competition
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
      players: sortedPlayers
    });
  } catch (error) {
    console.error('Error updating competition:', error);
    return NextResponse.json(
      { error: 'Failed to update competition' },
      { status: 500 }
    );
  }
}
