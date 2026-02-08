// app/api/reservations/price/route.ts
import {
    getReservationPrice,
    getPreReservationPrice,
    getPropertyAvailabilityWithRates
} from '@/lib/streamline';
import { NextRequest, NextResponse } from 'next/server';
import type { PreReservationPriceResponse } from '@/lib/streamline-types';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { action = 'prereservation', ...params } = body;

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
            case 'prereservation':
            case 'price':
                // Use GetPreReservationPrice for detailed pricing
                const rawData: any = await getPreReservationPrice({
                    unit_id: params.unit_id,
                    startdate: params.startdate,
                    enddate: params.enddate,
                    occupants: params.occupants,
                    occupants_small: params.occupants_small || 0,
                    pets: params.pets || 0,
                    coupon_code: params.coupon_code
                });

                if (rawData && rawData.data) {
                    const priceData = rawData.data as PreReservationPriceResponse;

                    // Calculate nights from reservation days or dates
                    const start = new Date(params.startdate);
                    const end = new Date(params.enddate);
                    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

                    // Parse required fees
                    const requiredFees = (priceData.required_fees || []).map(fee => ({
                        id: fee.id,
                        name: fee.name || 'Fee',
                        amount: parseFloat(fee.value) || 0,
                        description: fee.description,
                        type: fee.travel_insurance === '1' ? 'insurance' :
                            fee.damage_waiver === '1' ? 'damage_waiver' : 'fee'
                    }));

                    // Parse optional fees
                    const optionalFees = (priceData.optional_fees || []).map(fee => ({
                        id: fee.id,
                        name: fee.name || 'Optional Fee',
                        amount: parseFloat(fee.value) || 0,
                        description: fee.description,
                        type: fee.travel_insurance === '1' ? 'travel_insurance' :
                            fee.cfar === '1' ? 'cancel_any_reason' : 'optional',
                        active: fee.active === '1'
                    }));

                    // Parse tax details
                    const taxDetails = (priceData.taxes_details || []).map(tax => ({
                        id: tax.id,
                        name: tax.name || 'Tax',
                        amount: parseFloat(tax.value) || 0,
                        description: tax.description
                    }));

                    // Parse guest deposits
                    let guestDeposits: any[] = [];
                    if (priceData.guest_deposits) {
                        const deposits = Array.isArray(priceData.guest_deposits)
                            ? priceData.guest_deposits
                            : [priceData.guest_deposits];
                        guestDeposits = deposits.map(dep => ({
                            id: dep.id,
                            name: dep.name,
                            amount: parseFloat(dep.value) || 0,
                            deposit_required: parseFloat(dep.deposit_required) || 0,
                            due_today: dep.due_today === '1'
                        }));
                    }

                    // Build response
                    data = {
                        data: {
                            unit_id: priceData.unit_id,
                            unit_name: priceData.unit_name,
                            location_name: priceData.location_name,
                            subtotal: parseFloat(priceData.price) || 0,
                            taxes: parseFloat(priceData.taxes) || 0,
                            coupon_discount: parseFloat(priceData.coupon_discount) || 0,
                            total: parseFloat(priceData.total) || 0,
                            first_day_price: parseFloat(priceData.first_day_price) || 0,
                            nights: nights,
                            average_nightly_rate: (parseFloat(priceData.price) || 0) / (nights || 1),
                            currency: 'USD',
                            required_fees: requiredFees,
                            optional_fees: optionalFees,
                            taxes_details: taxDetails,
                            guest_deposits: guestDeposits,
                            security_deposit_text: priceData.security_deposit_text,
                            due_today: priceData.due_today === '1',
                            reservation_days: priceData.reservation_days || [],
                            // Legacy fields for backward compatibility
                            fees: requiredFees.map(f => ({
                                name: f.name,
                                amount: f.amount,
                                type: f.type
                            }))
                        }
                    };
                } else {
                    throw new Error("Unable to get pricing for selected dates");
                }
                break;

            case 'availability_rates':
                // Fallback to availability with rates
                data = await getPropertyAvailabilityWithRates({
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
