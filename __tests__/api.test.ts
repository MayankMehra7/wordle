/**
 * API endpoint tests
 * Tests the /api/word and /api/validate endpoints
 */

import { NextRequest } from 'next/server';

// Mock MongoDB
jest.mock('@/lib/mongodb', () => ({
  connectToDatabase: jest.fn(),
}));

describe('API Endpoints', () => {
  describe('GET /api/word', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('returns a random word successfully', async () => {
      const { connectToDatabase } = require('@/lib/mongodb');
      
      // Mock database response
      const mockCollection = {
        countDocuments: jest.fn().mockResolvedValue(100),
        find: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          toArray: jest.fn().mockResolvedValue([
            { _id: '123', word: 'HELLO', createdAt: new Date() }
          ]),
        }),
      };

      connectToDatabase.mockResolvedValue({
        db: {
          collection: jest.fn().mockReturnValue(mockCollection),
        },
      });

      const { GET } = require('@/app/api/word/route');
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('word');
      expect(data).toHaveProperty('wordId');
      expect(data.word).toBe('HELLO');
      expect(mockCollection.countDocuments).toHaveBeenCalled();
    });

    test('returns error when no words in database', async () => {
      const { connectToDatabase } = require('@/lib/mongodb');
      
      const mockCollection = {
        countDocuments: jest.fn().mockResolvedValue(0),
      };

      connectToDatabase.mockResolvedValue({
        db: {
          collection: jest.fn().mockReturnValue(mockCollection),
        },
      });

      const { GET } = require('@/app/api/word/route');
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toHaveProperty('error');
    });

    test('handles database connection errors', async () => {
      const { connectToDatabase } = require('@/lib/mongodb');
      
      connectToDatabase.mockRejectedValue(new Error('Connection failed'));

      const { GET } = require('@/app/api/word/route');
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toHaveProperty('error');
    });
  });

  describe('POST /api/validate', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('validates correct guess', async () => {
      const { POST } = require('@/app/api/validate/route');
      
      const request = {
        json: jest.fn().mockResolvedValue({
          guess: 'HELLO',
          targetWord: 'HELLO',
        }),
      } as unknown as NextRequest;

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.isCorrect).toBe(true);
      expect(data.feedback).toEqual(['correct', 'correct', 'correct', 'correct', 'correct']);
    });

    test('validates incorrect guess with feedback', async () => {
      const { POST } = require('@/app/api/validate/route');
      
      const request = {
        json: jest.fn().mockResolvedValue({
          guess: 'WORLD',
          targetWord: 'HELLO',
        }),
      } as unknown as NextRequest;

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.isCorrect).toBe(false);
      expect(data.feedback).toHaveLength(5);
      expect(data.feedback).toContain('correct'); // L at position 3
      expect(data.feedback).toContain('present'); // O at position 1
    });

    test('returns error for missing guess', async () => {
      const { POST } = require('@/app/api/validate/route');
      
      const request = {
        json: jest.fn().mockResolvedValue({
          targetWord: 'HELLO',
        }),
      } as unknown as NextRequest;

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
    });

    test('returns error for missing targetWord', async () => {
      const { POST } = require('@/app/api/validate/route');
      
      const request = {
        json: jest.fn().mockResolvedValue({
          guess: 'HELLO',
        }),
      } as unknown as NextRequest;

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
    });

    test('returns error for invalid guess length', async () => {
      const { POST } = require('@/app/api/validate/route');
      
      const request = {
        json: jest.fn().mockResolvedValue({
          guess: 'HI',
          targetWord: 'HELLO',
        }),
      } as unknown as NextRequest;

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
    });

    test('handles case insensitive input', async () => {
      const { POST } = require('@/app/api/validate/route');
      
      const request = {
        json: jest.fn().mockResolvedValue({
          guess: 'hello',
          targetWord: 'HELLO',
        }),
      } as unknown as NextRequest;

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.isCorrect).toBe(true);
    });

    test('handles duplicate letters correctly', async () => {
      const { POST } = require('@/app/api/validate/route');
      
      const request = {
        json: jest.fn().mockResolvedValue({
          guess: 'SPEED',
          targetWord: 'ERASE',
        }),
      } as unknown as NextRequest;

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.feedback[2]).toBe('present'); // First E
      expect(data.feedback[3]).toBe('absent'); // Second E (already used)
    });
  });
});
