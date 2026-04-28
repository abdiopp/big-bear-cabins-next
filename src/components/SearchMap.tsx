"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { Property } from "@/lib/types";
import Link from "next/link";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Star, X, Heart } from "lucide-react";

// Big Bear Lake center
const DEFAULT_CENTER = { lat: 34.2439, lng: -116.9114 };

// Keep map interactions and clustering focused on the cabins service area.
const CABINS_AREA_BOUNDS: google.maps.LatLngBoundsLiteral = {
  north: 34.335,
  south: 34.165,
  east: -116.77,
  west: -117.03,
};

const isWithinCabinsArea = (lat: number, lng: number) =>
  lat <= CABINS_AREA_BOUNDS.north &&
  lat >= CABINS_AREA_BOUNDS.south &&
  lng <= CABINS_AREA_BOUNDS.east &&
  lng >= CABINS_AREA_BOUNDS.west;

const isInViewportBounds = (
  lat: number,
  lng: number,
  bounds: google.maps.LatLngBoundsLiteral
) => lat <= bounds.north && lat >= bounds.south && lng <= bounds.east && lng >= bounds.west;

const MAP_OPTIONS: google.maps.MapOptions = {
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  disableDefaultUI: true,
  zoomControl: true,
  isFractionalZoomEnabled: false,
  minZoom: 10,
  maxZoom: 17,
  scrollwheel: true,
  gestureHandling: "greedy",
  clickableIcons: false,
  restriction: {
    latLngBounds: CABINS_AREA_BOUNDS,
    strictBounds: true,
  },
  styles: [
    { featureType: "poi", elementType: "geometry", stylers: [{ visibility: "off" }] },
    { featureType: "administrative", elementType: "geometry", stylers: [{ visibility: "off" }] },
    { featureType: "transit", elementType: "geometry", stylers: [{ visibility: "off" }] },
    { featureType: "administrative", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "landscape.man_made", elementType: "geometry", stylers: [{ visibility: "off" }] },
    { featureType: "landscape.natural", elementType: "geometry", stylers: [{ saturation: -100 }, { lightness: 8 }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#a0cfe4" }] },
    { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f5f5f0" }] },
    { featureType: "road.local", elementType: "geometry", stylers: [{ visibility: "simplified" }] },
    { featureType: "road.local", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "road.arterial", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
    { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#f5f3ee" }] },
    { featureType: "road.highway", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ visibility: "simplified" }] },
  ],
};

const LOCATION_CENTERS: Record<string, { lat: number; lng: number }> = {
  "11226": { lat: 34.2439, lng: -116.9114 },
  "17601": { lat: 34.2583, lng: -116.8469 },
  "23687": { lat: 34.2439, lng: -116.9114 },
  "13073": { lat: 34.2750, lng: -116.9526 },
  "17611": { lat: 34.2300, lng: -116.8900 },
};

const DEFAULT_PAGE_SIZE = 20;

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
  pageSize?: number;
  activeBatchIndex?: number;
  onRenderedPropertiesChange?: (
    renderedProperties: Property[],
    meta: { visibleCount: number; batchIndex: number; totalBatches: number }
  ) => void;
  onVisiblePropertiesChange?: (visibleProperties: Property[]) => void;
}

interface PropertyGroup {
  properties: Property[];
  lat: number;
  lng: number;
  id: string | number;
}

interface CanvasNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  property?: Property;
  properties?: Property[];
  moreCount?: number;
}

function getCabinMarkerOffset(index: number, total: number) {
  if (total <= 1) {
    return { offsetX: 0, offsetY: 0 };
  }

  // Use a Fermat/Golden-angle spiral to distribute many markers without overlap.
  const goldenAngle = 2.399963229728653; // ~137.5 degrees in radians
  const spacing = 14; // pixels base spacing
  const r = spacing * Math.sqrt(index + 1);
  const angle = index * goldenAngle - Math.PI / 2;

  return {
    offsetX: Math.cos(angle) * r,
    offsetY: Math.sin(angle) * r * 0.75,
  };
}

function getVisibleCabinsPerLocation(zoom: number, total: number) {
  if (total <= 5) return total;
  if (zoom >= 15) return total;
  if (zoom >= 14) return Math.min(total, 15);
  if (zoom >= 13) return Math.min(total, 10);
  return 5;
}

// ── Hover Preview Card ─────────────────────────────────────────────────────
const MapHoverPreviewCard = React.memo(function MapHoverPreviewCard({
  property,
  onMouseEnter,
  onMouseLeave,
  anchorStyle,
}: {
  property: Property;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  anchorStyle?: React.CSSProperties;
}) {
  return (
    <div
      className="max-lg:hidden"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: "translate(-50%, calc(-100% - 58px))",
        pointerEvents: "auto",
        zIndex: 50,
        ...anchorStyle,
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
  ,
  anchorStyle,
}: {
  property: Property;
  onClose: () => void;
  variant?: 'desktop' | 'mobile';
  anchorStyle?: React.CSSProperties;
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
        left: 0,
        top: 0,
        transform: "translate(-50%, calc(-100% - 58px))",
        pointerEvents: "auto",
        zIndex: 60,
        ...anchorStyle,
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
  pageSize = DEFAULT_PAGE_SIZE,
  activeBatchIndex: controlledBatchIndex,
  onRenderedPropertiesChange,
  onVisiblePropertiesChange,
}: SearchMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const [activePopup, setActivePopup] = useState<Property | null>(null);
  const [hoveredPopup, setHoveredPopup] = useState<Property | null>(null);
  const [mapZoom, setMapZoom] = useState(12);
  const [viewportBounds, setViewportBounds] =
    useState<google.maps.LatLngBoundsLiteral | null>(null);
  const [isMapIdle, setIsMapIdle] = useState(true);
  const hoverClearTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const viewportSyncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderedCanvasNodesRef = useRef<CanvasNode[]>([]);
  const viewportFilterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastRenderedSetKeyRef = useRef("");

  const mappableProperties = useMemo(
    () =>
      properties.filter(
        (p) =>
          p.latitude != null &&
          p.longitude != null &&
          !isNaN(Number(p.latitude)) &&
          !isNaN(Number(p.longitude)) &&
          Number(p.latitude) !== 0 &&
          Number(p.longitude) !== 0 &&
          isWithinCabinsArea(Number(p.latitude), Number(p.longitude))
      ),
    [properties]
  );

  const [visibleCabins, setVisibleCabins] = useState<Property[]>(mappableProperties);
  const [uncontrolledBatchIndex, setUncontrolledBatchIndex] = useState(0);
  const activeBatchIndex = controlledBatchIndex ?? uncontrolledBatchIndex;

  const totalBatches = useMemo(
    () => Math.max(1, Math.ceil(visibleCabins.length / pageSize)),
    [visibleCabins.length, pageSize]
  );

  const paginatedCabins = useMemo(() => {
    const start = activeBatchIndex * pageSize;
    return visibleCabins.slice(start, start + pageSize);
  }, [visibleCabins, activeBatchIndex, pageSize]);

  const syncViewportBounds = useCallback(() => {
    const bounds = mapRef.current?.getBounds();
    if (!bounds) return;

    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();

    setViewportBounds({
      north: northEast.lat(),
      east: northEast.lng(),
      south: southWest.lat(),
      west: southWest.lng(),
    });
  }, []);

  const updateVisibleCabinsForViewport = useCallback(() => {
    const bounds = mapRef.current?.getBounds();
    const nextVisible =
      bounds == null
        ? mappableProperties
        : mappableProperties.filter((property) => {
            const lat = Number(property.latitude);
            const lng = Number(property.longitude);
            return bounds.contains({ lat, lng });
          });

    setVisibleCabins(nextVisible);
    if (controlledBatchIndex == null) {
      setUncontrolledBatchIndex(0);
    }
    onVisiblePropertiesChange?.(nextVisible);
  }, [controlledBatchIndex, mappableProperties, onVisiblePropertiesChange]);

  const scheduleViewportFilter = useCallback(
    (delay = 120) => {
      if (viewportFilterTimeoutRef.current) {
        clearTimeout(viewportFilterTimeoutRef.current);
      }

      viewportFilterTimeoutRef.current = setTimeout(() => {
        updateVisibleCabinsForViewport();
      }, delay);
    },
    [updateVisibleCabinsForViewport]
  );

  const scheduleViewportSync = useCallback((delay = 120) => {
    if (viewportSyncTimeoutRef.current) {
      clearTimeout(viewportSyncTimeoutRef.current);
    }

    viewportSyncTimeoutRef.current = setTimeout(() => {
      syncViewportBounds();
    }, delay);
  }, [syncViewportBounds]);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    setMapZoom(map.getZoom() ?? 12);
    syncViewportBounds();
    updateVisibleCabinsForViewport();
  }, [syncViewportBounds, updateVisibleCabinsForViewport]);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
    if (viewportSyncTimeoutRef.current) {
      clearTimeout(viewportSyncTimeoutRef.current);
      viewportSyncTimeoutRef.current = null;
    }
    if (viewportFilterTimeoutRef.current) {
      clearTimeout(viewportFilterTimeoutRef.current);
      viewportFilterTimeoutRef.current = null;
    }
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

  useEffect(() => {
    return () => {
      if (viewportSyncTimeoutRef.current) {
        clearTimeout(viewportSyncTimeoutRef.current);
        viewportSyncTimeoutRef.current = null;
      }
      if (viewportFilterTimeoutRef.current) {
        clearTimeout(viewportFilterTimeoutRef.current);
        viewportFilterTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    setVisibleCabins(mappableProperties);
    if (controlledBatchIndex == null) {
      setUncontrolledBatchIndex(0);
    }
  }, [controlledBatchIndex, mappableProperties]);

  useEffect(() => {
    if (!onRenderedPropertiesChange) return;
    const mapDiv = mapRef.current?.getDiv();
    if (!mapDiv || mapDiv.offsetParent == null || mapDiv.clientWidth === 0 || mapDiv.clientHeight === 0) {
      return;
    }

    const renderedSetKey = paginatedCabins.map((property) => String(property.id)).join("|");
    if (renderedSetKey === lastRenderedSetKeyRef.current) return;
    lastRenderedSetKeyRef.current = renderedSetKey;

    onRenderedPropertiesChange(paginatedCabins, {
      visibleCount: visibleCabins.length,
      batchIndex: activeBatchIndex,
      totalBatches,
    });
  }, [
    onRenderedPropertiesChange,
    paginatedCabins,
    visibleCabins.length,
    activeBatchIndex,
    totalBatches,
  ]);

  useEffect(() => {
    if (controlledBatchIndex == null) return;
    const maxBatchIndex = Math.max(0, totalBatches - 1);
    if (controlledBatchIndex > maxBatchIndex) {
      onRenderedPropertiesChange?.(paginatedCabins, {
        visibleCount: visibleCabins.length,
        batchIndex: maxBatchIndex,
        totalBatches,
      });
    }
  }, [controlledBatchIndex, paginatedCabins, totalBatches, visibleCabins.length, onRenderedPropertiesChange]);

  // Group properties only by their exact stored coordinates so nearby cabins are not merged.
  const propertyGroups = useMemo(() => {
    const grouped = new Map<string, Property[]>();
    paginatedCabins.forEach((p) => {
      const key = `${p.latitude},${p.longitude}`;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(p);
    });

    return Array.from(grouped.values()).map((group) => ({
      properties: group,
      lat: Number(group[0].latitude),
      lng: Number(group[0].longitude),
      id: group[0].id, // Primary ID for the group
    }));
  }, [paginatedCabins]);

  const renderedMarkers = useMemo(() => {
    const visibleGroups =
      viewportBounds == null
        ? propertyGroups
        : propertyGroups.filter((group) =>
            isInViewportBounds(group.lat, group.lng, viewportBounds)
          );

    const nodes: Array<{
      id: string;
      lat: number;
      lng: number;
      offsetX: number;
      offsetY: number;
      property?: Property;
      properties?: Property[];
      moreCount?: number;
    }> = [];

    visibleGroups.forEach((group) => {
      const total = group.properties.length;
      const visibleCount = getVisibleCabinsPerLocation(mapZoom, total);

      // push visible properties
      group.properties.slice(0, visibleCount).forEach((property, index) => {
        const { offsetX, offsetY } = getCabinMarkerOffset(index, total);

        nodes.push({
          id: `property-${String(property.id)}`,
          lat: Number(property.latitude),
          lng: Number(property.longitude),
          offsetX,
          offsetY,
          property,
        });
      });

      // if there are remaining cabins, push a single '+N' overflow marker
      const remaining = total - visibleCount;
      if (remaining > 0) {
        // place the overflow marker just outside the last visible item
        const overflowIndex = visibleCount;
        const { offsetX, offsetY } = getCabinMarkerOffset(overflowIndex, total);

        nodes.push({
          id: `more-${String(group.id)}`,
          lat: group.lat,
          lng: group.lng,
          offsetX,
          offsetY,
          moreCount: remaining,
          properties: group.properties,
        });
      }
    });

    return nodes;
  }, [propertyGroups, mapZoom, viewportBounds]);

  // Map center
  const center = useMemo(() => {
    if (locationId && LOCATION_CENTERS[locationId]) return LOCATION_CENTERS[locationId];
    if (mappableProperties.length > 0) {
      const lats = mappableProperties.map((property) => Number(property.latitude));
      const lngs = mappableProperties.map((property) => Number(property.longitude));
      return {
        lat: lats.reduce((a, b) => a + b, 0) / lats.length,
        lng: lngs.reduce((a, b) => a + b, 0) / lngs.length,
      };
    }
    return DEFAULT_CENTER;
  }, [mappableProperties, locationId]);

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

  const handleZoomChanged = useCallback(() => {
    const nextZoom = mapRef.current?.getZoom();
    if (typeof nextZoom === "number") {
      setMapZoom(nextZoom);
    }
    setIsMapIdle(false);
    scheduleViewportSync();
    scheduleViewportFilter(150);
  }, [scheduleViewportSync, scheduleViewportFilter]);

  const handleDragStart = useCallback(() => {
    setIsMapIdle(false);
    scheduleViewportSync(180);
    scheduleViewportFilter(180);
  }, [scheduleViewportSync, scheduleViewportFilter]);

  const handleDragEnd = useCallback(() => {
    scheduleViewportSync(80);
    scheduleViewportFilter(80);
  }, [scheduleViewportSync, scheduleViewportFilter]);

  const handleMapIdle = useCallback(() => {
    setIsMapIdle(true);
    if (viewportSyncTimeoutRef.current) {
      clearTimeout(viewportSyncTimeoutRef.current);
      viewportSyncTimeoutRef.current = null;
    }
    if (viewportFilterTimeoutRef.current) {
      clearTimeout(viewportFilterTimeoutRef.current);
      viewportFilterTimeoutRef.current = null;
    }
    syncViewportBounds();
    updateVisibleCabinsForViewport();
  }, [syncViewportBounds, updateVisibleCabinsForViewport]);

  const handleMoreClick = useCallback(
    (node: { properties?: Property[] } | null) => {
      if (!mapRef.current || !node || !node.properties || node.properties.length === 0) return;

      clearHoverTimeout();
      setHoveredPopup(null);
      setActivePopup(null);
      onMarkerClick?.(null);

      const bounds = new google.maps.LatLngBounds();
      node.properties.forEach((p) => {
        bounds.extend({ lat: Number(p.latitude), lng: Number(p.longitude) });
      });

      mapRef.current.fitBounds(bounds, 80);
    },
    [clearHoverTimeout, onMarkerClick]
  );

  const drawCanvasMarkers = useCallback(() => {
    const canvas = canvasRef.current;
    const map = mapRef.current;
    const bounds = viewportBounds;
    if (!canvas || !map || !bounds) return;

    const mapDiv = map.getDiv();
    const rect = mapDiv.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    const dpr = window.devicePixelRatio || 1;

    if (canvas.width !== Math.round(width * dpr)) canvas.width = Math.round(width * dpr);
    if (canvas.height !== Math.round(height * dpr)) canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const projection = map.getProjection();
    const mapCenter = map.getCenter();
    if (!projection || !mapCenter) return;
    const centerPoint = projection.fromLatLngToPoint(mapCenter);
    if (!centerPoint) return;
    const scale = Math.pow(2, mapZoom);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.imageSmoothingEnabled = true;

    const visibleNodes: CanvasNode[] = [];
    const activeId = activePopup?.id == null ? null : String(activePopup.id);
    const hoveredIdString = hoveredPopup?.id == null ? null : String(hoveredPopup.id);

    renderedMarkers.forEach((node) => {
      const worldPoint = projection.fromLatLngToPoint(new google.maps.LatLng(node.lat, node.lng));
      if (!worldPoint) return;

      const x = (worldPoint.x - centerPoint.x) * scale + width / 2 + node.offsetX;
      const y = (worldPoint.y - centerPoint.y) * scale + height / 2 + node.offsetY;
      const isActive = !!node.property && String(node.property.id) === activeId;
      const isHovered = !!node.property && String(node.property.id) === hoveredIdString;
      const highlighted = isActive || isHovered;
      let label = "";
      if (node.moreCount && node.moreCount > 0) {
        label = `+${node.moreCount}`;
      } else if (node.property) {
        label = node.property.price > 0 ? `$${node.property.price}` : "-";
      }
      ctx.save();
      ctx.font = "700 11px sans-serif";
      const textWidth = Math.ceil(ctx.measureText(label).width);
      const pillWidth = Math.max(34, textWidth + 20);
      const pillHeight = 30;
      const left = x - pillWidth / 2;
      const top = y - pillHeight;
      const radius = 15;

      visibleNodes.push({
        id: node.id,
        x,
        y,
        width: pillWidth,
        height: pillHeight,
        property: node.property,
        properties: node.properties,
        moreCount: node.moreCount,
      });

      ctx.beginPath();
      ctx.moveTo(left + radius, top);
      ctx.lineTo(left + pillWidth - radius, top);
      ctx.quadraticCurveTo(left + pillWidth, top, left + pillWidth, top + radius);
      ctx.lineTo(left + pillWidth, top + pillHeight - radius);
      ctx.quadraticCurveTo(
        left + pillWidth,
        top + pillHeight,
        left + pillWidth - radius,
        top + pillHeight
      );
      ctx.lineTo(left + radius, top + pillHeight);
      ctx.quadraticCurveTo(left, top + pillHeight, left, top + pillHeight - radius);
      ctx.lineTo(left, top + radius);
      ctx.quadraticCurveTo(left, top, left + radius, top);
      ctx.closePath();
      // Use a distinct style for overflow markers
      if (node.moreCount && node.moreCount > 0) {
        ctx.fillStyle = highlighted ? "#111827" : "#f8fafc";
        ctx.strokeStyle = highlighted ? "#111827" : "#d1d5db";
      } else {
        ctx.fillStyle = highlighted ? "#111827" : "#ffffff";
        ctx.strokeStyle = highlighted ? "#111827" : "#d1d5db";
      }
      ctx.lineWidth = 2;
      ctx.shadowColor = "rgba(0,0,0,0.18)";
      ctx.shadowBlur = highlighted ? 10 : 6;
      ctx.shadowOffsetY = 3;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      ctx.stroke();
      ctx.fillStyle = highlighted ? "#ffffff" : "#222222";
      ctx.font = "700 11px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, x, top + pillHeight / 2 + 0.5);
      ctx.restore();
    });

    renderedCanvasNodesRef.current = visibleNodes;
  }, [activePopup?.id, hoveredPopup?.id, mapZoom, renderedMarkers]);

  useEffect(() => {
    if (!isLoaded) return;
    let raf = 0;
    raf = window.requestAnimationFrame(() => {
      drawCanvasMarkers();
    });

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [drawCanvasMarkers, isLoaded]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const mapDiv = map.getDiv();
    let hoverRaf = 0;

    const hitTest = (clientX: number, clientY: number) => {
      const rect = mapDiv.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const nodes = renderedCanvasNodesRef.current;

      for (let i = nodes.length - 1; i >= 0; i--) {
        const node = nodes[i];
        const left = node.x - node.width / 2;
        const right = node.x + node.width / 2;
        const top = node.y - node.height;
        const bottom = node.y;
        if (x >= left && x <= right && y >= top && y <= bottom) return node;
      }

      return null;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isMapIdle) return;
      if (hoverRaf) cancelAnimationFrame(hoverRaf);
      hoverRaf = requestAnimationFrame(() => {
        const hit = hitTest(event.clientX, event.clientY);
        if (!hit || !hit.property) {
          clearHoverTimeout();
          return;
        }

        const hitProp = hit.property;
        if (!activePopup || String(activePopup.id) !== String(hitProp.id)) {
          setHoveredPopup((current) => {
            if (current && String(current.id) === String(hitProp.id)) return current;
            return hitProp;
          });
        }
      });
    };

    const handleMouseLeave = () => {
      scheduleHoverClear();
    };

    const handleClick = (event: MouseEvent) => {
      const hit = hitTest(event.clientX, event.clientY);
      if (!hit) return;

      event.preventDefault();
      event.stopPropagation();

      if (hit.moreCount && hit.moreCount > 0) {
        handleMoreClick(hit);
        return;
      }

      if (hit.property) handleMarkerClick(hit.property);
    };

    mapDiv.addEventListener("mousemove", handleMouseMove, true);
    mapDiv.addEventListener("mouseleave", handleMouseLeave, true);
    mapDiv.addEventListener("click", handleClick, true);

    return () => {
      if (hoverRaf) cancelAnimationFrame(hoverRaf);
      mapDiv.removeEventListener("mousemove", handleMouseMove, true);
      mapDiv.removeEventListener("mouseleave", handleMouseLeave, true);
      mapDiv.removeEventListener("click", handleClick, true);
    };
  }, [activePopup, clearHoverTimeout, handleMarkerClick, isMapIdle, scheduleHoverClear]);

  const getAnchorStyle = useCallback(
    (node: { lat: number; lng: number; offsetX: number; offsetY: number } | undefined): React.CSSProperties | null => {
      if (!node) return null;

      const map = mapRef.current;
      if (!map) return null;

      const projection = map.getProjection();
      const mapCenter = map.getCenter();
      if (!projection || !mapCenter) return null;

      const worldPoint = projection.fromLatLngToPoint(
        new google.maps.LatLng(node.lat, node.lng)
      );
      const centerPoint = projection.fromLatLngToPoint(mapCenter);
      if (!worldPoint || !centerPoint) return null;

      const rect = map.getDiv().getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      const scale = Math.pow(2, mapZoom);

      return {
        left: (worldPoint.x - centerPoint.x) * scale + width / 2 + node.offsetX,
        top: (worldPoint.y - centerPoint.y) * scale + height / 2 + node.offsetY,
      };
    },
    [mapZoom]
  );

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
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onZoomChanged={handleZoomChanged}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onIdle={handleMapIdle}
        options={MAP_OPTIONS}
        onClick={handleClosePopup}
      />

      <div className="absolute inset-0 z-20 pointer-events-none">
        {(() => {
          const activeNode = renderedMarkers.find((node) => node.property && idsMatch(activePopup?.id, node.property.id));
          const hoveredNode = renderedMarkers.find((node) => node.property && idsMatch(hoveredPopup?.id, node.property.id));
          const activeAnchorStyle = getAnchorStyle(activeNode);
          const hoveredAnchorStyle = getAnchorStyle(hoveredNode);

          return (
            <>
              {/* Hover Preview */}
              {!activePopup && isMapIdle && hoveredPopup && hoveredNode && hoveredAnchorStyle && (
                <MapHoverPreviewCard
                  property={hoveredPopup}
                  onMouseEnter={handleHoverCardMouseEnter}
                  onMouseLeave={handleHoverCardMouseLeave}
                  anchorStyle={hoveredAnchorStyle}
                />
              )}

              {/* Popup */}
              {activePopup && activeNode && activeAnchorStyle && (
                <div className="max-lg:hidden">
                  <MapPopupCard
                    property={activePopup}
                    onClose={handleClosePopup}
                    variant="desktop"
                    anchorStyle={activeAnchorStyle}
                  />
                </div>
              )}
            </>
          );
        })()}
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none">
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%", display: "block" }}
        />
      </div>

      {/* Mobile Fixed Popup Card */}
      {activePopup && (
        <div className="lg:hidden absolute bottom-[96px] left-4 right-4 z-10 pointer-events-auto transition-all animate-in slide-in-from-bottom-4 fade-in-50 duration-200">
           <MapPopupCard property={activePopup} onClose={handleClosePopup} variant="mobile" />
        </div>
      )}
    </div>
  );
}
