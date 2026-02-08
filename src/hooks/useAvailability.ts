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

            // Handle various response formats from Streamline API
            let blockedDaysArray: BlockedDay[] = [];

            // Check for different response structures
            const responseData = data.data || data;

            if (responseData.blocked_days) {
                // Array format
                blockedDaysArray = Array.isArray(responseData.blocked_days)
                    ? responseData.blocked_days
                    : [responseData.blocked_days];
            } else if (responseData.day) {
                // Object format with 'day' key
                blockedDaysArray = Array.isArray(responseData.day)
                    ? responseData.day.map((d: any) => ({ date: d.date || d, reason: d.reason }))
                    : [{ date: responseData.day.date || responseData.day, reason: responseData.day.reason }];
            } else if (Array.isArray(responseData)) {
                // Direct array of dates or objects
                blockedDaysArray = responseData.map((item: any) =>
                    typeof item === 'string' ? { date: item } : item
                );
            }

            // Normalize date formats (API may return MM/DD/YYYY, convert to YYYY-MM-DD)
            const normalizedBlockedDays = blockedDaysArray.map(day => {
                let dateStr = day.date;
                // Check if date is in MM/DD/YYYY format
                if (dateStr && dateStr.includes('/')) {
                    const parts = dateStr.split('/');
                    if (parts.length === 3) {
                        // Convert MM/DD/YYYY to YYYY-MM-DD
                        dateStr = `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
                    }
                }
                return { ...day, date: dateStr };
            });

            setState(prev => ({
                ...prev,
                blockedDays: normalizedBlockedDays,
                loading: false
            }));
        } catch (err) {
            console.error('Error fetching blocked days:', err);
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

            // Handle blocked_period format: array of {startdate, enddate, reason}
            const blockedPeriods = data.data?.blocked_period || [];
            const expandedBlockedDays: BlockedDay[] = [];

            // Helper to parse MM/DD/YYYY date string
            const parseDate = (dateStr: string): Date | null => {
                if (!dateStr) return null;
                const parts = dateStr.split('/');
                if (parts.length === 3) {
                    return new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
                }
                return null;
            };

            // Expand date ranges into individual dates
            blockedPeriods.forEach((period: any) => {
                const start = parseDate(period.startdate);
                const end = parseDate(period.enddate);

                if (start && end) {
                    const current = new Date(start);
                    while (current <= end) {
                        expandedBlockedDays.push({
                            date: `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`,
                            reason: period.reason
                        });
                        current.setDate(current.getDate() + 1);
                    }
                }
            });

            // Also update blockedDays state with the expanded dates
            setState(prev => ({
                ...prev,
                calendarRaw: data.data?.days || [],
                blockedDays: expandedBlockedDays,
                loading: false
            }));
        } catch (err) {
            console.error('Error fetching calendar raw data:', err);
            setState(prev => ({
                ...prev,
                error: err instanceof Error ? err.message : 'An error occurred',
                loading: false
            }));
        }
    }, [unitId, startDate, endDate]);

    // Reset availability state when dates or unit changes
    useEffect(() => {
        setState(prev => ({
            ...prev,
            isAvailable: null,
            error: null
        }));
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
        // calendar_raw doesn't strictly need occupants/adults/children/pets for blocking info,
        // but we keep the signature compatible

        if (!unitId || !useStart || !useEnd) {
            return false;
        }

        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            // Use the verify endpoint to check availability with all specific constraints (guests, pets, etc.)
            const response = await fetch('/api/availability', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'verify',
                    unit_id: unitId,
                    startdate: useStart,
                    enddate: useEnd,
                    occupants: overrideParams?.occupants ?? occupants,
                    adults: overrideParams?.adults ?? adults,
                    children: overrideParams?.children ?? children,
                    pets: overrideParams?.pets ?? pets
                })
            });

            if (!response.ok) {
                // If the API returns an error (e.g. status 0 from Streamline), it means verification failed
                // Parse the error message if possible
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Availability verification failed');
            }

            const data = await response.json();

            // If we get here, the API returned success (status 1), meaning dates are available
            // VerifyPropertyAvailability returns detailed data, but the presence of success data implies availability

            setState(prev => ({
                ...prev,
                isAvailable: true,
                loading: false
            }));

            return true;
        } catch (err) {
            console.error('Error in verifyAvailability:', err);
            setState(prev => ({
                ...prev,
                error: err instanceof Error ? err.message : 'An error occurred',
                isAvailable: false,
                loading: false
            }));
            return false;
        }
    }, [unitId, startDate, endDate]);

    // Auto-fetch availability when dates are set
    useEffect(() => {
        if (autoFetch && startDate && endDate) {
            fetchAvailability();
        }
    }, [autoFetch, startDate, endDate, fetchAvailability]);

    // Auto-fetch blocked days when unitId is set (for calendar display)
    useEffect(() => {
        if (autoFetch && unitId && startDate && endDate) {
            fetchBlockedDays();
        }
    }, [autoFetch, unitId, startDate, endDate, fetchBlockedDays]);

    return {
        ...state,
        fetchAvailability,
        fetchBlockedDays,
        fetchCalendarRawData,
        verifyAvailability,
        refetch: fetchAvailability
    };
}
