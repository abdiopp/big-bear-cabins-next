// app/api/reservations/route.ts
import {
    getReservations,
    makeReservation,
    getReservationInfo,
    getReservationPrice
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

        // Determine payment type ID (Default to Credit Card = 1 or 2 depending on system)
        // This mapping might need adjustment based on specific system configuration
        const paymentTypeId = body.payment_type === 'credit-card' ? 1 : 1;

        // Calculate Total Price server-side to ensure security
        let totalAmount = 0;
        try {
            const priceData = await getReservationPrice({
                unit_id: body.unit_id,
                startdate: body.startdate,
                enddate: body.enddate,
                occupants: body.occupants
            });
            totalAmount = priceData.data.total;
        } catch (priceError) {
            console.error('Error fetching price for reservation:', priceError);
            // Fallback or fail? defaulting to 0 might verify availability but not charge correctly
            // Proceeding with 0 will rely on Streamline's internal logic or manual collection
        }

        // Create reservation
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

            // Payment fields
            payment_type_id: paymentTypeId,
            credit_card_number: body.credit_card_number,
            credit_card_cid: body.credit_card_cvv,
            credit_card_expiration_month: body.credit_card_expiration ? parseInt(body.credit_card_expiration.split('/')[0]) : undefined,
            credit_card_expiration_year: body.credit_card_expiration ? parseInt('20' + body.credit_card_expiration.split('/')[1]) : undefined,
            credit_card_amount: totalAmount,
            credit_card_charge_required: totalAmount > 0 ? 1 : 0,

            // Notes
            payment_comments: body.notes || 'Website Booking',

            // Pass through any optional fees if they were provided in a generic way
            // (Assumes body might have optional_fee_X)
            ...Object.keys(body).reduce((acc, key) => {
                if (key.startsWith('optional_fee_')) {
                    acc[key] = body[key];
                }
                return acc;
            }, {} as Record<string, any>)
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
