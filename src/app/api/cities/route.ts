import { NextResponse } from 'next/server';
import { CITIES } from '@/lib/demo-data';

export async function GET() {
  return NextResponse.json({
    success: true,
    cities: CITIES,
    total: CITIES.length,
  });
}

