import { NextRequest, NextResponse } from 'next/server';
import { DEMO_AUDITS, DEMO_COMMITMENTS } from '@/lib/demo-data';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auditId = params.id;
  const audit = DEMO_AUDITS.find((a) => a.id === auditId);

  if (!audit) {
    return NextResponse.json(
      { error: 'Audit record not found' },
      { status: 404 }
    );
  }

  const commitment = DEMO_COMMITMENTS.find((c) => c.id === audit.commitmentId);

  return NextResponse.json({
    success: true,
    audit,
    commitment: commitment || null,
  });
}

