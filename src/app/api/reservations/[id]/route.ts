// app/api/reservations/[id]/route.ts
import { getReservationInfo } from '@/lib/streamline';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const confirmationId = parseInt(id);

        if (isNaN(confirmationId)) {
            return NextResponse.json(
                { error: 'Invalid confirmation ID' },
                { status: 400 }
            );
        }

        const data = await getReservationInfo(confirmationId);

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error fetching reservation info:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch reservation info' },
            { status: 500 }
        );
    }
}
