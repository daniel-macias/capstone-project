import { NextRequest, NextResponse } from 'next/server';

const WEBHOOK_PATCH = process.env.NEXT_PUBLIC_N8N_WEBHOOK_PATCH_PROD;

export async function PATCH(req: NextRequest) {
  try {
    const data = await req.json();

    const response = await fetch(WEBHOOK_PATCH!, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const json = await response.json();
    return NextResponse.json(json);
  } catch (err) {
    console.error('[PATCH ERROR]', err);
    return NextResponse.json({ error: 'Error patching data' }, { status: 500 });
  }
}