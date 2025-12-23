// app/api/properties/route.ts
import { streamlineRequest } from '@/lib/streamline';

export async function POST(req: Request) {
    const body = await req.json();

    const params: any = {
        sort_by: 'price_daily_low',
        return_gallery: 1,
        return_amenities: 1,
        max_images_number: 10,
        page_results_number: body.id ? 1 : 12
    };

    if (body.page) {
        params.page_number = body.page;
    }

    if (body.id) {
        params.id = body.id;
    }

    const data = await streamlineRequest('GetPropertyList', params);

    return Response.json(data);
}
