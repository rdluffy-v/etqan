import { NextRequest, NextResponse } from 'next/server';
import { getCoursesServer, getCourseByIdServer, addLessonServer } from '@/lib/d1-server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || undefined;
    const track = searchParams.get('track') || undefined;
    const search = searchParams.get('search') || undefined;
    const minCqsStr = searchParams.get('minCqs');
    const minCqs = minCqsStr ? parseFloat(minCqsStr) : undefined;

    if (id) {
      const course = await getCourseByIdServer(id);
      if (!course) {
        return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, course });
    }

    const courses = await getCoursesServer(track, search, minCqs);
    return NextResponse.json({ success: true, courses });
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

    if (action === 'add_lesson') {
      const { lesson } = body;
      if (!lesson || !lesson.courseId || !lesson.title || !lesson.videoR1Url) {
        return NextResponse.json(
          { success: false, error: 'courseId, title, and videoR1Url are required' },
          { status: 400 }
        );
      }

      if (Number(lesson.durationSeconds) > 1200) {
        return NextResponse.json(
          { success: false, error: 'معيار CQS يشترط ألا تتجاوز مدة الدرس 20 دقيقة (1200 ثانية)' },
          { status: 400 }
        );
      }

      const created = await addLessonServer({
        courseId: lesson.courseId,
        title: lesson.title,
        durationSeconds: Number(lesson.durationSeconds) || 900,
        videoR1Url: lesson.videoR1Url,
        transcript: lesson.transcript,
        vttSubtitlesAr: lesson.vttSubtitlesAr,
        vttSubtitlesEn: lesson.vttSubtitlesEn,
      });

      return NextResponse.json({ success: true, lesson: created });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
