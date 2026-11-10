import { NextRequest, NextResponse } from 'next/server';
import { DEMO_POLICIES } from '@/lib/demo-data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cityId = searchParams.get('cityId');

  let list = DEMO_POLICIES;
  if (cityId) {
    list = list.filter((p) => p.cityId === cityId);
  }

  return NextResponse.json({
    success: true,
    policies: list,
    total: list.length,
  });
}

