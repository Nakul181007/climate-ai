import { NextRequest, NextResponse } from 'next/server';
import { extractCommitmentsWithGemini } from '@/lib/ai/gemini';
import { CityId } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { documentText, documentName, cityId } = body;

    if (!documentName || !cityId) {
      return NextResponse.json(
        { error: 'Missing required fields: documentName and cityId' },
        { status: 400 }
      );
    }

    const extractionResult = await extractCommitmentsWithGemini(
      documentText || 'Statutory Climate Action Plan Policy Excerpt for Maharashtra Municipal Corporations.',
      documentName,
      cityId as CityId
    );

    return NextResponse.json({
      success: true,
      extractedCommitments: extractionResult.commitments,
      isAiGenerated: extractionResult.isAiGenerated,
      modelUsed: extractionResult.modelUsed,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Extraction API error:', error);
    return NextResponse.json(
      { error: 'Failed to extract commitments: ' + error.message },
      { status: 500 }
    );
  }
}

