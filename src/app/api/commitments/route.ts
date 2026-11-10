import { NextRequest, NextResponse } from 'next/server';
import { DEMO_COMMITMENTS } from '@/lib/demo-data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cityId = searchParams.get('cityId');
  const sector = searchParams.get('sector');

  let list = DEMO_COMMITMENTS;

  if (cityId) {
    list = list.filter((c) => c.cityId === cityId);
  }
  if (sector) {
    list = list.filter((c) => c.sector === sector);
  }

  return NextResponse.json({
    success: true,
    commitments: list,
    total: list.length,
  });
}

