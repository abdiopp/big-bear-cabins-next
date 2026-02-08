"use client";

import { useState, useCallback } from 'react';

interface ReservationInfo {
    confirmation_id: number;
    unit_id: number;
    property_name?: string;
    status: string;
    status_id: number;
    guest_first_name?: string;
    guest_last_name?: string;
    guest_name?: string;
    email: string;
    phone?: string;
    startdate: string;
    enddate: string;
    checkin_time?: string;
    checkout_time?: string;
    occupants?: number;
    total: number;
    paid?: number;
    balance_due?: number;
    created_at?: string;
    updated_at?: string;
}

interface CreateReservationParams {
    unitId: number;
    startDate: string;
    endDate: string;
    email: string;
    occupants: number;
    firstName: string;
    lastName: string;
    zip: string;
    address: string;
    city: string;
    state: string;
    cellPhone: string;
    phone?: string;
    couponCode?: string;
}

export function useReservations() {
    const [reservations, setReservations] = useState<ReservationInfo[]>([]);
    const [currentReservation, setCurrentReservation] = useState<ReservationInfo | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch reservations list
    const fetchReservations = useCallback(async (params?: {
        email?: string;
        startDate?: string;
        endDate?: string;
        statusId?: number;
        page?: number;
    }) => {
        setLoading(true);
        setError(null);

        try {
            const searchParams = new URLSearchParams();
            if (params?.email) searchParams.set('email', params.email);
            if (params?.startDate) searchParams.set('startdate', params.startDate);
            if (params?.endDate) searchParams.set('enddate', params.endDate);
            if (params?.statusId) searchParams.set('status_id', params.statusId.toString());
            if (params?.page) searchParams.set('page', params.page.toString());

            const response = await fetch(`/api/reservations?${searchParams.toString()}`);

            if (!response.ok) {
                throw new Error('Failed to fetch reservations');
            }

            const data = await response.json();
            setReservations(data.data?.reservations || []);
            setLoading(false);
            return data.data?.reservations || [];
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            setLoading(false);
            return [];
        }
    }, []);

    // Get single reservation details
    const getReservation = useCallback(async (confirmationId: number) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/reservations/${confirmationId}`);

            if (!response.ok) {
                throw new Error('Failed to fetch reservation');
            }

            const data = await response.json();
            // Handle potential nested reservation object
            const reservationData = data.data?.reservation || data.data;
            setCurrentReservation(reservationData);
            setLoading(false);
            return reservationData;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            setLoading(false);
            return null;
        }
    }, []);

    // Create a new reservation
    const createReservation = useCallback(async (params: CreateReservationParams) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    unit_id: params.unitId,
                    startdate: params.startDate,
                    enddate: params.endDate,
                    email: params.email,
                    occupants: params.occupants,
                    first_name: params.firstName,
                    last_name: params.lastName,
                    zip: params.zip,
                    address: params.address,
                    city: params.city,
                    state: params.state,
                    cell_phone: params.cellPhone,
                    phone: params.phone,
                    coupon_code: params.couponCode
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create reservation');
            }

            const data = await response.json();
            // Handle potential nested reservation object
            const reservationData = data.data?.reservation || data.data;
            setCurrentReservation(reservationData);
            setLoading(false);
            return reservationData;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            setLoading(false);
            return null;
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const clearCurrentReservation = useCallback(() => {
        setCurrentReservation(null);
    }, []);

    return {
        reservations,
        currentReservation,
        loading,
        error,
        fetchReservations,
        getReservation,
        createReservation,
        clearError,
        clearCurrentReservation
    };
}
