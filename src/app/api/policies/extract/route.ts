import { NextRequest, NextResponse } from 'next/server';
import { extractCommitmentsWithGemini } from '@/lib/ai/gemini';
import { CityId } from '@/lib/types';
import pdfParse from 'pdf-parse';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let documentName = '';
    let documentText = '';
    let cityId: CityId = 'mumbai';
    let pageCount = 1;
    let fileSizeMb = 0;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      cityId = (formData.get('cityId') as CityId) || 'mumbai';

      if (!file) {
        return NextResponse.json(
          { error: 'No file uploaded in form data' },
          { status: 400 }
        );
      }

      documentName = file.name;
      fileSizeMb = Number((file.size / (1024 * 1024)).toFixed(2));

      if (file.name.toLowerCase().endsWith('.pdf')) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        try {
          const pdfData = await pdfParse(buffer);
          documentText = pdfData.text || '';
          pageCount = pdfData.numpages || 1;
        } catch (pdfErr: any) {
          console.error('PDF parsing error:', pdfErr);
          return NextResponse.json({
            success: false,
            extractionIncomplete: true,
            error: `PDF extraction failed: ${pdfErr.message || 'Unable to parse document binary'}. The file may be password-protected or corrupt.`,
            documentName,
            fileSizeMb,
          }, { status: 422 });
        }
      } else if (file.name.toLowerCase().endsWith('.txt')) {
        documentText = await file.text();
        pageCount = Math.max(1, Math.ceil(documentText.length / 3000));
      } else {
        return NextResponse.json(
          { error: 'Unsupported file format. Please upload a PDF or TXT policy document.' },
          { status: 400 }
        );
      }

      // Check if extracted text is empty or too short (e.g. scanned image without OCR)
      if (documentText.trim().length < 50) {
        return NextResponse.json({
          success: false,
          extractionIncomplete: true,
          error: 'Document parsing yielded insufficient text (< 50 characters). The PDF appears to be a scanned raster image without an OCR text layer or an empty file. Automated extraction requires a digital text layer.',
          documentName,
          fileSizeMb,
          pageCount,
          extractedCharacters: documentText.trim().length,
        }, { status: 422 });
      }
    } else {
      // JSON payload
      const body = await req.json();
      documentName = body.documentName;
      documentText = body.documentText;
      cityId = (body.cityId as CityId) || 'mumbai';
      pageCount = body.pageCount || 1;

      if (!documentName || !documentText) {
        return NextResponse.json(
          { error: 'Missing required fields: documentName and documentText' },
          { status: 400 }
        );
      }
    }

    // Call extraction engine
    const extractionResult = await extractCommitmentsWithGemini(
      documentText,
      documentName,
      cityId
    );

    return NextResponse.json({
      success: true,
      extractedCommitments: extractionResult.commitments,
      isAiGenerated: extractionResult.isAiGenerated,
      modelUsed: extractionResult.modelUsed,
      extractionNotice: (extractionResult as any).extractionNotice,
      extractionError: (extractionResult as any).extractionError,
      documentName,
      fileSizeMb,
      pageCount,
      extractedCharacters: documentText.length,
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
