import { streamlineRequest } from '@/lib/streamline';
import { NextResponse } from 'next/server';

// Map frontend filter keys to Streamline Amenity IDs
const AMENITY_IDS: Record<string, number> = {
    boatDock: 97227,
    evCharger: 834824,
    hotTub: 93832,
    // "pets" is handled separately via `pets` param usually, but "PETS OK" ID is 94376
};

// ... (existing code) ...



// We assume backend filtering worked via amenity_ids. 

// ... (existing code) ...



// Helper to get amenity IDs from filters
function getAmenityIds(filters: string[]) {
    if (!filters || !Array.isArray(filters)) return [];
    return filters.map(f => AMENITY_IDS[f]).filter(id => id && id > 0);
}

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

        const amenityIds = body.filters ? getAmenityIds(body.filters) : [];
        if (body.pets) {
            amenityIds.push(94376); // Map pets toggle directly to PETS OK amenity
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

            // Pass amenity IDs for filtering
            // Note: We do NOT pass amenities_filter to GetPropertyAvailabilityWithRates (Step A)
            // because it is unreliable or undocumented. We filter client-side in Step F.

            const availabilityPromise = streamlineRequest('GetPropertyAvailabilityWithRates', availabilityParams);

            // Step B: Get All Properties (Static Details)
            const propertyListParams: any = {
                sort_by: body.sort_by || 'price_daily_low',
                return_gallery: 1,
                return_amenities: 1,
                max_images_number: 10,
                page_results_number: 500,
            };
            if (body.bedrooms_number) propertyListParams.bedrooms_number = body.bedrooms_number;
            if (body.location_area_id) propertyListParams.location_area_id = body.location_area_id;

            // Use WordPress method to ensure we get unit_amenities for client-side filtering
            const propertyListPromise = streamlineRequest('GetPropertyListWordPress', propertyListParams);

            const [availabilityData, propertyListData] = await Promise.all([availabilityPromise, propertyListPromise]);

            // Step C: Process Availability Data
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

                return {
                    ...prop,
                    ...pricingInfo,
                    name: prop.name || pricingInfo.unit_name,
                    id: unitId
                };
            });

            console.log(`✅ Merged ${mergedProperties.length} properties`);

            // Step F: Apply Additional Filters (if any)
            if (body.bedrooms_number) {
                const requiredBeds = parseInt(body.bedrooms_number);
                mergedProperties = mergedProperties.filter(p => parseInt(p.bedrooms_number) === requiredBeds);
            }
            if (body.location_area_id) {
                const reqLocId = String(body.location_area_id);
                mergedProperties = mergedProperties.filter(p => String(p.location_area_id) === reqLocId);
            }
            if (body.occupants || body.occupants_small) {
                const adultReq = body.occupants ? parseInt(body.occupants) : 0;
                const childReq = body.occupants_small ? parseInt(body.occupants_small) : 0;
                const totalReq = adultReq + childReq;
                mergedProperties = mergedProperties.filter(p => parseInt(p.max_occupants || p.occupants) >= totalReq);
            }

            // Client-side filtering for amenities
            if (amenityIds.length > 0) {
                mergedProperties = mergedProperties.filter(p => {
                    let propertyAmenities = p.unit_amenities?.amenity;

                    // Handle case where it's a single object or undefined
                    if (!propertyAmenities) {
                        return false;
                    }

                    if (!Array.isArray(propertyAmenities)) {
                        propertyAmenities = [propertyAmenities];
                    }

                    const propertyAmenityIds = propertyAmenities.map((a: any) => a.amenity_id);
                    // Check if property has ALL requested amenities
                    return amenityIds.every((id: number) => propertyAmenityIds.includes(id));
                });
            }

            // Client-side filtering for properties that are not amenities
            if (body.filters && Array.isArray(body.filters)) {
                if (body.filters.includes('mountainView')) {
                    mergedProperties = mergedProperties.filter(p => p.view_name && p.view_name.toLowerCase().includes('mountain'));
                }
                if (body.filters.includes('lakefront')) {
                    mergedProperties = mergedProperties.filter(p =>
                        (p.location_area_name && p.location_area_name.toLowerCase().includes('lakefront')) ||
                        (p.location_name && p.location_name.toLowerCase().includes('lakefront'))
                    );
                }
            }

            // We assume backend filtering worked via amenity_ids. 
            // If explicit text matching was needed, we can't do it because amenities are missing in response.

            return NextResponse.json({
                data: {
                    property: mergedProperties
                }
            });

        }

        // 3. Handle General Search (No Dates)
        console.log('🔍 Executing General Search (No Dates)');
        const params: any = {
            sort_by: body.sort_by || 'price_daily_low',
            return_gallery: 1,
            return_amenities: 1,
            max_images_number: 10,
            page_results_number: 200,
        };

        if (body.page) params.page_number = body.page;
        // Not passing bedrooms_number and location_area_id to API since we filter client-side
        // if (body.bedrooms_number) params.bedrooms_number = body.bedrooms_number;
        // if (body.location_area_id) params.location_area_id = body.location_area_id;

        let method = 'GetPropertyList';

        // Pass amenity IDs for filtering
        if (amenityIds.length > 0) {
            params.amenities_filter = amenityIds;
            // Use WordPress method which supports filtering
            method = 'GetPropertyListWordPress';
        }

        const data = await streamlineRequest(method, params);
        const responseData = (data as any).Response?.data || (data as any).data || data;

        let properties: any[] = [];
        if (responseData && responseData.property && Array.isArray(responseData.property)) {
            properties = responseData.property;

            // Client-side filtering for amenities (double check, as API might ignore amenities_filter)
            if (amenityIds.length > 0) {
                properties = properties.filter((p: any) => {
                    let propertyAmenities = p.unit_amenities?.amenity;

                    // Handle case where it's a single object or undefined
                    if (!propertyAmenities) {
                        return false;
                    }

                    if (!Array.isArray(propertyAmenities)) {
                        propertyAmenities = [propertyAmenities];
                    }

                    const propertyAmenityIds = propertyAmenities.map((a: any) => a.amenity_id);
                    // Check if property has ALL requested amenities
                    return amenityIds.every((id: number) => propertyAmenityIds.includes(id));
                });
            }
        } else if (responseData && responseData.available_properties && responseData.available_properties.property) {
            // Handle WordPress API structure where properties might be nested
            properties = Array.isArray(responseData.available_properties.property) ? responseData.available_properties.property : [responseData.available_properties.property];

            // Client-side filtering for amenities (duplicates logic but necessary if structure differs)
            if (amenityIds.length > 0) {
                properties = properties.filter((p: any) => {
                    let propertyAmenities = p.unit_amenities?.amenity;

                    if (!propertyAmenities) return false;
                    if (!Array.isArray(propertyAmenities)) propertyAmenities = [propertyAmenities];

                    const propertyAmenityIds = propertyAmenities.map((a: any) => a.amenity_id);
                    return amenityIds.every((id: number) => propertyAmenityIds.includes(id));
                });
            }
        }

        // Filter by Mountain View or Lakefront if requested (using properties)
        if (body.filters && Array.isArray(body.filters)) {
            if (body.filters.includes('mountainView')) {
                properties = properties.filter((p: any) => p.view_name && p.view_name.toLowerCase().includes('mountain'));
            }
            if (body.filters.includes('lakefront')) {
                properties = properties.filter((p: any) =>
                    (p.location_area_name && p.location_area_name.toLowerCase().includes('lakefront')) ||
                    (p.location_name && p.location_name.toLowerCase().includes('lakefront'))
                );
            }
        }

        // Client-side filtering for General Search
        if (body.bedrooms_number) {
            const requiredBeds = parseInt(body.bedrooms_number);
            properties = properties.filter(p => parseInt(p.bedrooms_number) === requiredBeds);
        }
        if (body.location_area_id) {
            const reqLocId = String(body.location_area_id);
            properties = properties.filter(p => String(p.location_area_id) === reqLocId);
        }
        if (body.occupants || body.occupants_small) {
            const adultReq = body.occupants ? parseInt(body.occupants) : 0;
            const childReq = body.occupants_small ? parseInt(body.occupants_small) : 0;
            const totalReq = adultReq + childReq;
            properties = properties.filter(p => parseInt(p.max_occupants || p.occupants) >= totalReq);
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


