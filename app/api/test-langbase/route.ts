import { NextResponse } from 'next/server';
import { retrieveRelevantDocuments } from '@/lib/langbase/retrieval';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const results = await retrieveRelevantDocuments(data);
    
    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error('Test failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Test failed' 
    }, { status: 500 });
  }
}