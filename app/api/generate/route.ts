import { NextRequest, NextResponse } from 'next/server';

const WEBHOOK_GENERATE = process.env.NEXT_PUBLIC_N8N_WEBHOOK_GENERATE_PROD as string;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { id, lastGenerated, docId } = body;

    if (!id) {
      return NextResponse.json({ message: 'ID is required' }, { status: 400 });
    }

    const response = await fetch(WEBHOOK_GENERATE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        lastGenerated,
        docId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to call generation webhook');
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error generating newsletter:', error);
    return NextResponse.json({ message: 'Error generating newsletter', error }, { status: 500 });
  }
}
