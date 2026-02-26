// lib/streamline-types.ts
// TypeScript interfaces for Streamline VRS API responses

export interface StreamlineApiResponse<T = any> {
    status: number;
    status_text: string;
    data: T;
}

// Token Management
export interface TokenExpirationResponse {
    expiration_date?: string;
    expiration?: string;
    is_expired?: boolean;
}

export interface RenewTokenResponse {
    token_key: string;
    token_secret: string;
    expiration_date?: string;
    enddate?: string;
}

// Property Information
export interface StreamlineProperty {
    id: number;
    name: string;
    location_name: string;
    state_name: string;
    rating_average: number;
    rating_count: number;
    daily_pricing_starting: number;
    default_image_path: string;
    bedrooms_number: number;
    bathrooms_number: number;
    max_occupants: number;
    global_description?: string;
    description?: string;
    gallery?: StreamlineGalleryImage[];
}

export interface StreamlineGalleryImage {
    id: number;
    image_path: string;
    thumbnail_path: string;
    image_title?: string;
    image_description?: string;
    sort_order?: number;
}

export interface PropertyGalleryResponse {
    property: {
        id: number;
        name: string;
        images: StreamlineGalleryImage[];
    };
}

export interface PropertyListResponse {
    property: StreamlineProperty[];
    total_count?: number;
    page_number?: number;
}

export interface PropertyInfoResponse {
    unit_id: number;
    name: string;
    bedrooms_number: number;
    bathrooms_number: number;
    max_occupants: number;
    location_name: string;
    state_name: string;
    country_name: string;
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    zip: string;
    global_description: string;
    description: string;
    checkin_time: string;
    checkout_time: string;
    default_image_path: string;
}

// Amenities
export interface StreamlineAmenity {
    id: number;
    name: string;
    category_name?: string;
    icon?: string;
}

export interface PropertyAmenitiesResponse {
    amenity: StreamlineAmenity[];
}

// Rates
export interface StreamlineRate {
    date: string;
    daily_rate: number;
    weekly_rate?: number;
    monthly_rate?: number;
    minimum_nights: number;
}

export interface PropertyRatesResponse {
    rates: StreamlineRate[];
    currency: string;
}

// Availability
export interface AvailabilityDay {
    date: string;
    available: boolean;
    is_checkin_day?: boolean;
    is_checkout_day?: boolean;
    minimum_nights?: number;
    rate?: number;
}

export interface PropertyAvailabilityResponse {
    unit_id: number;
    availability: AvailabilityDay[];
}

export interface BlockedDay {
    date: string;
    reason?: string;
}

export interface BlockedDaysResponse {
    unit_id: number;
    blocked_days: BlockedDay[];
}

// Reservations
export interface ReservationPrice {
    total: number;
    subtotal: number;
    taxes: number;
    fees: Array<{
        name: string;
        amount: number;
        type: string;
    }>;
    security_deposit?: number;
    currency: string;
    nights: number;
    average_nightly_rate: number;
}

export interface GetReservationPriceParams {
    unit_id: number;
    startdate: string;
    enddate: string;
    occupants: number;
    coupon_code?: string;
}

export interface MakeReservationParams {
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
    coupon_code?: string;
    referrer_url?: string;
    payment_comments?: string;
}

export interface ReservationResponse {
    confirmation_id: number;
    unit_id: number;
    status: string;
    status_id: number;
    guest_name: string;
    email: string;
    startdate: string;
    enddate: string;
    total: number;
    created_at: string;
}

export interface ReservationInfo {
    confirmation_id: number;
    unit_id: number;
    property_name: string;
    status: string;
    status_id: number;
    guest_first_name: string;
    guest_last_name: string;
    email: string;
    phone?: string;
    startdate: string;
    enddate: string;
    checkin_time: string;
    checkout_time: string;
    occupants: number;
    total: number;
    paid: number;
    balance_due: number;
    created_at: string;
    updated_at: string;
}

export interface ReservationsListResponse {
    reservations: ReservationInfo[];
    total_count: number;
}

// Guest Reviews
export interface GuestReview {
    id: number;
    unit_id: number;
    guest_name: string;
    rating: number;
    review_text: string;
    review_date: string;
    response?: string;
}

export interface GuestReviewsResponse {
    reviews: GuestReview[];
    average_rating: number;
    total_reviews: number;
}

// Countries
export interface Country {
    id: number;
    name: string;
    code: string;
}

export interface CountriesListResponse {
    countries: Country[];
}

// Front-end mapped types
export interface Property {
    id: string | number;
    title: string;
    location: string;
    price: number;
    rating: number;
    reviewCount: number;
    imageUrl: string;
    images: string[];
    bedrooms?: number;
    bathrooms?: number;
    guests?: number;
    dates: string;
    isSuperhost?: boolean;
    description?: string;
    amenities?: string[];
    checkinTime?: string;
    checkoutTime?: string;
}

export interface BookingDetails {
    propertyId: number;
    startDate: string;
    endDate: string;
    guests: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    zip: string;
    couponCode?: string;
}

// Calendar Raw Data
export interface CalendarDayRaw {
    date: string;
    daily_rate: number;
    minimum_nights: number;
    is_checkin_day: boolean;
    is_checkout_day: boolean;
}

export interface CalendarRawDataResponse {
    unit_id: number;
    month: number;
    year: number;
    days: CalendarDayRaw[];
}

export interface VerifyAvailabilityParams {
    unit_id: number;
    startdate: string;
    enddate: string;
    occupants?: number;
    adults?: number;
    children?: number;
    pets?: number;
}

// PreReservationPrice Types (GetPreReservationPrice API)
export interface PreReservationPriceFee {
    id: string;
    name: string | null;
    value: string;
    description: string | null;
    damage_waiver: string;
    travel_insurance: string;
    cfar: string;
    group_by_name?: string;
}

export interface PreReservationPriceOptionalFee extends PreReservationPriceFee {
    active: string;
}

export interface PreReservationPriceGuestDeposit {
    id: string;
    value: string;
    name: string;
    due_today: string;
    deposit_required: string;
}

export interface PreReservationPriceDay {
    date: string;
    season_id: string;
    season: string;
    price: string;
    extra: string;
    discount: string;
}

export interface PreReservationPriceSecurityDepositItem {
    ledger_id: string;
    description: string;
    deposit_required: string;
}

export interface PreReservationPriceSecurityDeposits {
    security_deposit: PreReservationPriceSecurityDepositItem[];
}

export interface PreReservationPriceResponse {
    unit_id: string;
    price: string;
    taxes: string;
    coupon_discount: string;
    total: string;
    first_day_price: string;
    unit_name: string;
    location_name: string;
    unit_rewards?: string;
    company_rewards?: string;
    reward_points_discount?: string | null;
    guest_deposits?: PreReservationPriceGuestDeposit | PreReservationPriceGuestDeposit[];
    required_fees?: PreReservationPriceFee[];
    optional_fees?: PreReservationPriceOptionalFee[];
    taxes_details?: PreReservationPriceFee[];
    reservation_days?: PreReservationPriceDay[];
    security_deposits?: PreReservationPriceSecurityDeposits;
    security_deposit_text?: string;
    due_today?: string;
}

