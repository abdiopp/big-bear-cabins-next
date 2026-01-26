// app/api/availability/route.ts
import {
    getPropertyAvailability,
    getBlockedDaysForUnit,
    verifyPropertyAvailability,
    getPropertyAvailabilityWithRates,
    getPropertyAvailabilityCalendarRawData
} from '@/lib/streamline';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { action = 'availability', ...params } = body;

        let data;

        switch (action) {
            case 'availability':
                if (!params.startdate || !params.enddate) {
                    return NextResponse.json(
                        { error: 'Start date and end date are required' },
                        { status: 400 }
                    );
                }
                data = await getPropertyAvailability({
                    unit_id: params.unit_id,
                    startdate: params.startdate,
                    enddate: params.enddate,
                    occupants: params.occupants,
                    disable_minimal_days: params.disable_minimal_days || 1,
                    show_total_units: params.show_total_units || 1
                });
                break;

            case 'blocked':
                if (!params.unit_id || !params.startdate || !params.enddate) {
                    return NextResponse.json(
                        { error: 'Unit ID, start date, and end date are required' },
                        { status: 400 }
                    );
                }
                data = await getBlockedDaysForUnit(
                    params.unit_id,
                    params.startdate,
                    params.enddate
                );
                break;

            case 'calendar_raw':
                if (!params.unit_id || !params.startdate || !params.enddate) {
                    return NextResponse.json(
                        { error: 'Unit ID, start date, and end date are required' },
                        { status: 400 }
                    );
                }
                data = await getPropertyAvailabilityCalendarRawData(
                    params.unit_id,
                    params.startdate,
                    params.enddate
                );
                break;

            case 'verify':
                if (!params.unit_id || !params.startdate || !params.enddate) {
                    return NextResponse.json(
                        { error: 'Unit ID, start date, and end date are required' },
                        { status: 400 }
                    );
                }
                data = await verifyPropertyAvailability(
                    params.unit_id,
                    params.startdate,
                    params.enddate,
                    params.occupants,
                    params.adults,
                    params.children,
                    params.pets
                );
                break;

            case 'withRates':
                if (!params.startdate || !params.enddate) {
                    return NextResponse.json(
                        { error: 'Start date and end date are required' },
                        { status: 400 }
                    );
                }
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
        console.error('Error checking availability:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to check availability' },
            { status: 500 }
        );
    }
}
