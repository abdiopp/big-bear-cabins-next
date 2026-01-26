// app/api/properties/route.ts
import { streamlineRequest } from '@/lib/streamline';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const body = await req.json();

    // If a specific ID is requested, use GetPropertyInfo to ensure we get that exact unit
    // nicely handling the "don't fetch all and filter locally" requirement by fetching just one.
    if (body.id) {
        try {
            const data = await streamlineRequest('GetPropertyInfo', { unit_id: body.id });
            // GetPropertyInfo returns { data: { ...property properties... } }
            // GetPropertyList returns { data: { property: [ ... ] } }
            // We need to normalize the response to match GetPropertyList structure for the frontend
            if (data.data) {
                return NextResponse.json({
                    data: {
                        property: [data.data]
                    }
                });
            }
            return NextResponse.json({ data: { property: [] } });
        } catch (e) {
            console.error("Failed to fetch specific property info:", e);
            return NextResponse.json({ data: { property: [] } });
        }
    }

    const params: any = {
        sort_by: 'price_daily_low',
        return_gallery: 1,
        return_amenities: 1,
        max_images_number: 10,
        page_results_number: 12, // Default page size
        ...body // Allow overriding/adding any params from the request body
    };

    if (body.page) {
        params.page_number = body.page;
    }

    // streamlineRequest handles token management
    const data = await streamlineRequest('GetPropertyList', params);

    return NextResponse.json(data);
}
