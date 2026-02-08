// app/api/reservations/route.ts
import {
    getReservations,
    makeReservation,
    getReservationInfo
} from '@/lib/streamline';
import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch reservations
export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;

        const params = {
            email: searchParams.get('email') || undefined,
            startdate: searchParams.get('startdate') || undefined,
            enddate: searchParams.get('enddate') || undefined,
            status_id: searchParams.get('status_id') ? parseInt(searchParams.get('status_id')!) : undefined,
            page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined
        };

        const data = await getReservations(params);

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error fetching reservations:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch reservations' },
            { status: 500 }
        );
    }
}

// POST - Create a new reservation
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Validate required fields
        const requiredFields = ['unit_id', 'startdate', 'enddate', 'email', 'occupants', 'first_name', 'last_name', 'zip', 'address', 'city', 'state', 'cell_phone'];
        const missingFields = requiredFields.filter(field => !body[field]);

        if (missingFields.length > 0) {
            return NextResponse.json(
                { error: `Missing required fields: ${missingFields.join(', ')}` },
                { status: 400 }
            );
        }

        // Create reservation with mock payment for testing
        const data = await makeReservation({
            unit_id: body.unit_id,
            startdate: body.startdate,
            enddate: body.enddate,
            email: body.email,
            occupants: body.occupants,
            first_name: body.first_name,
            last_name: body.last_name,
            zip: body.zip,
            address: body.address,
            city: body.city,
            state: body.state,
            cellphone: body.cell_phone,
            phone: body.phone,
            coupon_code: body.coupon_code,
            // Payment fields for testing - no real charge
            madetype_id: body.madetype_id || 9,
            type_id: body.type_id || 2,
            payment_type_id: body.payment_type_id || 1,
            status_id: body.status_id || 9,
            credit_card_amount: 0, // No charge for testing
            credit_card_charge_required: 0,
            referrer_url: body.referrer_url || 'https://bigbearcabins.com',
            payment_comments: body.payment_comments || 'Test reservation - no payment'
        });

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error creating reservation:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create reservation' },
            { status: 500 }
        );
    }
}
