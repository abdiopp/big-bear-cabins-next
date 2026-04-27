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

const SINGLE_MARKER_RADIUS = 16;
const CLUSTER_MARKER_RADIUS = 22;

const LOCATION_CENTERS: Record<string, { lat: number; lng: number }> = {
  "11226": { lat: 34.2439, lng: -116.9114 },
  "17601": { lat: 34.2583, lng: -116.8469 },
  "23687": { lat: 34.2439, lng: -116.9114 },
  "13073": { lat: 34.2750, lng: -116.9526 },
  "17611": { lat: 34.2300, lng: -116.8900 },
};

const CLUSTER_GRID_SIZE_PX = 64;
const MAX_CLUSTER_ZOOM = 16;
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
  onRenderedPropertiesChange?: (
    renderedProperties: Property[],
    meta: { visibleCount: number; batchIndex: number; totalBatches: number }
  ) => void;
}

interface PropertyGroup {
  properties: Property[];
  lat: number;
  lng: number;
  id: string | number;
}

interface ClusterNode {
  id: string;
  lat: number;
  lng: number;
  groups: PropertyGroup[];
  properties: Property[];
  isCluster: boolean;
}

interface CanvasNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
  isCluster: boolean;
  label: string;
  property: Property;
  properties: Property[];
}

function projectToPixel(lat: number, lng: number, zoom: number) {
  const sinLat = Math.sin((lat * Math.PI) / 180);
  const clampedSinLat = Math.min(Math.max(sinLat, -0.9999), 0.9999);
  const scale = 256 * Math.pow(2, zoom);

  return {
    x: ((lng + 180) / 360) * scale,
    y:
      (0.5 -
        Math.log((1 + clampedSinLat) / (1 - clampedSinLat)) / (4 * Math.PI)) *
      scale,
  };
}

function buildMarkerIcon(
  isActive: boolean,
  isCluster: boolean
): google.maps.Symbol {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    scale: isCluster ? CLUSTER_MARKER_RADIUS : SINGLE_MARKER_RADIUS,
    fillColor: isActive ? "#111827" : isCluster ? "#1f2937" : "#ffffff",
    fillOpacity: 1,
    strokeColor: isActive ? "#111827" : isCluster ? "#ffffff" : "#d1d5db",
    strokeWeight: 2,
  };
}

