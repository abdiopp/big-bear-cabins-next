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
                const response = await fetch('/api/properties', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id }),
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
