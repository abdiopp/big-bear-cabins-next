// app/api/reservations/price/route.ts
import {
    getReservationPrice,
    getPreReservationPrice,
    getPropertyAvailabilityWithRates
} from '@/lib/streamline';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { action = 'price', ...params } = body;

        // Validate required fields
        const requiredFields = ['unit_id', 'startdate', 'enddate', 'occupants'];
        const missingFields = requiredFields.filter(field => !params[field]);

        if (missingFields.length > 0) {
            return NextResponse.json(
                { error: `Missing required fields: ${missingFields.join(', ')}` },
                { status: 400 }
            );
        }

        let data;

        switch (action) {
            case 'price':
                // Using getPropertyAvailabilityWithRates for price estimation
                const rawData: any = await getPropertyAvailabilityWithRates({
                    unit_id: params.unit_id,
                    startdate: params.startdate,
                    enddate: params.enddate,
                    occupants: params.occupants
                });

                // Transform response to match ReservationPrice interface
                // Note: rawData is the full API response object, so we access .data for the payload
                if (rawData && rawData.data && rawData.data.available_properties && rawData.data.available_properties.property && rawData.data.available_properties.property.length > 0) {
                    const prop = rawData.data.available_properties.property[0];

                    // Calculate nights
                    const start = new Date(params.startdate);
                    const end = new Date(params.enddate);
                    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

                    data = {
                        data: {
                            total: prop.total,
                            subtotal: prop.price,
                            taxes: prop.real_taxes || 0,
                            fees: [
                                {
                                    name: "Fees & Services",
                                    amount: prop.real_fees || prop.fees || 0,
                                    type: "fee"
                                }
                            ],
                            currency: "USD", // Default or extract if available
                            nights: nights,
                            average_nightly_rate: prop.price / (nights || 1),
                            security_deposit: 0 // Not provided in this response
                        }
                    };
                } else {
                    throw new Error("Property not available for selected dates");
                }
                break;

            case 'prereservation':
                data = await getPreReservationPrice({
                    unit_id: params.unit_id,
                    startdate: params.startdate,
                    enddate: params.enddate,
                    occupants: params.occupants
                });
                break;

            default:
                return NextResponse.json(
                    { error: `Unknown action: ${action}` },
                    { status: 400 }
                );
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error calculating reservation price:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to calculate reservation price' },
            { status: 500 }
        );
    }
}
