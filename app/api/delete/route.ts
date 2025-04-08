import { NextRequest, NextResponse } from 'next/server';

const WEBHOOK_DELETE = process.env.NEXT_PUBLIC_N8N_WEBHOOK_DELETE_PROD as string;

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body._id) {
      return NextResponse.json({ message: 'ID is required.' }, { status: 400 });
    }

    const response = await fetch(WEBHOOK_DELETE, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: { id: body._id } }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error from webhook:', errorText);
      return NextResponse.json({ message: 'Webhook error', error: errorText }, { status: 500 });
    }

    return NextResponse.json({ message: 'Deleted successfully via webhook.' });

  } catch (error) {
    console.error('Error deleting newsletter:', error);
    return NextResponse.json({ message: 'Server error', error: String(error) }, { status: 500 });
  }
}
