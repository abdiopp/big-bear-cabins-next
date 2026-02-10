import { streamlineRequest } from '@/lib/streamline';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const body = await req.json();

    try {
        // 1. Handle Specific Property Request (ID provided)
        if (body.id) {
            const [propertyData, amenitiesData] = await Promise.all([
                streamlineRequest('GetPropertyInfo', { unit_id: body.id }),
                streamlineRequest('GetPropertyAmenities', { unit_id: body.id })
            ]);

            if (propertyData.data) {
                const property = propertyData.data;
                if (amenitiesData.data?.amenity) {
                    property.amenities = amenitiesData.data.amenity;
                }
                return NextResponse.json({ data: { property: [property] } });
            }
            return NextResponse.json({ data: { property: [] } });
        }

        // 2. Handle Date-Based Search
        if (body.startdate && body.enddate) {
            console.log('🔍 Executing Date-Based Search:', { start: body.startdate, end: body.enddate, occupants: body.occupants });

            // Step A: Get Availability & Pricing
            const availabilityParams: any = {
                startdate: body.startdate,
                enddate: body.enddate,
            };
            if (body.occupants) availabilityParams.occupants = body.occupants;
            if (body.occupants_small) availabilityParams.occupants_small = body.occupants_small;
            if (body.pets) availabilityParams.pets = body.pets;

            const availabilityPromise = streamlineRequest('GetPropertyAvailabilityWithRates', availabilityParams);

            // Step B: Get All Properties (Static Details)
            // Fetch a large number to ensure we cover available units.
            // In a production app with thousands of units, we might cache this or use a different strategy.
            const propertyListParams: any = {
                sort_by: 'price_daily_low',
                return_gallery: 1,
                return_amenities: 1,
                max_images_number: 10,
                page_results_number: 500,
            };
            const propertyListPromise = streamlineRequest('GetPropertyList', propertyListParams);

            const [availabilityData, propertyListData] = await Promise.all([availabilityPromise, propertyListPromise]);

            // Step C: Process Availability Data
            // GetPropertyAvailabilityWithRates returns a list of available units with pricing
            const availableDataRaw = (availabilityData as any).Response?.data || (availabilityData as any).data || availabilityData;

            let availableUnits: any[] = [];
            if (availableDataRaw?.property) {
                availableUnits = Array.isArray(availableDataRaw.property) ? availableDataRaw.property : [availableDataRaw.property];
            } else if (availableDataRaw?.available_properties?.property) {
                availableUnits = Array.isArray(availableDataRaw.available_properties.property) ? availableDataRaw.available_properties.property : [availableDataRaw.available_properties.property];
            } else if (Array.isArray(availableDataRaw)) {
                availableUnits = availableDataRaw;
            }

            console.log(`📦 Found ${availableUnits.length} available units`);

            // Create a map of available unit IDs for quick lookup and to store pricing info
            const availabilityMap = new Map<string, any>();
            availableUnits.forEach((unit: any) => {
                if (unit.unit_id) {
                    availabilityMap.set(String(unit.unit_id), unit);
                }
            });

            // Step D: Process Property List Data
            const propertyListRaw = (propertyListData as any).Response?.data || (propertyListData as any).data || propertyListData;
            let allProperties: any[] = [];
            if (propertyListRaw?.property) {
                allProperties = Array.isArray(propertyListRaw.property) ? propertyListRaw.property : [propertyListRaw.property];
            } else if (propertyListRaw?.available_properties?.property) {
                allProperties = Array.isArray(propertyListRaw.available_properties.property) ? propertyListRaw.available_properties.property : [propertyListRaw.available_properties.property];
            }

            console.log(`📦 Fetched ${allProperties.length} total properties details`);

            // Step E: Merge & Filter
            let mergedProperties = allProperties.filter(prop => {
                const unitId = String(prop.id || prop.unit_id);
                return availabilityMap.has(unitId);
            }).map(prop => {
                const unitId = String(prop.id || prop.unit_id);
                const pricingInfo = availabilityMap.get(unitId);

                // Merge pricing info into the main property object
                // We prioritize the pricing from availability search as it's accurate for the dates
                return {
                    ...prop,
                    ...pricingInfo,
                    // Ensure we keep the static details if they are missing in pricing info
                    name: prop.name || pricingInfo.unit_name,
                    id: unitId
                };
            });

            console.log(`✅ Merged ${mergedProperties.length} properties`);

            // Step F: Apply Additional Filters (if any)
            if (body.occupants) {
                const required = parseInt(body.occupants);
                mergedProperties = mergedProperties.filter(p => parseInt(p.max_occupants || p.occupants) >= required);
            }
            if (body.pets) {
                // If pets required, filter for pet friendly (assuming pets > 0 means pets allowed)
                // Streamline usually needs pets=1 param in availability, which we sent.
                // But we can double check here.
                mergedProperties = mergedProperties.filter(p => parseInt(p.pets) > 0 || String(p.pets).toLowerCase() === 'yes' || String(p.pets) === '1');
            }

            return NextResponse.json({
                data: {
                    property: mergedProperties
                }
            });

        }

        // 3. Handle General Search (No Dates)
        console.log('🔍 Executing General Search (No Dates)');
        const params: any = {
            sort_by: 'price_daily_low',
            return_gallery: 1,
            return_amenities: 1,
            max_images_number: 10,
            page_results_number: 12,
        };

        if (body.page) params.page_number = body.page;

        // Note: Filters for general search in Streamline GetPropertyList are limited.
        // We fetch and then might need to filter client-side or assume partial backend filtering.

        const data = await streamlineRequest('GetPropertyList', params);
        const responseData = (data as any).Response?.data || (data as any).data || data;

        let properties: any[] = [];
        if (responseData?.property) {
            properties = Array.isArray(responseData.property) ? responseData.property : [responseData.property];
        }

        // Client-side filtering for General Search
        if (body.occupants) {
            const required = parseInt(body.occupants);
            properties = properties.filter(p => parseInt(p.max_occupants) >= required);
        }

        return NextResponse.json({
            data: {
                property: properties
            }
        });

    } catch (e) {
        console.error("❌ Search API Error:", e);
        return NextResponse.json({ data: { property: [] }, error: String(e) }, { status: 500 });
    }
}
