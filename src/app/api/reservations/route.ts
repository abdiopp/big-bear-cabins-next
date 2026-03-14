// app/api/reservations/route.ts
import {
    getReservations,
    makeReservation,
    getReservationInfo,
    getPreReservationPrice
} from '@/lib/streamline';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

        if (data?.data?.reservations) {
            // Streamline returns a single object instead of array if there's only 1 reservation
            if (!Array.isArray(data.data.reservations)) {
                data.data.reservations = [data.data.reservations];
            }
        }

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

        // Collect any optional_fee_XXXX params
        const optionalFeeParams: Record<string, any> = {};
        Object.keys(body).forEach(key => {
            if (key.startsWith('optional_fee_')) {
                optionalFeeParams[key] = body[key];
            }
        });

        // Calculate total price using GetPreReservationPrice (consistent with checkout display)
        let totalAmount = 0;
        try {
            const priceData: any = await getPreReservationPrice({
                unit_id: body.unit_id,
                startdate: body.startdate,
                enddate: body.enddate,
                occupants: body.occupants,
                occupants_small: body.occupants_small || 0,
                pets: body.pets || 0,
                coupon_code: body.coupon_code,
                ...optionalFeeParams
            });
            totalAmount = parseFloat(priceData?.data?.total) || 0;
        } catch (priceError) {
            console.error('Error fetching price for reservation:', priceError);
        }

        // Parse expiration date (MM/YY format)
        let expirationMonth: number | undefined;
        let expirationYear: number | undefined;
        if (body.credit_card_expiration) {
            const parts = body.credit_card_expiration.split('/');
            expirationMonth = parseInt(parts[0]);
            expirationYear = parts[1] ? parseInt('20' + parts[1]) : undefined;
        }

        // Determine credit card type from number
        const cardNumber = body.credit_card_number?.toString().replace(/\s/g, '') || '';
        let creditCardTypeId = 1; // Default: Visa
        if (cardNumber.startsWith('4')) creditCardTypeId = 1;       // Visa
        else if (cardNumber.startsWith('5')) creditCardTypeId = 2;  // MasterCard
        else if (cardNumber.startsWith('3')) creditCardTypeId = 3;  // Amex
        else if (cardNumber.startsWith('6')) creditCardTypeId = 4;  // Discover

        // Strip phone formatting characters - API expects digits only
        const cleanPhone = (body.cell_phone || body.phone || '').replace(/[\s\(\)\-\+]/g, '');

        // Create reservation using correct Streamline API parameter names
        const data = await makeReservation({
            unit_id: body.unit_id,
            startdate: body.startdate,
            enddate: body.enddate,
            email: body.email,
            occupants: body.occupants,
            occupants_small: body.occupants_small || 0,
            pets: body.pets || 0,
            first_name: body.first_name,
            last_name: body.last_name,
            zip: body.zip,
            address: body.address,
            city: body.city,
            state_name: body.state,        // API expects 'state_name'
            mobile_phone: cleanPhone,       // API expects 'mobile_phone'
            phone: cleanPhone,              // Also send as 'phone' (recommended by docs)
            coupon_code: body.coupon_code,

            // Payment fields
            payment_type_id: 1, // Credit Card
            credit_card_number: cardNumber,
            credit_card_type_id: creditCardTypeId,
            credit_card_cid: body.credit_card_cvv,
            credit_card_expiration_month: expirationMonth,
            credit_card_expiration_year: expirationYear,
            credit_card_amount: totalAmount,
            credit_card_charge_required: totalAmount > 0 ? 1 : 0,

            // Notes / comments
            client_comments: body.notes || undefined,
            payment_comments: body.notes || 'Website Booking',

            // Optional fee selections
            ...optionalFeeParams
        });

        const responseData = data as any;
        const apiStatus = responseData?.status || responseData?.Response?.status;
        if (apiStatus?.code && !apiStatus.code.startsWith('S')) {
            console.error('Streamline API error:', apiStatus);
            // Strip HTML tags from description
            const cleanDescription = (apiStatus.description || 'Reservation failed').replace(/<[^>]*>/g, ' ').trim();
            return NextResponse.json(
                { error: cleanDescription, code: apiStatus.code },
                { status: 400 }
            );
        }

        // After successful reservation, save the metadata (e.g. survey data)
        try {
            if (responseData?.confirmation_id) {
                await prisma.reservationMeta.upsert({
                    where: { confirmationId: responseData.confirmation_id.toString() },
                    update: { heardAboutUs: body.heardAboutUs || null },
                    create: {
                        confirmationId: responseData.confirmation_id.toString(),
                        heardAboutUs: body.heardAboutUs || null
                    }
                });
            }
        } catch (dbError) {
            console.error('Error saving reservation metadata to Prisma:', dbError);
            // We don't fail the whole request if meta saving fails
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error creating reservation:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create reservation' },
            { status: 500 }
        );
    }
}

