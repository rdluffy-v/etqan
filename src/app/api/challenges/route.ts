import { NextRequest, NextResponse } from 'next/server';
import { getChallengesServer, submitChallengeServer } from '@/lib/d1-server';

export async function GET() {
  try {
    const challenges = await getChallengesServer();
    return NextResponse.json({ success: true, challenges });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { challengeId, user, data } = body;

    if (!challengeId || !user || !data) {
      return NextResponse.json(
        { success: false, error: 'challengeId, user, and data are required' },
        { status: 400 }
      );
    }

    const submission = await submitChallengeServer(challengeId, user, data);
    return NextResponse.json({ success: true, submission });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
