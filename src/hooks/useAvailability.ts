"use client";

import { useState, useEffect, useCallback } from 'react';
import type { CalendarDayRaw } from '@/lib/streamline-types';

interface AvailabilityDay {
    date: string;
    available: boolean;
    is_checkin_day?: boolean;
    is_checkout_day?: boolean;
    minimum_nights?: number;
    rate?: number;
}

interface BlockedDay {
    date: string;
    reason?: string;
}

interface UseAvailabilityOptions {
    unitId?: number;
    startDate: string;
    endDate: string;
    occupants?: number;
    adults?: number;
    children?: number;
    pets?: number;
    autoFetch?: boolean;
}

interface AvailabilityState {
    availability: AvailabilityDay[];
    blockedDays: BlockedDay[];
    calendarRaw: CalendarDayRaw[];
    isAvailable: boolean | null;
    loading: boolean;
    error: string | null;
}

export function useAvailability(options: UseAvailabilityOptions) {
    const {
        unitId,
        startDate,
        endDate,
        occupants = 1,
        adults,
        children,
        pets,
        autoFetch = true
    } = options;

    const [state, setState] = useState<AvailabilityState>({
        availability: [],
        blockedDays: [],
        calendarRaw: [],
        isAvailable: null,
        loading: false,
        error: null
    });

    const fetchAvailability = useCallback(async () => {
        if (!startDate || !endDate) {
            return;
        }

        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const response = await fetch('/api/availability', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'availability',
                    unit_id: unitId,
                    startdate: startDate,
                    enddate: endDate,
                    occupants,
                    disable_minimal_days: 1,
                    show_total_units: 1
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch availability');
            }

            const data = await response.json();

            setState(prev => ({
                ...prev,
                availability: data.data?.availability || [],
                loading: false
            }));
        } catch (err) {
            setState(prev => ({
                ...prev,
                error: err instanceof Error ? err.message : 'An error occurred',
                loading: false
            }));
        }
    }, [unitId, startDate, endDate, occupants]);

    const fetchBlockedDays = useCallback(async () => {
        if (!unitId || !startDate || !endDate) {
            return;
        }

        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const response = await fetch('/api/availability', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'blocked',
                    unit_id: unitId,
                    startdate: startDate,
                    enddate: endDate
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch blocked days');
            }

            const data = await response.json();

            setState(prev => ({
                ...prev,
                blockedDays: data.data?.blocked_days || [],
                loading: false
            }));
        } catch (err) {
            setState(prev => ({
                ...prev,
                error: err instanceof Error ? err.message : 'An error occurred',
                loading: false
            }));
        }
    }, [unitId, startDate, endDate]);

    const fetchCalendarRawData = useCallback(async () => {
        if (!unitId || !startDate || !endDate) {
            return;
        }

        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const response = await fetch('/api/availability', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'calendar_raw',
                    unit_id: unitId,
                    startdate: startDate,
                    enddate: endDate
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch calendar raw data');
            }

            const data = await response.json();

            setState(prev => ({
                ...prev,
                calendarRaw: data.data?.days || [],
                loading: false
            }));
        } catch (err) {
            setState(prev => ({
                ...prev,
                error: err instanceof Error ? err.message : 'An error occurred',
                loading: false
            }));
        }
    }, [unitId, startDate, endDate]);

    const verifyAvailability = useCallback(async (
        overrideParams?: {
            start?: string,
            end?: string,
            occupants?: number,
            adults?: number,
            children?: number,
            pets?: number
        }
    ) => {
        const useStart = overrideParams?.start || startDate;
        const useEnd = overrideParams?.end || endDate;
        const useOccupants = overrideParams?.occupants || occupants;
        const useAdults = overrideParams?.adults || adults;
        const useChildren = overrideParams?.children || children;
        const usePets = overrideParams?.pets || pets;

        if (!unitId || !useStart || !useEnd || !useOccupants) {
            return false;
        }

        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const response = await fetch('/api/availability', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'verify',
                    unit_id: unitId,
                    startdate: useStart,
                    enddate: useEnd,
                    occupants: useOccupants,
                    adults: useAdults,
                    children: useChildren,
                    pets: usePets
                })
            });

            if (!response.ok) {
                throw new Error('Failed to verify availability');
            }

            const data = await response.json();
            const isAvailable = data.data?.available === true || data.data?.available === 1;

            setState(prev => ({
                ...prev,
                isAvailable,
                loading: false
            }));

            return isAvailable;
        } catch (err) {
            setState(prev => ({
                ...prev,
                error: err instanceof Error ? err.message : 'An error occurred',
                loading: false,
                isAvailable: false
            }));
            return false;
        }
    }, [unitId, startDate, endDate, occupants, adults, children, pets]);

    useEffect(() => {
        if (autoFetch && startDate && endDate) {
            fetchAvailability();
        }
    }, [autoFetch, startDate, endDate, fetchAvailability]);

    return {
        ...state,
        fetchAvailability,
        fetchBlockedDays,
        fetchCalendarRawData,
        verifyAvailability,
        refetch: fetchAvailability
    };
}
