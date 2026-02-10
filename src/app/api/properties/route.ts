// app/api/properties/route.ts
import { streamlineRequest } from '@/lib/streamline';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const body = await req.json();

    // If a specific ID is requested, use GetPropertyInfo to ensure we get that exact unit
    // nicely handling the "don't fetch all and filter locally" requirement by fetching just one.
    // If a specific ID is requested, use GetPropertyInfo to ensure we get that exact unit
    // nicely handling the "don't fetch all and filter locally" requirement by fetching just one.
    if (body.id) {
        try {
            const [propertyData, amenitiesData] = await Promise.all([
                streamlineRequest('GetPropertyInfo', { unit_id: body.id }),
                streamlineRequest('GetPropertyAmenities', { unit_id: body.id })
            ]);

            // GetPropertyInfo returns { data: { ...property properties... } }
            // GetPropertyAmenities returns { data: { amenity: [ ... ] } }

            if (propertyData.data) {
                const property = propertyData.data;

                // Attach amenities if available
                if (amenitiesData.data?.amenity) {
                    property.amenities = amenitiesData.data.amenity;
                }

                return NextResponse.json({
                    data: {
                        property: [property]
                    }
                });
            }
            return NextResponse.json({ data: { property: [] } });
        } catch (e) {
            console.error("Failed to fetch specific property info:", e);
            return NextResponse.json({ data: { property: [] } });
        }
    }

    // If dates are provided, use GetPropertyAvailability for filtered results
    if (body.startdate && body.enddate) {
        try {
            const availabilityParams: any = {
                startdate: body.startdate,
                enddate: body.enddate,
                disable_minimal_days: 1,
                show_total_units: 1,
                return_gallery: 1,
                return_amenities: 1,
                max_images_number: 10,
            };

            // Add occupants filter if provided
            if (body.occupants) {
                availabilityParams.occupants = body.occupants;
            }

            // Add occupants_small (children) filter if provided
            if (body.occupants_small) {
                availabilityParams.occupants_small = body.occupants_small;
            }

            // Add pets filter if provided
            if (body.pets) {
                availabilityParams.pets = body.pets;
            }

            console.log('🔍 GetPropertyAvailability params:', availabilityParams);
            const data = await streamlineRequest('GetPropertyAvailability', availabilityParams);

            console.log('📦 GetPropertyAvailability response keys:', Object.keys(data || {}));
            console.log('📦 GetPropertyAvailability data keys:', Object.keys(data?.data || {}));
            console.log('📦 GetPropertyAvailability full response:', JSON.stringify(data).slice(0, 1000));

            // Normalize response structure to match GetPropertyList
            // GetPropertyAvailability may return data in various formats
            let properties: any[] = [];

            if (data.data?.property) {
                properties = Array.isArray(data.data.property) ? data.data.property : [data.data.property];
            } else if (data.data?.unit) {
                properties = Array.isArray(data.data.unit) ? data.data.unit : [data.data.unit];
            } else if (data.data?.units) {
                properties = Array.isArray(data.data.units) ? data.data.units : [data.data.units];
            } else if (Array.isArray(data.data)) {
                properties = data.data;
            }

            // If GetPropertyAvailability returned results, use them
            if (properties.length > 0) {
                return NextResponse.json({
                    data: {
                        property: properties
                    }
                });
            }

            // If no results from GetPropertyAvailability, try GetPropertyList with date params
            // Some Streamline instances support date filtering on GetPropertyList
            console.log('⚠️ GetPropertyAvailability returned no results, trying GetPropertyList with date params');

        } catch (e) {
            console.error("Failed to fetch property availability:", e);
            // Fall back to regular property list on error
        }
    }

    // Default: Get all properties (with optional date filtering if supported)
    const params: any = {
        sort_by: 'price_daily_low',
        return_gallery: 1,
        return_amenities: 1,
        max_images_number: 10,
        page_results_number: 12, // Default page size
    };

    if (body.page) {
        params.page_number = body.page;
    }

    // Try to pass date filters to GetPropertyList (some Streamline instances support this)
    if (body.startdate) {
        params.startdate = body.startdate;
    }
    if (body.enddate) {
        params.enddate = body.enddate;
    }

    // Filter by max occupants if provided
    if (body.occupants) {
        params.max_occupants = body.occupants;
        params.occupants = body.occupants;
    }

    if (body.occupants_small) {
        params.occupants_small = body.occupants_small;
    }

    if (body.pets) {
        params.pets = body.pets;
    }

    console.log('🔍 GetPropertyList params:', params);

    // streamlineRequest handles token management
    const data = await streamlineRequest('GetPropertyList', params);

    // Since Streamline API doesn't filter server-side, apply filters post-fetch
    let filteredProperties = data.data?.property || [];

    // Filter by max_occupants (guests) - property must accommodate the requested guests
    if (body.occupants && Array.isArray(filteredProperties)) {
        const requestedOccupants = parseInt(body.occupants);
        console.log(`🔍 Filtering by max_occupants >= ${requestedOccupants}`);
        filteredProperties = filteredProperties.filter((prop: any) => {
            const maxOccupants = parseInt(prop.max_occupants) || 0;
            return maxOccupants >= requestedOccupants;
        });
        console.log(`📦 After occupants filter: ${filteredProperties.length} properties`);
    }

    // Return filtered results
    return NextResponse.json({
        data: {
            property: filteredProperties
        }
    });
}
