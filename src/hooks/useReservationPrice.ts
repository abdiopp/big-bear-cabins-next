"use client";

import { useState, useCallback } from 'react';

interface Fee {
    name: string;
    amount: number;
    type: string;
}

interface DetailedFee {
    id: string;
    name: string;
    amount: number;
    description: string | null;
    type: string;
}

interface OptionalFee extends DetailedFee {
    active: boolean;
}

interface TaxDetail {
    id: string;
    name: string;
    amount: number;
    description: string | null;
}

interface GuestDeposit {
    id: string;
    name: string;
    amount: number;
    deposit_required: number;
    due_today: boolean;
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
    // Enhanced fields from GetPreReservationPrice
    coupon_discount?: number;
    required_fees?: DetailedFee[];
    optional_fees?: OptionalFee[];
    taxes_details?: TaxDetail[];
    guest_deposits?: GuestDeposit[];
    security_deposit_text?: string;
    due_today?: boolean;
}

interface UseReservationPriceOptions {
    unitId: number;
    startDate: string;
    endDate: string;
    occupants: number;
    occupants_small?: number;
    pets?: number;
    couponCode?: string;
}

export function useReservationPrice() {
    const [price, setPrice] = useState<ReservationPrice | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const calculatePrice = useCallback(async (options: UseReservationPriceOptions) => {
        const { unitId, startDate, endDate, occupants, occupants_small, pets, couponCode } = options;

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
                    occupants_small: occupants_small || 0,
                    pets: pets || 0,
                    coupon_code: couponCode
                })
            });

            if (!response.ok) {
                throw new Error('Failed to calculate price');
            }

            const data = await response.json();

            // Map the response to our interface including enhanced fields
            const priceData: ReservationPrice = {
                total: data.data?.total || 0,
                subtotal: data.data?.subtotal || 0,
                taxes: data.data?.taxes || 0,
                fees: data.data?.fees || [],
                security_deposit: data.data?.security_deposit,
                currency: data.data?.currency || 'USD',
                nights: data.data?.nights || 0,
                average_nightly_rate: data.data?.average_nightly_rate || 0,
                // Enhanced fields
                coupon_discount: data.data?.coupon_discount || 0,
                required_fees: data.data?.required_fees || [],
                optional_fees: data.data?.optional_fees || [],
                taxes_details: data.data?.taxes_details || [],
                guest_deposits: data.data?.guest_deposits || [],
                security_deposit_text: data.data?.security_deposit_text,
                due_today: data.data?.due_today || false
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
