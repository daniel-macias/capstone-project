import { NewsletterConfig } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';

let demoNewsletters: NewsletterConfig[] = [
  {
    id: 'demo1',
    name: 'Cybersecurity Weekly',
    description: 'Weekly roundup of top security news.',
    feeds: ['https://krebsonsecurity.com/feed/'],
    keywords: ['malware', 'zero-day'],
    category: 'Cybersecurity',
    dateRange: 'Past Week',
    frequency: 'Weekly',
    outputFormat: 'docx',
    cloudStorage: 'GoogleDrive',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo2',
    name: 'AI Digest',
    description: 'Daily updates on AI trends and tools.',
    feeds: ['https://ai.googleblog.com/feeds/posts/default'],
    keywords: ['GPT', 'Machine Learning'],
    category: 'AI',
    dateRange: 'Past 24h',
    frequency: 'Daily',
    outputFormat: 'markdown',
    cloudStorage: 'None',
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  return NextResponse.json(demoNewsletters);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    demoNewsletters.push(body);
    return NextResponse.json({ message: 'Newsletter created successfully', data: body }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Invalid request', error }, { status: 400 });
  }
}
