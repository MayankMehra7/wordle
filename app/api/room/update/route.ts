import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { roomCode, playerName, guesses, completed, attempts } = await request.json();

    if (!roomCode || !playerName) {
      return NextResponse.json(
        { error: 'Room code and player name are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const roomsCollection = db.collection('rooms');

    // Calculate score (lower is better: 7 - attempts, max 6 points)
    const score = completed ? Math.max(0, 7 - attempts) : 0;

    // Update player data
    await roomsCollection.updateOne(
      { roomCode: roomCode.toUpperCase(), 'players.name': playerName },
      {
        $set: {
          'players.$.guesses': guesses,
          'players.$.completed': completed,
          'players.$.attempts': attempts,
          'players.$.score': score,
          'players.$.lastUpdated': new Date()
        }
      }
    );

    // Get updated room data
    const room = await roomsCollection.findOne({ roomCode: roomCode.toUpperCase() });

    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    // Sort players by score (descending)
    const sortedPlayers = room.players.sort((a: any, b: any) => b.score - a.score);

    return NextResponse.json({
      players: sortedPlayers
    });
  } catch (error) {
    console.error('Error updating room:', error);
    return NextResponse.json(
      { error: 'Failed to update room' },
      { status: 500 }
    );
  }
}
