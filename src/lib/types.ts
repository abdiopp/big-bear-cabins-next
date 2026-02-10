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
    gallery?: Array<{
        image_path: string;
        thumbnail_path: string;
    }>;
    lat?: number;
    lng?: number;
    amenities?: Array<{
        group_name: string;
        amenity_name: string;
    }>;
}


export interface Property {
    id: string | number;
    title: string;
    location: string;
    price: number;
    rating: number;
    reviewCount: number;
    imageUrl: string;
    images?: string[];
    bedrooms?: number;
    bathrooms?: number;
    guests?: number;
    dates: string;
    isSuperhost?: boolean;
    description?: string;
    amenities?: { group: string; name: string }[];
    host?: {
        isSuperhost: boolean;
    };
    latitude?: number;
    longitude?: number;
}
