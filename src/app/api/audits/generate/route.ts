import { NextRequest, NextResponse } from 'next/server';
import { evaluateDeterministicAudit } from '@/lib/audit-engine';
import { DEMO_COMMITMENTS, DEMO_OBSERVATIONS } from '@/lib/demo-data';
import { CityId } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { commitmentId, cityId } = body;

    if (!commitmentId) {
      return NextResponse.json(
        { error: 'Missing commitmentId in request body' },
        { status: 400 }
      );
    }

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

    const auditResult = evaluateDeterministicAudit({
      commitment,
      observations,
      cityId: (cityId || commitment.cityId) as CityId,
    });

    return NextResponse.json({
      success: true,
      audit: auditResult,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Audit execution error:', error);
    return NextResponse.json(
      { error: 'Failed to execute deterministic audit: ' + error.message },
      { status: 500 }
    );
  }
}

