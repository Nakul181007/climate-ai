import { NextRequest, NextResponse } from 'next/server';
import { DEMO_AUDITS } from '@/lib/demo-data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cityId = searchParams.get('cityId');
  const outcome = searchParams.get('outcome');

  let list = DEMO_AUDITS;
  if (cityId) {
    list = list.filter((a) => a.cityId === cityId);
  }
  if (outcome) {
    list = list.filter((a) => a.outcome === outcome);
  }

  return NextResponse.json({
    success: true,
    audits: list,
    total: list.length,
  });
}

