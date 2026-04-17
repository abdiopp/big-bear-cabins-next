"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GoogleMap, useJsApiLoader, OverlayView } from "@react-google-maps/api";
import { Property } from "@/lib/types";
import Link from "next/link";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Star, X, Heart } from "lucide-react";

// Big Bear Lake center
const DEFAULT_CENTER = { lat: 34.2439, lng: -116.9114 };

const MAP_OPTIONS: google.maps.MapOptions = {
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  zoomControl: true,
  scrollwheel: true,
  clickableIcons: false,
  styles: [
    { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#a0cfe4" }] },
    { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f5f5f0" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
    { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#f5f3ee" }] },
  ],
};

const LOCATION_CENTERS: Record<string, { lat: number; lng: number }> = {
  "11226": { lat: 34.2439, lng: -116.9114 },
  "17601": { lat: 34.2583, lng: -116.8469 },
  "23687": { lat: 34.2439, lng: -116.9114 },
  "13073": { lat: 34.2750, lng: -116.9526 },
  "17611": { lat: 34.2300, lng: -116.8900 },
};

const idsMatch = (
  left: string | number | null | undefined,
  right: string | number | null | undefined
) => left != null && right != null && String(left) === String(right);

interface SearchMapProps {
  properties: Property[];
  hoveredId: string | number | null;
  onMarkerClick?: (id: string | number | null) => void;
  locationId?: string;
  focusedPropertyId?: string | number | null;
  focusRequestId?: number;
}

// ── Price Pill Marker ──────────────────────────────────────────────────────
const PriceMarker = React.memo(function PriceMarker({
  properties,
  isActive,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  properties: Property[];
  isActive: boolean;
  isHovered: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const isCluster = properties.length > 1;
  const price = properties[0].price > 0 ? `$${properties[0].price}` : "—";
  const display = isCluster ? `${properties.length} cabins` : price;
  const active = isActive || isHovered;

  return (
    <div style={{ position: "absolute", transform: "translate(-50%, -100%)" }}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onClick();
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          background: active ? "#222222" : "#ffffff",
          color: active ? "#ffffff" : "#222222",
          border: `2px solid ${active ? "#222222" : "#e0e0e0"}`,
          borderRadius: "20px",
          padding: "5px 11px",
          fontSize: "13px",
          fontWeight: 700,
          whiteSpace: "nowrap",
          cursor: "pointer",
          boxShadow: active ? "0 4px 14px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.14)",
          transition: "all 0.15s ease",
          outline: "none",
          lineHeight: "1.3",
          display: "block",
          fontFamily: "inherit",
          zIndex: active ? 100 : 1,
        }}
      >
        {display}
      </button>
    </div>
  );
});

// ── Hover Preview Card ─────────────────────────────────────────────────────
const MapHoverPreviewCard = React.memo(function MapHoverPreviewCard({
  property,
  onMouseEnter,
  onMouseLeave,
}: {
  property: Property;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <div
      className="max-lg:hidden"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: "absolute",
        transform: "translate(-50%, calc(-100% - 58px))",
        zIndex: 18,
      }}
    >
      <Link
        href={`/property/${property.id}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "block",
          width: "252px",
          background: "#ffffff",
          borderRadius: "14px",
          boxShadow: "0 8px 28px rgba(0,0,0,0.2)",
          overflow: "hidden",
          textDecoration: "none",
          color: "#111827",
        }}
      >
        <div style={{ height: "126px", overflow: "hidden" }}>
          <ImageWithFallback
            src={property.imageUrl}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div style={{ padding: "10px 12px 12px" }}>
          <h3
            style={{
              fontSize: "13px",
              fontWeight: 700,
              lineHeight: 1.35,
              margin: 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {property.title}
          </h3>

          <p
            style={{
              fontSize: "12px",
              color: "#6b7280",
              lineHeight: 1.35,
              margin: "4px 0 0",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {property.location}
          </p>

          <p
            style={{
              fontSize: "11px",
              color: "#6b7280",
              margin: "6px 0 0",
            }}
          >
            {[property.bedrooms ? `${property.bedrooms} bd` : null, property.bathrooms ? `${property.bathrooms} ba` : null, property.guests ? `${property.guests} guests` : null]
              .filter(Boolean)
              .join(" · ") || "Big Bear cabin"}
          </p>

          <div
            style={{
              marginTop: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
              {property.rating > 0 && (
                <>
                  <Star size={12} fill="#111827" color="#111827" />
                  <span style={{ fontSize: "12px", fontWeight: 600 }}>{property.rating.toFixed(1)}</span>
                </>
              )}
            </div>

            <span style={{ fontSize: "13px", fontWeight: 700 }}>
              {property.price > 0 ? `$${property.price}` : "—"}
              {property.price > 0 && (
                <span style={{ fontWeight: 400, fontSize: "11px", color: "#6b7280" }}>/night</span>
              )}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
});

// ── Map Popup Card ─────────────────────────────────────────────────────────
const MapPopupCard = React.memo(function MapPopupCard({
  property,
  onClose,
  variant = 'desktop'
}: {
  property: Property;
  onClose: () => void;
  variant?: 'desktop' | 'mobile';
}) {
  if (variant === 'mobile') {
    return (
      <Link
        href={`/property/${property.id}`}
        className="flex w-full bg-white rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.22)] h-[152px] text-gray-900 border border-gray-100/50"
        style={{ textDecoration: 'none' }}
      >
        <div className="relative w-[136px] h-full flex-shrink-0">
          <ImageWithFallback
            src={property.imageUrl}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-md rounded-full w-7 h-7 flex items-center justify-center shadow-sm hover:bg-white transition"
          >
            <X size={15} className="text-gray-800" />
          </button>
        </div>
        <div className="flex-1 p-[14px] flex flex-col relative bg-white">
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} 
            className="absolute top-3 right-3"
          >
            <Heart size={18} className="text-gray-900 hover:text-red-500 transition-colors" />
          </button>

          <div className="flex-1">
            <h3 className="text-[14px] font-[600] pr-7 truncate leading-tight">{property.title}</h3>
            <p className="text-[13px] text-gray-500 mt-1 truncate leading-tight">{property.location}</p>
            <p className="text-[13px] text-gray-500 mt-1 truncate leading-tight">May 10 – 15</p>
            
            <div className="flex items-center gap-[3px] mt-1 line-clamp-1">
              <Star size={11} className="fill-gray-900 text-gray-900 mb-[1px]" />
              <span className="text-[13px] font-[500] text-gray-900">
                {property.rating > 0 ? `${property.rating.toFixed(1)} (80)` : "New"}
              </span>
            </div>
          </div>

          <div className="mt-1">
            <p className="text-[14px] leading-tight text-gray-900">
              <span className="font-[600] text-[15px]">${property.price > 0 ? property.price : "—"}</span>{" "}
              {property.price > 0 && <span className="font-[400]">for 5 nights</span>}
            </p>
            <div className="mt-1">
               <span className="text-[11px] font-[500] text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded-[4px]">Free cancellation</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div
      className="max-lg:hidden"
      style={{
        position: "absolute",
        transform: "translate(-50%, calc(-100% - 58px))",
        zIndex: 20,
      }}
    >
      <div
        style={{
          width: "240px",
          background: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          overflow: "hidden",
          fontFamily: "inherit",
          position: "relative",
        }}
      >
        {/* Close button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            background: "rgba(255,255,255,0.9)",
            border: "none",
            borderRadius: "50%",
            width: "28px",
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 10,
            boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
          }}
        >
          <X size={14} />
        </button>

        {/* Image */}
        <div style={{ height: "140px", overflow: "hidden" }}>
          <ImageWithFallback
            src={property.imageUrl}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div style={{ padding: "12px" }}>
          <h3
            style={{
              fontWeight: 700,
              fontSize: "13px",
              margin: "0 0 4px 0",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              color: "#222222",
            }}
          >
            {property.title}
          </h3>
          <p
            style={{
              fontSize: "12px",
              color: "#717171",
              margin: "0 0 8px 0",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {property.location}
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
              {property.rating > 0 && (
                <>
                  <Star size={12} fill="#222222" color="#222222" />
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#222222" }}>
                    {property.rating.toFixed(1)}
                  </span>
                </>
              )}
            </div>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#222222" }}>
              {property.price > 0 ? `$${property.price}` : "—"}
              {property.price > 0 && (
                <span style={{ fontWeight: 400, fontSize: "11px", color: "#717171" }}>/night</span>
              )}
            </span>
          </div>

          <Link
            href={`/property/${property.id}`}
            style={{
              display: "block",
              marginTop: "10px",
              background: "#222222",
              color: "#ffffff",
              textAlign: "center",
              padding: "8px 0",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
});

// ── Main Search Map ────────────────────────────────────────────────────────
export function SearchMap({
  properties,
  hoveredId,
  onMarkerClick,
  locationId,
  focusedPropertyId,
  focusRequestId,
}: SearchMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const [activePopup, setActivePopup] = useState<Property | null>(null);
  const [hoveredPopup, setHoveredPopup] = useState<Property | null>(null);
  const hoverClearTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  const clearHoverTimeout = useCallback(() => {
    if (hoverClearTimeoutRef.current) {
      clearTimeout(hoverClearTimeoutRef.current);
      hoverClearTimeoutRef.current = null;
    }
  }, []);

  const scheduleHoverClear = useCallback(() => {
    clearHoverTimeout();
    hoverClearTimeoutRef.current = setTimeout(() => {
      setHoveredPopup(null);
    }, 120);
  }, [clearHoverTimeout]);

  useEffect(() => {
    return () => clearHoverTimeout();
  }, [clearHoverTimeout]);

  // Group properties by exact lat/lng to prevent overlapping marker chaos
  const propertyGroups = useMemo(() => {
    const validProps = properties.filter(
      (p) =>
        p.latitude != null &&
        p.longitude != null &&
        !isNaN(Number(p.latitude)) &&
        !isNaN(Number(p.longitude)) &&
        Number(p.latitude) !== 0 &&
        Number(p.longitude) !== 0
    );

    const grouped = new Map<string, Property[]>();
    validProps.forEach((p) => {
      // Create a key based on 4 decimal points (approx 10m precision)
      const lat = Number(p.latitude).toFixed(4);
      const lng = Number(p.longitude).toFixed(4);
      const key = `${lat},${lng}`;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(p);
    });

    return Array.from(grouped.values()).map((group) => ({
      properties: group,
      lat: Number(group[0].latitude),
      lng: Number(group[0].longitude),
      id: group[0].id, // Primary ID for the group
    }));
  }, [properties]);

  // Map center
  const center = useMemo(() => {
    if (locationId && LOCATION_CENTERS[locationId]) return LOCATION_CENTERS[locationId];
    if (propertyGroups.length > 0) {
      const lats = propertyGroups.map((g) => g.lat);
      const lngs = propertyGroups.map((g) => g.lng);
      return {
        lat: lats.reduce((a, b) => a + b, 0) / lats.length,
        lng: lngs.reduce((a, b) => a + b, 0) / lngs.length,
      };
    }
    return DEFAULT_CENTER;
  }, [propertyGroups, locationId]);

  const panToProperty = useCallback((property: Property) => {
    if (!mapRef.current) return;

    const lat = Number(property.latitude);
    const lng = Number(property.longitude);
    if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) return;

    mapRef.current.panTo({ lat, lng });
    const currentZoom = mapRef.current.getZoom() || 12;
    if (currentZoom < 15) {
      mapRef.current.setZoom(15);
    }
  }, []);

  useEffect(() => {
    if (focusedPropertyId == null) return;
    const focusedProperty = properties.find((property) =>
      idsMatch(property.id, focusedPropertyId)
    );
    if (!focusedProperty) return;

    clearHoverTimeout();
    setHoveredPopup(null);
    setActivePopup(focusedProperty);
    panToProperty(focusedProperty);
  }, [focusedPropertyId, focusRequestId, properties, clearHoverTimeout, panToProperty]);

  const handleMarkerMouseEnter = useCallback(
    (property: Property) => {
      clearHoverTimeout();
      if (activePopup) return;
      setHoveredPopup(property);
    },
    [activePopup, clearHoverTimeout]
  );

  const handleMarkerMouseLeave = useCallback(() => {
    scheduleHoverClear();
  }, [scheduleHoverClear]);

  const handleHoverCardMouseEnter = useCallback(() => {
    clearHoverTimeout();
  }, [clearHoverTimeout]);

  const handleHoverCardMouseLeave = useCallback(() => {
    scheduleHoverClear();
  }, [scheduleHoverClear]);

  const handleMarkerClick = useCallback(
    (property: Property) => {
      const isClosing = activePopup?.id === property.id;
      clearHoverTimeout();
      setHoveredPopup(null);
      setActivePopup(isClosing ? null : property);
      onMarkerClick?.(isClosing ? null : property.id);

      if (!isClosing && mapRef.current) {
        panToProperty(property);
      }
    },
    [activePopup, clearHoverTimeout, onMarkerClick, panToProperty]
  );

  const handleClosePopup = useCallback(() => {
    clearHoverTimeout();
    setHoveredPopup(null);
    setActivePopup(null);
    onMarkerClick?.(null);
  }, [clearHoverTimeout, onMarkerClick]);

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-2xl">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent" />
          <span className="text-sm text-gray-500">Loading map…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={MAP_OPTIONS}
        onClick={handleClosePopup}
      >
        {propertyGroups.map((group) => {
          const { lat, lng, properties: groupProps } = group;
          // Group is active if any of its properties is the activePopup
          const isActive = groupProps.some((p) => idsMatch(activePopup?.id, p.id));
          // Group is hovered if any of its properties is hovered
          const isHovered = groupProps.some(
            (p) => idsMatch(hoveredId, p.id) || idsMatch(hoveredPopup?.id, p.id)
          );
          const hoveredProperty = hoveredPopup
            ? groupProps.find((p) => idsMatch(hoveredPopup.id, p.id)) || null
            : null;

          return (
            <React.Fragment key={`group-${group.id}`}>
              {/* Price Pill */}
              <OverlayView
                position={{ lat, lng }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <PriceMarker
                  properties={groupProps}
                  isActive={isActive}
                  isHovered={isHovered}
                  onClick={() => handleMarkerClick(groupProps[0])}
                  onMouseEnter={() => handleMarkerMouseEnter(groupProps[0])}
                  onMouseLeave={handleMarkerMouseLeave}
                />
              </OverlayView>

              {/* Hover Preview */}
              {!activePopup && hoveredProperty && (
                <OverlayView
                  position={{ lat, lng }}
                  mapPaneName={OverlayView.FLOAT_PANE}
                >
                  <MapHoverPreviewCard
                    property={hoveredProperty}
                    onMouseEnter={handleHoverCardMouseEnter}
                    onMouseLeave={handleHoverCardMouseLeave}
                  />
                </OverlayView>
              )}

              {/* Popup */}
              {isActive && activePopup && (
                <div className="max-lg:hidden">
                  <OverlayView
                    position={{ lat, lng }}
                    mapPaneName={OverlayView.FLOAT_PANE}
                  >
                    <MapPopupCard property={activePopup} onClose={handleClosePopup} variant="desktop" />
                  </OverlayView>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </GoogleMap>

      {/* Mobile Fixed Popup Card */}
      {activePopup && (
        <div className="lg:hidden absolute bottom-[96px] left-4 right-4 z-10 pointer-events-auto transition-all animate-in slide-in-from-bottom-4 fade-in-50 duration-200">
           <MapPopupCard property={activePopup} onClose={handleClosePopup} variant="mobile" />
        </div>
      )}
    </div>
  );
}
