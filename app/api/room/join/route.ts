import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { roomCode, playerName } = await request.json();

    if (!roomCode || !playerName) {
      return NextResponse.json(
        { error: 'Room code and player name are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const roomsCollection = db.collection('rooms');

    // Find room
    const room = await roomsCollection.findOne({ roomCode: roomCode.toUpperCase() });

    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    // Check if room is expired
    if (new Date() > new Date(room.expiresAt)) {
      return NextResponse.json(
        { error: 'Room has expired' },
        { status: 410 }
      );
    }

    // Check if player already exists
    const existingPlayer = room.players.find((p: any) => p.name === playerName);
    if (existingPlayer) {
      return NextResponse.json(
        { error: 'Player name already taken in this room' },
        { status: 409 }
      );
    }

    // Add player to room
    const newPlayer = {
      name: playerName,
      score: 0,
      attempts: 0,
      completed: false,
      guesses: [],
      joinedAt: new Date()
    };

    await roomsCollection.updateOne(
      { roomCode: roomCode.toUpperCase() },
      { $push: { players: newPlayer } } as any
    );

    return NextResponse.json({
      roomCode: room.roomCode,
      targetWord: room.targetWord,
      difficulty: room.difficulty,
      players: [...room.players, newPlayer]
    });
  } catch (error) {
    console.error('Error joining room:', error);
    return NextResponse.json(
      { error: 'Failed to join room' },
      { status: 500 }
    );
  }
}
