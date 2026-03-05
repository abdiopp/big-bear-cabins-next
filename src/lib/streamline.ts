// lib/streamline.ts
// Core Streamline VRS API client with automatic token refresh

import { getValidToken } from './streamline-token';
import type { StreamlineApiResponse } from './streamline-types';

const STREAMLINE_API_URL = 'https://web.streamlinevrs.com/api/json';

/**
 * Make a request to the Streamline VRS API
 * Automatically handles token refresh and retries
 */
export async function streamlineRequest<T = any>(
    methodName: string,
    params: Record<string, any> = {},
    retries = 3
): Promise<StreamlineApiResponse<T>> {
    let lastError: Error | null = null;

    for (let i = 0; i <= retries; i++) {
        try {
            if (i > 0) {
                const delay = Math.pow(2, i - 1) * 1000;
                console.log(`🔄 Retry attempt ${i} for ${methodName} after ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }

            // Get valid token (will auto-refresh if needed)
            const { tokenKey, tokenSecret } = await getValidToken();

            // Strip any token credentials from caller params to prevent stale overrides
            const { token_key: _tk, token_secret: _ts, ...cleanParams } = params;

            const res = await fetch(STREAMLINE_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    methodName,
                    params: {
                        ...cleanParams,
                        token_key: tokenKey,
                        token_secret: tokenSecret
                    }
                })
            });

            if (!res.ok) {
                throw new Error(`Streamline API responded with status ${res.status}`);
            }

            const data = await res.json();

            // Check for API-level errors
            if (data.status === 0 || data.status === -1) {
                throw new Error(`Streamline API error: ${data.status_text || 'Unknown error'}`);
            }

            return data as StreamlineApiResponse<T>;
        } catch (error: any) {
            lastError = error;
            console.error(`❌ Attempt ${i + 1} failed for ${methodName}:`, error.message);

            // Don't retry on the last attempt
            if (i === retries) break;
        }
    }

    throw lastError || new Error(`Failed to call ${methodName} after ${retries} retries`);
}

// ============================================
// Property Information Methods
// ============================================

export async function getPropertyList(params: {
    page?: number;
    id?: number;
    sort_by?: string;
    bedrooms_number?: number;
    max_occupants?: number;
    location_id?: number;
} = {}) {
    return streamlineRequest('GetPropertyList', {
        sort_by: 'price_daily_low',
        return_gallery: 1,
        return_amenities: 1,
        max_images_number: 20,
        page_results_number: params.id ? 1 : 12,
        ...params
    });
}

export async function getPropertyInfo(unitId: number) {
    return streamlineRequest('GetPropertyInfo', { unit_id: unitId });
}

export async function getPropertyGalleryImages(unitId: number) {
    return streamlineRequest('GetPropertyGalleryImages', {
        unit_id: unitId,
        max_images_number: 50
    });
}

export async function getPropertyAmenities(unitId: number) {
    return streamlineRequest('GetPropertyAmenities', { unit_id: unitId });
}

export async function getPropertyRates(unitId: number, startDate?: string, endDate?: string) {
    return streamlineRequest('GetPropertyRates', {
        unit_id: unitId,
        startdate: startDate,
        enddate: endDate
    });
}

export async function getPropertyRoomDetails(unitId: number) {
    return streamlineRequest('GetPropertyRoomDetails', { unit_id: unitId });
}

export async function getAmenities() {
    return streamlineRequest('GetAmenities', {});
}

export async function getNeighborhoodsList() {
    return streamlineRequest('GetNeighborhoodsList', {});
}

// ============================================
// Availability Methods
// ============================================

export async function getPropertyAvailability(params: {
    unit_id?: number;
    startdate: string;
    enddate: string;
    occupants?: number;
    disable_minimal_days?: number;
    show_total_units?: number;
}) {
    return streamlineRequest('GetPropertyAvailability', {
        disable_minimal_days: 1,
        show_total_units: 1,
        ...params
    });
}

export async function getBlockedDaysForUnit(unitId: number, startDate: string, endDate: string) {
    return streamlineRequest('GetBlockedDaysForUnit', {
        unit_id: unitId,
        startdate: startDate,
        enddate: endDate
    });
}

export async function getPropertyAvailabilityCalendarRawData(unitId: number, startDate: string, endDate: string) {
    return streamlineRequest('GetPropertyAvailabilityCalendarRawData', {
        unit_id: unitId,
        startdate: startDate,
        enddate: endDate
    });
}

export async function verifyPropertyAvailability(
    unitId: number,
    startDate: string,
    endDate: string,
    occupants?: number,
    adults?: number,
    children?: number,
    pets?: number
) {
    const params: any = {
        unit_id: unitId,
        startdate: startDate,
        enddate: endDate
    };

    if (occupants !== undefined) params.occupants = occupants;
    if (adults !== undefined) params.adults = adults;
    if (children !== undefined) params.children = children;
    if (pets !== undefined) params.pets = pets;

    return streamlineRequest('VerifyPropertyAvailability', params);
}

export async function getPropertyAvailabilityWithRates(params: {
    unit_id?: number;
    startdate: string;
    enddate: string;
    occupants?: number;
}) {
    return streamlineRequest('GetPropertyAvailabilityWithRates', params);
}

// ============================================
// Reservation Methods
// ============================================

export async function getReservationPrice(params: {
    unit_id: number;
    startdate: string;
    enddate: string;
    occupants: number;
    coupon_code?: string;
    show_bundled_fees?: number;
    show_security_deposit_information?: number;
}) {
    return streamlineRequest('GetReservationPrice', {
        show_bundled_fees: 1,
        show_security_deposit_information: 1,
        ...params
    });
}

export async function getPreReservationPrice(params: {
    unit_id: number;
    startdate: string;
    enddate: string;
    occupants: number;
    occupants_small?: number;
    pets?: number;
    coupon_code?: string;
    pricing_model?: number;
    separate_taxes?: number;
    show_package_addons?: number;
    guest_deposits_show_all?: number;
    show_due_today?: number;
    optional_default_enabled?: number;
    return_payments?: string;
    payment_type_id?: number;
    // Allow dynamic optional_fee_XXXX params
    [key: string]: any;
}) {
    return streamlineRequest('GetPreReservationPrice', {
        pricing_model: 1,
        separate_taxes: 1,
        show_package_addons: 1,
        guest_deposits_show_all: 1,
        show_due_today: 1,
        optional_default_enabled: 1,
        return_payments: 'true',
        payment_type_id: 1,
        ...params
    });
}

export async function makeReservation(params: {
    unit_id: number;
    startdate: string;
    enddate: string;
    email: string;
    occupants: number;
    first_name: string;
    last_name: string;
    zip?: string | number;
    address?: string;
    city?: string;
    state_name?: string;       // API field: state_name (not 'state')
    country_name?: string;     // API field: country_name, 2-char ISO, defaults to 'US'
    mobile_phone?: string;     // API field: mobile_phone (not 'cellphone')
    phone?: string;            // API field: phone (home phone)
    coupon_code?: string;
    occupants_small?: number;
    pets?: number;
    extra_notes?: string;
    client_comments?: string;
    // Payment fields
    madetype_id?: number;
    type_id?: number;
    payment_type_id?: number;
    status_id?: number;
    credit_card_amount?: number;
    credit_card_type_id?: number;
    credit_card_number?: number | string;
    credit_card_expiration_year?: number;
    credit_card_expiration_month?: number;
    credit_card_cid?: number | string;
    credit_card_charge_required?: number;
    referrer_url?: string;
    payment_comments?: string;
    // Allow dynamic optional_fee_XXXX params
    [key: string]: any;
}) {
    // Ensure phone is set for both fields as recommended by API docs
    const phoneValue = params.mobile_phone || params.phone || '';

    const reservationParams = {
        madetype_id: 9,       // Internet Reservation (NET)
        type_id: 2,           // Standard
        payment_type_id: 1,   // Credit Card
        status_id: 9,         // Non Blocked Request
        credit_card_charge_required: 1,
        referrer_url: 'https://bigbearcabins.com',
        ...params,
        // Always ensure phone fields are set (API docs recommend sending both)
        mobile_phone: phoneValue,
        phone: phoneValue,
        // Default country to US if not provided
        country_name: params.country_name || 'US',
    };

    console.log('🔍 MakeReservation params being sent:', JSON.stringify(reservationParams, null, 2));

    return streamlineRequest('MakeReservation', reservationParams);
}

export async function getReservations(params: {
    email?: string;
    startdate?: string;
    enddate?: string;
    status_id?: number;
    page?: number;
} = {}) {
    return streamlineRequest('GetReservations', params);
}

export async function getReservationInfo(confirmationId: number) {
    return streamlineRequest('GetReservationInfo', { confirmation_id: confirmationId });
}

export async function getGuestReviews(unitId: number) {
    return streamlineRequest('GetGuestReviews', { unit_id: unitId });
}

export async function getCountriesList() {
    return streamlineRequest('GetCountriesList', {});
}

export async function getCustomVacationQuote(params: {
    unit_id: number;
    startdate: string;
    enddate: string;
    occupants: number;
    email: string;
    first_name: string;
    last_name: string;
}) {
    return streamlineRequest('GetCustomVacationQuote', params);
}

// ============================================
// Owner Methods
// ============================================

export async function getOwnerInfo(ownerId: number) {
    return streamlineRequest('GetOwnerInfo', { owner_id: ownerId });
}

export async function getOwnerList() {
    return streamlineRequest('GetOwnerList', {});
}
