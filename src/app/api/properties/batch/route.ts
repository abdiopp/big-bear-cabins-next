import { NextResponse } from 'next/server';
import { streamlineRequest } from '@/lib/streamline';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { ids } = body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ data: { property: [] } });
        }

        // Fetch each property concurrently via streamline endpoint
        const propertyPromises = ids.map(async (id: string) => {
            try {
                const res = await streamlineRequest('GetPropertyInfo', { unit_id: id });
                if (res?.data) {
                    return res.data;
                }
                return null;
            } catch (err) {
                console.error(`Failed to fetch property info for ID: ${id}`, err);
                return null;
            }
        });

        const results = await Promise.all(propertyPromises);
        // Filter out nulls from failures
        const properties = results.filter(p => p !== null);

        return NextResponse.json({ data: { property: properties } });

    } catch (e) {
        console.error("❌ Batch Search API Error:", e);
        return NextResponse.json({ data: { property: [] }, error: String(e) }, { status: 500 });
    }
}