function buildMarkerLabel(
  text: string,
  isActive: boolean,
  isCluster: boolean
): google.maps.MarkerLabel {
  return {
    text,
    color: isActive ? "#ffffff" : isCluster ? "#ffffff" : "#111827",
    fontSize: isCluster ? "12px" : "11px",
    fontWeight: "700",
  };
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
  onRenderedPropertiesChange,
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
  const [activeBatchIndex, setActiveBatchIndex] = useState(0);

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
    setActiveBatchIndex(0);
  }, [mappableProperties]);

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
    setActiveBatchIndex(0);
  }, [mappableProperties]);

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

  // Group properties by exact lat/lng to prevent overlapping marker chaos
  const propertyGroups = useMemo(() => {
    const grouped = new Map<string, Property[]>();
    paginatedCabins.forEach((p) => {
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
  }, [paginatedCabins]);

  const clusteredMarkers = useMemo<ClusterNode[]>(() => {
    const visibleGroups =
      viewportBounds == null
        ? propertyGroups
        : propertyGroups.filter((group) =>
            isInViewportBounds(group.lat, group.lng, viewportBounds)
          );

    if (visibleGroups.length === 0) return [];

    if (mapZoom >= MAX_CLUSTER_ZOOM) {
      return visibleGroups.map((group) => ({
        id: `group-${String(group.id)}`,
        lat: group.lat,
        lng: group.lng,
        groups: [group],
        properties: group.properties,
        isCluster: false,
      }));
    }

    const buckets = new Map<string, PropertyGroup[]>();
    for (const group of visibleGroups) {
      const { x, y } = projectToPixel(group.lat, group.lng, mapZoom);
      const bucketX = Math.floor(x / CLUSTER_GRID_SIZE_PX);
      const bucketY = Math.floor(y / CLUSTER_GRID_SIZE_PX);
      const key = `${bucketX},${bucketY}`;

      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key)!.push(group);
    }

    return Array.from(buckets.entries()).map(([bucketKey, groups]) => {
      const propertiesInBucket = groups.flatMap((group) => group.properties);
      const total = groups.reduce((sum, group) => sum + group.properties.length, 0);
      const weightedLat =
        groups.reduce(
          (sum, group) => sum + group.lat * group.properties.length,
          0
        ) / total;
      const weightedLng =
        groups.reduce(
          (sum, group) => sum + group.lng * group.properties.length,
          0
        ) / total;
      const isCluster = groups.length > 1;

      return {
        id: isCluster
          ? `cluster-${mapZoom}-${bucketKey}`
          : `group-${String(groups[0].id)}`,
        lat: isCluster ? weightedLat : groups[0].lat,
        lng: isCluster ? weightedLng : groups[0].lng,
        groups,
        properties: propertiesInBucket,
        isCluster,
      };
    });
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

  const handleClusterClick = useCallback(
    (cluster: ClusterNode) => {
      if (!mapRef.current || !cluster.isCluster) return;

      clearHoverTimeout();
      setHoveredPopup(null);
      setActivePopup(null);
      onMarkerClick?.(null);

      const bounds = new google.maps.LatLngBounds();
      cluster.groups.forEach((group) => {
        bounds.extend({ lat: group.lat, lng: group.lng });
      });

      mapRef.current.fitBounds(bounds, 80);
      google.maps.event.addListenerOnce(mapRef.current, "idle", () => {
        const zoomAfterFit = mapRef.current?.getZoom() ?? 12;
        if (zoomAfterFit > MAX_CLUSTER_ZOOM) {
          mapRef.current?.setZoom(MAX_CLUSTER_ZOOM);
        }
      });
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
    const zoom = mapZoom;
    const activeId = activePopup?.id == null ? null : String(activePopup.id);
    const hoveredIdString = hoveredPopup?.id == null ? null : String(hoveredPopup.id);

    const visibleGroups = propertyGroups.filter((group) =>
      isInViewportBounds(group.lat, group.lng, bounds)
    );

    const clusters: ClusterNode[] = (() => {
      if (visibleGroups.length === 0) return [];

      if (zoom >= MAX_CLUSTER_ZOOM) {
        return visibleGroups.map((group) => ({
          id: `group-${String(group.id)}`,
          lat: group.lat,
          lng: group.lng,
          groups: [group],
          properties: group.properties,
          isCluster: false,
        }));
      }

      const buckets = new Map<string, PropertyGroup[]>();
      for (const group of visibleGroups) {
        const { x, y } = projectToPixel(group.lat, group.lng, zoom);
        const bucketX = Math.floor(x / CLUSTER_GRID_SIZE_PX);
        const bucketY = Math.floor(y / CLUSTER_GRID_SIZE_PX);
        const key = `${bucketX},${bucketY}`;

        if (!buckets.has(key)) buckets.set(key, []);
        buckets.get(key)!.push(group);
      }

      return Array.from(buckets.entries()).map(([bucketKey, groups]) => {
        const propertiesInBucket = groups.flatMap((group) => group.properties);
        const total = groups.reduce((sum, group) => sum + group.properties.length, 0);
        const weightedLat =
          groups.reduce((sum, group) => sum + group.lat * group.properties.length, 0) /
          total;
        const weightedLng =
          groups.reduce((sum, group) => sum + group.lng * group.properties.length, 0) /
          total;
        const isCluster = groups.length > 1;

        return {
          id: isCluster
            ? `cluster-${zoom}-${bucketKey}`
            : `group-${String(groups[0].id)}`,
          lat: isCluster ? weightedLat : groups[0].lat,
          lng: isCluster ? weightedLng : groups[0].lng,
          groups,
          properties: propertiesInBucket,
          isCluster,
        };
      });
    })();

    clusters.forEach((node) => {
      const worldPoint = projection.fromLatLngToPoint(new google.maps.LatLng(node.lat, node.lng));
      if (!worldPoint) return;

      const x = (worldPoint.x - centerPoint.x) * scale + width / 2;
      const y = (worldPoint.y - centerPoint.y) * scale + height / 2;
      const primaryProperty = node.properties[0];
      const isActive = node.properties.some((p) => String(p.id) === activeId);
      const isHovered = node.properties.some((p) => String(p.id) === hoveredIdString);
      const highlighted = isActive || isHovered;

      if (node.isCluster) {
        const radius = 22;
        visibleNodes.push({
          id: node.id,
          x,
          y,
          width: radius * 2,
          height: radius * 2,
          radius,
          isCluster: true,
          label: String(node.properties.length),
          property: primaryProperty,
          properties: node.properties,
        });

        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = highlighted ? "#111827" : "#1f2937";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();
        ctx.fillStyle = "#ffffff";
        ctx.font = "700 12px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(node.properties.length), x, y + 0.5);
        ctx.restore();
        return;
      }

      const label = primaryProperty.price > 0 ? `$${primaryProperty.price}` : "-";
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
        radius,
        isCluster: false,
        label,
        property: primaryProperty,
        properties: node.properties,
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
      ctx.fillStyle = highlighted ? "#111827" : "#ffffff";
      ctx.strokeStyle = highlighted ? "#111827" : "#d1d5db";
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
  }, [activePopup?.id, hoveredPopup?.id, mapZoom, propertyGroups, viewportBounds]);

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
        if (node.isCluster) {
          const dx = x - node.x;
          const dy = y - node.y;
          if (Math.sqrt(dx * dx + dy * dy) <= node.radius + 4) return node;
        } else {
          const left = node.x - node.width / 2;
          const right = node.x + node.width / 2;
          const top = node.y - node.height;
          const bottom = node.y;
          if (x >= left && x <= right && y >= top && y <= bottom) return node;
        }
      }

      return null;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isMapIdle) return;
      if (hoverRaf) cancelAnimationFrame(hoverRaf);
      hoverRaf = requestAnimationFrame(() => {
        const hit = hitTest(event.clientX, event.clientY);
        if (!hit || hit.isCluster) {
          clearHoverTimeout();
          return;
        }

        if (!activePopup || String(activePopup.id) !== String(hit.property.id)) {
          setHoveredPopup((current) => {
            if (current && String(current.id) === String(hit.property.id)) return current;
            return hit.property;
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

      if (hit.isCluster) {
        const cluster = clusteredMarkers.find((node) => node.id === hit.id);
        if (cluster) handleClusterClick(cluster);
        return;
      }

      handleMarkerClick(hit.property);
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
  }, [activePopup, clearHoverTimeout, clusteredMarkers, handleClusterClick, handleMarkerClick, isMapIdle, scheduleHoverClear]);

  const getAnchorStyle = useCallback(
    (node: ClusterNode | undefined): React.CSSProperties | null => {
      if (!node || node.isCluster) return null;

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
        left: (worldPoint.x - centerPoint.x) * scale + width / 2,
        top: (worldPoint.y - centerPoint.y) * scale + height / 2,
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
          const activeNode = clusteredMarkers.find((node) =>
            node.properties.some((p) => idsMatch(activePopup?.id, p.id))
          );
          const hoveredNode = clusteredMarkers.find((node) =>
            node.properties.some((p) => idsMatch(hoveredPopup?.id, p.id))
          );
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
