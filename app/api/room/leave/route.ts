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

        // Remove player from the room
        await roomsCollection.updateOne(
            { roomCode: roomCode.toUpperCase() },
            {
                $pull: {
                    players: { name: playerName }
                } as any
            }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error leaving room:', error);
        return NextResponse.json(
            { error: 'Failed to leave room' },
            { status: 500 }
        );
    }
}
