import generateNotionDatabase from '@/lib/notion';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const { apiKey, pageId } = await request.json();
    const res = await generateNotionDatabase(apiKey, pageId);
    console.log(res);

    return NextResponse.json(res);
}
