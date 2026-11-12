import { NextRequest, NextResponse } from 'next/server';
import { evaluateDeterministicAudit, GENESIS_HASH } from '@/lib/audit-engine';
import { DEMO_COMMITMENTS, DEMO_OBSERVATIONS, DEMO_AUDITS } from '@/lib/demo-data';
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

    const targetCityId = (cityId || commitment.cityId) as CityId;
    const cityAudits = DEMO_AUDITS.filter((a) => a.cityId === targetCityId);
    const latestSeedAudit = cityAudits.length > 0 ? cityAudits[cityAudits.length - 1] : null;

    // Use caller-provided chain parameters if available; otherwise use the latest known seed block
    const previousHash = body.previousHash || latestSeedAudit?.auditHash || GENESIS_HASH;
    const blockNumber = typeof body.blockNumber === 'number' ? body.blockNumber : (cityAudits.length + 1);

    const auditResult = evaluateDeterministicAudit({
      commitment,
      observations,
      cityId: targetCityId,
      previousHash,
      blockNumber,
    });

    return NextResponse.json({
      success: true,
      audit: auditResult,
      chainMetadata: {
        blockNumber,
        previousHash,
        parentHashSource: body.previousHash
          ? 'caller_provided'
          : latestSeedAudit
          ? 'server_seed_head'
          : 'genesis_origin',
        storageNotice:
          'Evaluated deterministically. Browser localStorage demonstrator state and stateless Next.js API endpoints operate with independent caches in this prototype architecture.',
      },
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

