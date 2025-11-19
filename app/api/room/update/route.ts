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

    // Get current room to check player's current score
    const room = await roomsCollection.findOne({ roomCode: roomCode.toUpperCase() });
    
    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    const player = room.players.find((p: any) => p.name === playerName);
    const currentScore = player?.score || 0;

    // Calculate points for this round (lower attempts = more points: 7 - attempts, max 6 points)
    const roundPoints = completed ? Math.max(0, 7 - attempts) : 0;
    const newScore = currentScore + roundPoints;

    // Update player data
    await roomsCollection.updateOne(
      { roomCode: roomCode.toUpperCase(), 'players.name': playerName },
      {
        $set: {
          'players.$.guesses': guesses,
          'players.$.completed': completed,
          'players.$.attempts': attempts,
          'players.$.score': newScore,
          'players.$.lastUpdated': new Date()
        }
      }
    );

    // Get updated room data
    const updatedRoom = await roomsCollection.findOne({ roomCode: roomCode.toUpperCase() });

    if (!updatedRoom) {
      return NextResponse.json(
        { error: 'Room not found after update' },
        { status: 404 }
      );
    }

    // Sort players by score (descending)
    const sortedPlayers = updatedRoom.players.sort((a: any, b: any) => b.score - a.score);

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
