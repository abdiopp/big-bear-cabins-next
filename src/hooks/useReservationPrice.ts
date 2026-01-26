"use client";

import { useState, useCallback } from 'react';

interface Fee {
    name: string;
    amount: number;
    type: string;
}

interface ReservationPrice {
    total: number;
    subtotal: number;
    taxes: number;
    fees: Fee[];
    security_deposit?: number;
    currency: string;
    nights: number;
    average_nightly_rate: number;
}

interface UseReservationPriceOptions {
    unitId: number;
    startDate: string;
    endDate: string;
    occupants: number;
    couponCode?: string;
}

export function useReservationPrice() {
    const [price, setPrice] = useState<ReservationPrice | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const calculatePrice = useCallback(async (options: UseReservationPriceOptions) => {
        const { unitId, startDate, endDate, occupants, couponCode } = options;

        if (!unitId || !startDate || !endDate || !occupants) {
            setError('Missing required parameters');
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/reservations/price', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'price',
                    unit_id: unitId,
                    startdate: startDate,
                    enddate: endDate,
                    occupants,
                    coupon_code: couponCode
                })
            });

            if (!response.ok) {
                throw new Error('Failed to calculate price');
            }

            const data = await response.json();

            // Map the response to our interface
            const priceData: ReservationPrice = {
                total: data.data?.total || 0,
                subtotal: data.data?.subtotal || 0,
                taxes: data.data?.taxes || 0,
                fees: data.data?.fees || [],
                security_deposit: data.data?.security_deposit,
                currency: data.data?.currency || 'USD',
                nights: data.data?.nights || 0,
                average_nightly_rate: data.data?.average_nightly_rate || 0
            };

            setPrice(priceData);
            setLoading(false);
            return priceData;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            setLoading(false);
            return null;
        }
    }, []);

    const getPreReservationPrice = useCallback(async (options: UseReservationPriceOptions) => {
        const { unitId, startDate, endDate, occupants } = options;

        if (!unitId || !startDate || !endDate || !occupants) {
            setError('Missing required parameters');
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/reservations/price', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'prereservation',
                    unit_id: unitId,
                    startdate: startDate,
                    enddate: endDate,
                    occupants
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get pre-reservation price');
            }

            const data = await response.json();
            setPrice(data.data);
            setLoading(false);
            return data.data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            setLoading(false);
            return null;
        }
    }, []);

    const clearPrice = useCallback(() => {
        setPrice(null);
        setError(null);
    }, []);

    return {
        price,
        loading,
        error,
        calculatePrice,
        getPreReservationPrice,
        clearPrice
    };
}
