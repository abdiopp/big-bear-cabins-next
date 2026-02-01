"use client";

import React from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

interface MapProps {
    latitude?: number;
    longitude?: number;
    address?: string;
}

const containerStyle = {
    width: "100%",
    height: "100%",
};

export const Map: React.FC<MapProps> = ({ latitude, longitude, address }) => {
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
    });

    const [map, setMap] = React.useState<google.maps.Map | null>(null);
    const [center, setCenter] = React.useState<{ lat: number; lng: number } | null>(null);

    React.useEffect(() => {
        if (latitude && longitude) {
            setCenter({ lat: latitude, lng: longitude });
        } else if (address && isLoaded) {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ address }, (results, status) => {
                if (status === "OK" && results && results[0]) {
                    const location = results[0].geometry.location;
                    setCenter({ lat: location.lat(), lng: location.lng() });
                } else {
                    console.error("Geocode was not successful for the following reason: " + status);
                }
            });
        }
    }, [latitude, longitude, address, isLoaded]);

    const onLoad = React.useCallback(
        (map: google.maps.Map) => {
            setMap(map);
        },
        []
    );

    const onUnmount = React.useCallback((map: google.maps.Map) => {
        setMap(null);
    }, []);

    if (!isLoaded) {
        return (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!center) {
        return (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500">
                {address ? "Loading map..." : "No location data"}
            </div>
        );
    }

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={14}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: true,
            }}
        >
            <Marker position={center} />
        </GoogleMap>
    );
};

