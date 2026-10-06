import { NextRequest, NextResponse } from 'next/server';
import { getWorkshopsServer, bookWorkshopServer, scheduleWorkshopServer } from '@/lib/d1-server';

export async function GET() {
  try {
    const workshops = await getWorkshopsServer();
    return NextResponse.json({ success: true, workshops });
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
    const { action } = body;

    if (action === 'book') {
      const { workshopId, user } = body;
      if (!workshopId || !user) {
        return NextResponse.json(
          { success: false, error: 'workshopId and user are required' },
          { status: 400 }
        );
      }
      const ticket = await bookWorkshopServer(workshopId, user);
      if (!ticket) {
        return NextResponse.json(
          { success: false, error: 'Could not book seat' },
          { status: 400 }
        );
      }
      return NextResponse.json({ success: true, ticket });
    }

    if (action === 'schedule') {
      const { workshop } = body;
      if (!workshop) {
        return NextResponse.json(
          { success: false, error: 'workshop data required' },
          { status: 400 }
        );
      }
      await scheduleWorkshopServer(workshop);
      return NextResponse.json({ success: true, workshop });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
