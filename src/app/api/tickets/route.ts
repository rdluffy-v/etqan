import { NextRequest, NextResponse } from 'next/server';
import { getUserTicketsServer } from '@/lib/d1-server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId is required' }, { status: 400 });
    }

    const tickets = await getUserTicketsServer(userId);
    return NextResponse.json({ success: true, tickets });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
