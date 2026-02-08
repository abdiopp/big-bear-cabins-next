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

            const res = await fetch(STREAMLINE_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    methodName,
                    params: {
                        token_key: tokenKey,
                        token_secret: tokenSecret,
                        ...params
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
}) {
    return streamlineRequest('GetPreReservationPrice', {
        pricing_model: 1,
        separate_taxes: 1,
        show_package_addons: 1,
        guest_deposits_show_all: 1,
        show_due_today: 1,
        optional_default_enabled: 1,
        return_payments: 'true',
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
    zip: string | number;
    address: string;
    city: string;
    state: string;
    cellphone: string;
    phone?: string;
    coupon_code?: string;
    // Payment fields - set to minimal for testing
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
}) {
    // Default values for testing (no real payment)
    const reservationParams = {
        madetype_id: 9,
        type_id: 2,
        payment_type_id: 1,
        status_id: 9,
        credit_card_amount: 0, // No charge for testing
        credit_card_charge_required: 0, // Don't require charge
        ...params,
        // Send multiple variations to ensures API picks one up
        state: params.state,
        client_state: params.state,
        State: params.state,
        ClientState: params.state,
        guest_state: params.state,
        GuestState: params.state,
        // Correct parameter names found via GetPropertyInfo
        state_name: params.state,
        country_name: 'US',
        region: params.state,
        province: params.state,
        state_id: params.state,
        StateID: params.state,
        state_province: params.state,
        state_code: params.state,
        country: 'US',
        client_country: 'US',

        cell_phone: params.cellphone,
        cellphone: params.cellphone,
        client_cell_phone: params.cellphone,
        mobile_phone: params.cellphone,
        CellPhone: params.cellphone
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
