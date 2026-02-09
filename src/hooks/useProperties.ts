"use client";

import { useState, useEffect } from 'react';
import { Property, StreamlineProperty } from '@/lib/types';

export const mapStreamlineProperty = (p: StreamlineProperty): Property => ({
    id: p.id,
    title: p.name,
    location: `${p.location_name}, ${p.state_name}`,
    price: p.daily_pricing_starting > 0 ? p.daily_pricing_starting : 150, // Fallback price
    rating: p.rating_average || 0,
    reviewCount: p.rating_count || 0,
    imageUrl: p.default_image_path,
    images: p.gallery?.map(img => img.image_path) || [p.default_image_path],
    bedrooms: p.bedrooms_number,
    bathrooms: p.bathrooms_number,
    guests: p.max_occupants,
    dates: "Available now", // Placeholder
    isSuperhost: p.rating_average >= 4.5,
    latitude: p.lat,
    longitude: p.lng
});

export interface SearchParams {
    startdate?: string;
    enddate?: string;
    occupants?: number;
    occupants_small?: number;
    pets?: number;
    filters?: string[];
}

export function useProperties(page = 1, searchParams?: SearchParams) {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
    }, [page, searchParams?.startdate, searchParams?.enddate, searchParams?.occupants, searchParams?.occupants_small, searchParams?.pets, searchParams?.filters]);

    return { properties, loading, error };
}
