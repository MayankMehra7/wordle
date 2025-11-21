import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const roomCode = searchParams.get('roomCode');

    if (!roomCode) {
      return NextResponse.json(
        { error: 'Room code is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const roomsCollection = db.collection('rooms');

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
      roomCode: room.roomCode,
      difficulty: room.currentDifficulty || room.difficulty,
      currentDifficulty: room.currentDifficulty || room.difficulty,
      roundNumber: room.roundNumber || 0,
      players: sortedPlayers,
      targetWord: room.targetWord, // Send target word so clients can update if round changed
      createdAt: room.createdAt,
      expiresAt: room.expiresAt
    });
  } catch (error) {
    console.error('Error fetching room status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch room status' },
      { status: 500 }
    );
  }
}
