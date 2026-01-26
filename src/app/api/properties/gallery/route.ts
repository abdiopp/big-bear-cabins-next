// app/api/properties/gallery/route.ts
import { streamlineRequest } from '@/lib/streamline';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        if (!body.id) {
            return NextResponse.json(
                { error: 'Property ID is required' },
                { status: 400 }
            );
        }

        // Use streamlineRequest directly to allow passing extra params from body
        const params = {
            unit_id: body.id,
            max_images_number: 100, // Fetch more images as requested
            token_key: "4f1aaf609ee539efd325373bc62b6698",
            token_secret: "79961e54d86d032b0f67aa6ed6deef5e230f50c4",
            ...body // Allow overriding/adding params
        };

        const data = await streamlineRequest('GetPropertyGalleryImages', params);

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error fetching property gallery:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch property gallery' },
            { status: 500 }
        );
    }
}
