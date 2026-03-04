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

        // Use streamlineRequest which auto-injects fresh tokens via getValidToken()
        const params = {
            unit_id: body.id,
            max_images_number: 100, // Fetch more images as requested
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
