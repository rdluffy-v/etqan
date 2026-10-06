import { NextRequest, NextResponse } from 'next/server';
import { getBountiesServer, createBountyServer } from '@/lib/d1-server';

export async function GET() {
  try {
    const bounties = await getBountiesServer();
    return NextResponse.json({ success: true, bounties });
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
    const { bounty } = body;

    if (!bounty) {
      return NextResponse.json({ success: false, error: 'Bounty data required' }, { status: 400 });
    }

    await createBountyServer(bounty);
    return NextResponse.json({ success: true, bounty });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
