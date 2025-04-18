import { NextResponse } from 'next/server';

const WEBHOOK_GET = process.env.NEXT_PUBLIC_N8N_WEBHOOK_GET_PROD as string;

export async function GET() {
  try {
    const response = await fetch(WEBHOOK_GET);

    if (!response.ok) {
      throw new Error('Failed to fetch newsletters');
    }

    const data = await response.json();

    console.log("Fetched from webhook:", data);

    const mapped = Array.isArray(data)
      ? data.map((item: any) => ({
          ...item,
          id: item._id,  
        }))
      : [];

    return NextResponse.json(mapped);
  } catch (error) {
    console.error('Error fetching newsletters:', error);
    return NextResponse.json([], { status: 500 });
  }
}
