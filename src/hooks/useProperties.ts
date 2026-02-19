"use client";

import { useState, useEffect } from 'react';
import { Property, StreamlineProperty } from '@/lib/types';

export const mapStreamlineProperty = (p: StreamlineProperty): Property => {
    // Handle gallery in both formats:
    // - Raw API: { image: [{ image_path, ... }] }
    // - Typed:   [{ image_path, ... }]
    const galleryRaw = p.gallery as any;
    let images: string[] = [p.default_image_path];
    if (galleryRaw) {
        const imageArray = Array.isArray(galleryRaw) ? galleryRaw : galleryRaw.image;
        if (Array.isArray(imageArray)) {
            images = imageArray.map((img: any) => img.image_path).filter(Boolean);
        }
    }

    // Handle amenities in both formats:
    // - Raw API: { amenity: [{ amenity_name, group_name }] } (from unit_amenities)
    // - Typed:   [{ amenity_name, group_name }]
    const amenitiesRaw = p.amenities as any;
    let amenities: { group: string; name: string }[] = [];
    if (amenitiesRaw) {
        const amenityArray = Array.isArray(amenitiesRaw) ? amenitiesRaw : amenitiesRaw.amenity;
        if (Array.isArray(amenityArray)) {
            amenities = amenityArray.map((a: any) => ({
                group: a.group_name || '',
                name: a.amenity_name || ''
            }));
        }
    }

    return {
        id: p.id,
        title: p.name,
        location: `${p.location_name || ''}, ${p.state_name || ''}`,
        price: p.prices?.nightly_price || (p.daily_pricing_starting > 0 ? p.daily_pricing_starting : 150),
        rating: p.rating_average || 0,
        reviewCount: p.rating_count || 0,
        imageUrl: p.default_image_path,
        images: images.length > 0 ? images : [p.default_image_path],
        bedrooms: p.bedrooms_number,
        bathrooms: p.bathrooms_number,
        guests: p.max_occupants,
        dates: "Available now",
        isSuperhost: (p.rating_average || 0) >= 4.5,
        latitude: p.lat,
        longitude: p.lng,
        amenities,
    };
};

export interface SearchParams {
    startdate?: string;
    enddate?: string;
    occupants?: number;
    occupants_small?: number;
    pets?: boolean;
    filters?: string[];
    bedrooms_number?: number;
    location_area_id?: number;
    sort_by?: string;
}

export function useProperties(page = 1, searchParams?: SearchParams) {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    console.log("searchParams =>", searchParams)
    useEffect(() => {
        async function fetchProperties() {
            try {
                setLoading(true);
                const response = await fetch('/api/properties', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        page,
                        ...(searchParams?.startdate && { startdate: searchParams.startdate }),
                        ...(searchParams?.enddate && { enddate: searchParams.enddate }),
                        ...(searchParams?.occupants && { occupants: searchParams.occupants }),
                        ...(searchParams?.occupants_small && { occupants_small: searchParams.occupants_small }),
                        ...(searchParams?.pets && { pets: searchParams.pets }),
                        ...(searchParams?.filters && { filters: searchParams.filters }),
                        ...(searchParams?.bedrooms_number && { bedrooms_number: searchParams.bedrooms_number }),
                        ...(searchParams?.location_area_id && { location_area_id: searchParams.location_area_id }),
                        ...(searchParams?.sort_by && { sort_by: searchParams.sort_by }),
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch properties');
                }

                const data = await response.json();

                // Data structure from streamline is { data: { property: [...] } }
                const rawProperties: StreamlineProperty[] = data.data?.property || [];
                const mappedProperties = rawProperties.map(mapStreamlineProperty);

                setProperties(mappedProperties);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        }

        fetchProperties();
    }, [page, searchParams?.startdate, searchParams?.enddate, searchParams?.occupants, searchParams?.occupants_small, searchParams?.pets, searchParams?.filters, searchParams?.bedrooms_number, searchParams?.location_area_id, searchParams?.sort_by]);

    return { properties, loading, error };
}
