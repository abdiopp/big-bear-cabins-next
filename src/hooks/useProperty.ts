"use client";

import { useState, useEffect } from 'react';
import { Property, StreamlineProperty } from '@/lib/types';
import { mapStreamlineProperty } from './useProperties';

export function useProperty(id: string | number) {
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Skip if id is missing or if it's the [id] placeholder from Next.js dynamic routing
        if (!id || id === '[id]') {
            setLoading(true);
            return;
        }

        // Reset state when id changes to avoid flashing old data or showing error during loading
        setProperty(null);
        setError(null);
        setLoading(true);

        async function fetchProperty() {
            try {
                // Fetch property info
                const response = await fetch('/api/properties', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id,
                        // User requested payload parameters to ensure unit 89614 is found with correct details
                        show_rooms: 1,
                        location_variables: {
                            variable: {
                                value: "4x2 14",
                                name: "Air Filters"
                            }
                        },
                        variables: {
                            variable: {
                                value: 1,
                                name: "Towels"
                            }
                        },
                        additional_field: {
                            value: "Grey",
                            "name": "Tiles"
                        },
                        owning_type_id: 1,
                        status_id: 1,
                        return_owning_startdate: 1,
                        return_owner_id: 1
                    }),
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch property: ${response.statusText}`);
                }

                const data = await response.json();

                const rawProperties: StreamlineProperty[] = data.data?.property || [];
                if (rawProperties.length === 0) {
                    throw new Error('Property not found');
                }

                const mappedProperty = mapStreamlineProperty(rawProperties[0]);
                const raw = rawProperties[0];
                mappedProperty.description = raw.global_description || raw.description;

                // Fetch full gallery images
                try {
                    const galleryResponse = await fetch('/api/properties/gallery', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ id }),
                    });

                    if (galleryResponse.ok) {
                        const galleryData = await galleryResponse.json();
                        const images = galleryData.data?.image || galleryData.data?.images || galleryData.data?.property?.images || [];
                        if (images.length > 0) {
                            mappedProperty.images = images.map((img: any) => img.image_path || img);
                        }
                    }
                } catch (galleryError) {
                    // If gallery fetch fails, keep the default images from property list
                    console.warn('Failed to fetch gallery images:', galleryError);
                }

                setProperty(mappedProperty);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        }

        fetchProperty();
    }, [id]);

    return { property, loading, error };
}

