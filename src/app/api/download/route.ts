import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  let filePath = path.join(process.cwd(), 'ClimateAI_Maharashtra_Complete_Platform_Walkthrough.pdf');
  
  if (!fs.existsSync(filePath)) {
    filePath = path.join(process.cwd(), 'ClimateAI_Maharashtra_Platform_Walkthrough.pdf');
  }

  if (!fs.existsSync(filePath)) {
    return new NextResponse('PDF documentation file not found.', { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="ClimateAI_Maharashtra_Complete_Platform_Walkthrough.pdf"',
      'Content-Length': fileBuffer.length.toString(),
      'Cache-Control': 'no-cache',
    },
  });
}

