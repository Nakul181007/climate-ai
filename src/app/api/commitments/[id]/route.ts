import { NextRequest, NextResponse } from 'next/server';
import { DEMO_COMMITMENTS, DEMO_OBSERVATIONS, DEMO_AUDITS } from '@/lib/demo-data';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const commitmentId = params.id;
  const commitment = DEMO_COMMITMENTS.find((c) => c.id === commitmentId);

  if (!commitment) {
    return NextResponse.json(
      { error: 'Commitment not found in statutory register' },
      { status: 404 }
    );
  }

  const observations = DEMO_OBSERVATIONS.filter(
    (o) => o.commitmentId === commitmentId
  );
  const audit = DEMO_AUDITS.find((a) => a.commitmentId === commitmentId);

  return NextResponse.json({
    success: true,
    commitment,
    observations,
    audit: audit || null,
  });
}

