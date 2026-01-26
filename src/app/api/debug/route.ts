
import { streamlineRequest } from '@/lib/streamline';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { method, ...params } = body;

        if (!method) {
            return NextResponse.json({ error: 'Method required' }, { status: 400 });
        }

        const data = await streamlineRequest(method, params);
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
