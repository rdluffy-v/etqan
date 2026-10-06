import { NextResponse } from 'next/server';
import { isD1ServerConfigured } from '@/lib/d1-server';
import { isR1ServerConfigured } from '@/lib/r1-server';

export async function GET() {
  const firebaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    !process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes('YourFirebaseApiKeyHere')
  );

  const d1Configured = isD1ServerConfigured();
  const r1Configured = isR1ServerConfigured();

  return NextResponse.json({
    status: 'online',
    platform: 'منصة إتقان (Etqan Platform)',
    incubator: 'حاضنة بوصلة الجيل التقني',
    services: {
      firebaseAuth: {
        active: firebaseConfigured,
        mode: firebaseConfigured ? 'cloud_live' : 'demo_simulation',
      },
      cloudflareD1: {
        active: d1Configured,
        mode: d1Configured ? 'd1_remote_edge' : 'demo_simulation',
      },
      cloudflareR1: {
        active: r1Configured,
        mode: r1Configured ? 'r1_s3_storage' : 'demo_simulation',
      },
      vercel: {
        ready: true,
        nodeVersion: process.version,
      },
    },
    timestamp: new Date().toISOString(),
  });
}
