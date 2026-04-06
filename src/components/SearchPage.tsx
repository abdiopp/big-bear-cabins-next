"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Filter, AlertCircle, MapPin, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { SearchPropertyCard } from "./SearchPropertyCard";
import { useProperties } from "@/hooks/useProperties";
import { PropertyCardSkeleton } from "./PropertyCardSkeleton";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import dynamic from "next/dynamic";
import { Drawer as DrawerPrimitive } from "vaul";

// Lazy-load the map to avoid SSR issues and improve initial load
const SearchMap = dynamic(
  () => import("./SearchMap").then((m) => ({ default: m.SearchMap })),
  { ssr: false, loading: () => <MapLoadingPlaceholder /> }
);

function MapLoadingPlaceholder() {
  return (
    <div className="w-full h-full rounded-2xl bg-gray-100 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-800 border-t-transparent" />
        <span className="text-sm text-gray-500">Loading map…</span>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const parseApiDateToInput = (apiDate: string | null): string => {
  if (!apiDate) return "";
  const parts = apiDate.split("/");
  if (parts.length !== 3) return "";
  const [month, day, year] = parts;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

const formatInputToApiDate = (inputDate: string): string => {
  if (!inputDate) return "";
  const parts = inputDate.split("-");
  if (parts.length !== 3) return "";
  const [year, month, day] = parts;
  return `${month}/${day}/${year}`;
};

// ── Constants ─────────────────────────────────────────────────────────────────
const LOCATIONS = [
  { id: "", label: "Any Location" },
  { id: "11226", label: "Big Bear Lake" },
  { id: "17601", label: "Big Bear City East" },
  { id: "23687", label: "Lakefront Location" },
  { id: "13073", label: "North Shore / Fawnskin" },
  { id: "17611", label: "Ski Resorts" },
];

const BEDROOM_OPTIONS = [
  { value: "", label: "Any Bedrooms" },
  { value: "1", label: "1 Bedroom" },
  { value: "2", label: "2 Bedrooms" },
  { value: "3", label: "3 Bedrooms" },
  { value: "4", label: "4 Bedrooms" },
  { value: "5", label: "5 Bedrooms" },
  { value: "6", label: "6 Bedrooms" },
  { value: "7", label: "7 Bedrooms" },
  { value: "9", label: "9 Bedrooms" },
  { value: "10", label: "10 Bedrooms" },
  { value: "13", label: "13 Bedrooms" },
];

const SORT_OPTIONS = [
  { value: "price_daily_low", label: "Price: Low to High" },
  { value: "price_daily_high", label: "Price: High to Low" },
  { value: "bedrooms_number_desc", label: "Bedrooms: Most First" },
  { value: "bedrooms_number_asc", label: "Bedrooms: Fewest First" },
  { value: "max_occupants_desc", label: "Guests: Most First" },
  { value: "max_occupants_asc", label: "Guests: Fewest First" },
];

// Navbar is h-24 (96px) + search bar is ~65px = ~161px total top offset
const STICKY_TOP = 96; // navbar height in px

export function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // ── Filters ───────────────────────────────────────────────────────────────
  const [checkIn, setCheckIn] = useState(() =>
    parseApiDateToInput(searchParams.get("checkIn"))
  );
  const [checkOut, setCheckOut] = useState(() =>
    parseApiDateToInput(searchParams.get("checkOut"))
  );
  const [guests, setGuests] = useState(() => searchParams.get("occupants") || "");
  const [children, setChildren] = useState(
    () => searchParams.get("occupants_small") || ""
  );
  const [pets, setPets] = useState(() => searchParams.get("pets") === "true");
  const [bedrooms, setBedrooms] = useState(
    () => searchParams.get("bedrooms") || ""
  );
  const [location, setLocation] = useState<string>("");
  const [dates, setDates] = useState<{ startDate: string; endDate: string }>({
    startDate: "",
    endDate: "",
  });
  const [snap, setSnap] = useState<number | string | null>(0.65);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState(
    () => searchParams.get("sort_by") || "price_daily_low"
  );
  const [activeFilters, setActiveFilters] = useState<string[]>(() => {
    const f = searchParams.get("filters");
    return f ? f.split(",") : [];
  });
  const [filters, setFilters] = useState({
    mountainView: false,
    lakefront: false,
    boatDock: false,
    evCharger: false,
    hotTub: false,
  });

  useEffect(() => {
    setFilters({
      mountainView: activeFilters.includes("mountainView"),
      lakefront: activeFilters.includes("lakefront"),
      boatDock: activeFilters.includes("boatDock"),
      evCharger: activeFilters.includes("evCharger"),
      hotTub: activeFilters.includes("hotTub"),
    });
  }, [activeFilters]);

  // ── Map / card interaction state ──────────────────────────────────────────
  const [hoveredCardId, setHoveredCardId] = useState<string | number | null>(null);
  const [activeMarkerId, setActiveMarkerId] = useState<string | number | null>(null);

  // ── Mobile map toggle ─────────────────────────────────────────────────────
  const [showMap, setShowMap] = useState(false);

  // ── API params ────────────────────────────────────────────────────────────
  const searchApiParams = useMemo(() => {
    const startdate = formatInputToApiDate(checkIn);
    const enddate = formatInputToApiDate(checkOut);
    return {
      ...(startdate && { startdate }),
      ...(enddate && { enddate }),
      ...(guests && { occupants: parseInt(guests) }),
      ...(children && { occupants_small: parseInt(children) }),
      ...(pets && { pets: Boolean(pets) }),
      ...(activeFilters.length > 0 && { filters: activeFilters }),
      ...(bedrooms && { bedrooms_number: parseInt(bedrooms) }),
      ...(location && { location_area_id: parseInt(location) }),
      ...(sortBy && { sort_by: sortBy }),
    };
  }, [checkIn, checkOut, guests, children, pets, activeFilters, bedrooms, location, sortBy]);

  const { properties, loading, error } = useProperties(1, searchApiParams);

  // ── URL sync ──────────────────────────────────────────────────────────────
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (checkIn) params.set("checkIn", formatInputToApiDate(checkIn));
    if (checkOut) params.set("checkOut", formatInputToApiDate(checkOut));
    if (guests) params.set("occupants", guests);
    if (children) params.set("occupants_small", children);
    if (pets) params.set("pets", "true");
    if (activeFilters.length > 0) params.set("filters", activeFilters.join(","));
    if (bedrooms) params.set("bedrooms", bedrooms);
    if (location) params.set("location", location);
    if (sortBy && sortBy !== "price_daily_low") params.set("sort_by", sortBy);
    router.push(`/search?${params.toString()}`);
  };

  const handleFilterChange = (filterKey: keyof typeof filters) => {
    setFilters((prev) => {
      const updated = { ...prev, [filterKey]: !prev[filterKey] };
      setActiveFilters(
        Object.keys(updated).filter((k) => updated[k as keyof typeof updated])
      );
      return updated;
    });
  };

  const activeFilterCount = useMemo(() => {
    let count = activeFilters.length;
    if (guests && parseInt(guests) > 0) count++;
    if (children && parseInt(children) > 0) count++;
    if (pets) count++;
    if (sortBy && sortBy !== "price_daily_low") count++;
    return count;
  }, [activeFilters, guests, children, pets, sortBy]);

  const handleMarkerClick = useCallback((id: string | number | null) => {
    setActiveMarkerId(id);
  }, []);

  const selectClass =
    "h-9 rounded-md border border-input bg-[#f3f3f5] px-3 py-1 text-sm text-gray-600 shadow-sm focus:outline-none focus:ring-1 focus:ring-ring";

  // Effective hovered = either hovered card OR active marker
  const effectiveHoveredId = hoveredCardId ?? activeMarkerId;

  // search bar is ~57px → total pinned offset = navbar(96) + searchbar(57) = 153px
  const MAP_TOP = 153;

  return (
    <div className="flex flex-col bg-gray-50">
      {/* ── Search / Filter Bar (Desktop) ─────────────────────────────────── */}
      <div
        className="bg-white border-b z-20 flex-shrink-0 max-lg:hidden"
        style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}
      >
        <div className="px-4 sm:px-6 py-3">
          <div className="flex flex-wrap gap-2 items-center">

            {/* Location */}
            <div className="flex-1 min-w-[140px]">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={selectClass + " w-full"}
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Arrival */}
            <div className="flex-1 min-w-[130px]">
              <Input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                placeholder="Arrival"
                className="h-9 text-sm"
              />
            </div>

            {/* Departure */}
            <div className="flex-1 min-w-[130px]">
              <Input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                placeholder="Departure"
                className="h-9 text-sm"
              />
            </div>

            {/* Bedrooms */}
            <div className="flex-1 min-w-[130px]">
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className={selectClass + " w-full"}
              >
                {BEDROOM_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Advanced Filters */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="relative rounded-full h-9 px-3 border-gray-300 gap-1.5"
                >
                  <Filter className="h-3.5 w-3.5" />
                  <span className="text-sm">Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4 max-h-[80vh] overflow-y-auto" align="end">
                <div className="space-y-5">
                  {/* Occupancy */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 text-xs uppercase tracking-wider">Occupancy</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500">Guests</Label>
                        <Input
                          type="number"
                          value={guests}
                          onChange={(e) => setGuests(e.target.value)}
                          placeholder="Guests"
                          min="0"
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500">Children</Label>
                        <Input
                          type="number"
                          value={children}
                          onChange={(e) => setChildren(e.target.value)}
                          placeholder="Children"
                          min="0"
                          className="h-9"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sort */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 text-xs uppercase tracking-wider">Sort By</h3>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className={selectClass + " w-full"}
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Amenities */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 text-xs uppercase tracking-wider">
                      Preferences & Amenities
                    </h3>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="pets_popover"
                          checked={pets}
                          onCheckedChange={(checked) => setPets(checked === true)}
                        />
                        <Label htmlFor="pets_popover" className="text-sm cursor-pointer">
                          Pets Allowed
                        </Label>
                      </div>
                      {[
                        { key: "hotTub", label: "Hot Tub" },
                        { key: "lakefront", label: "Lakefront Location" },
                        { key: "boatDock", label: "Boat Dock" },
                        { key: "evCharger", label: "EV Charger" },
                        { key: "mountainView", label: "Mountain View" },
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center gap-2">
                          <Checkbox
                            id={`popover_${key}`}
                            checked={filters[key as keyof typeof filters]}
                            onCheckedChange={() =>
                              handleFilterChange(key as keyof typeof filters)
                            }
                          />
                          <Label
                            htmlFor={`popover_${key}`}
                            className="text-sm cursor-pointer"
                          >
                            {label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setFilters({
                          mountainView: false,
                          lakefront: false,
                          boatDock: false,
                          evCharger: false,
                          hotTub: false,
                        });
                        setActiveFilters([]);
                        setGuests("");
                        setChildren("");
                        setPets(false);
                        setSortBy("price_daily_low");
                      }}
                    >
                      Clear All
                    </Button>
                    <Button size="sm" className="flex-1" onClick={handleSearch}>
                      Apply
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Search button */}
            <Button
              className="bg-red-500 hover:bg-red-600 text-white px-5 h-9 rounded-full text-sm font-semibold"
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* ── Desktop & Mobile Layout ──────────────────────────────────────── */}

      {/* Mobile Map Toggles (Hidden since we use Bottom Sheet) */}
      <style>{`
        .vaul-scrollable {
          -webkit-overflow-scrolling: touch;
        }
        /* Completely hide the global footer on the Search map view to prevent social links bleeding */
        footer {
          display: none !important;
        }
      `}</style>
      {(() => {
        const listingsContent = (
          <>
            {/* Header */}
            <div className="px-4 xl:px-6 pt-5 pb-3 bg-white">
              <h1 className="text-xl font-bold text-gray-900">Stay in Big Bear</h1>
              {!loading && !error && (
                <p className="text-sm text-gray-500 mt-0.5">
                  {properties.length} propert{properties.length === 1 ? "y" : "ies"} found
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 xl:px-6 mb-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    We couldn't load the properties at this moment. Please try
                    again later.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Grid */}
            <div className="px-4 xl:px-6 pb-16">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {loading
                  ? Array.from({ length: 8 }).map((_, i) => (
                    <PropertyCardSkeletonItem key={i} />
                  ))
                  : properties.map((property) => (
                    <SearchPropertyCard
                      key={property.id}
                      {...property}
                      isHovered={effectiveHoveredId === property.id}
                      onMouseEnter={() => setHoveredCardId(property.id)}
                      onMouseLeave={() => setHoveredCardId(null)}
                    />
                  ))}
              </div>

              {!loading && !error && properties.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="text-5xl mb-4">🏔️</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No cabins found</h3>
                  <p className="text-sm text-gray-500 max-w-xs">
                    Try adjusting your dates, guests, or filters to find the perfect cabin.
                  </p>
                </div>
              )}
            </div>
          </>
        );

        return (
          <div className="flex relative">
            {/* Desktop Left: Listings */}
            <div className="max-lg:hidden flex-shrink-0 w-[54%]">
              {listingsContent}
            </div>

            {/* Desktop Right: Sticky Map */}
            <div
              className="max-lg:hidden flex-1 sticky"
              style={{
                top: `${MAP_TOP}px`,
                height: `calc(100vh - ${MAP_TOP}px)`,
                padding: "12px 12px 12px 4px",
                minWidth: 0,
              }}
            >
              <div className="w-full h-full rounded-2xl overflow-hidden shadow-sm">
                <SearchMap
                  properties={properties}
                  hoveredId={effectiveHoveredId}
                  onMarkerClick={handleMarkerClick}
                  locationId={location}
                />
              </div>
            </div>

            {/* Mobile: Full Screen Background Map */}
            <div
              className="lg:hidden fixed inset-x-0 bottom-0 z-0 bg-gray-100"
              style={{ top: `96px` }} // Start right below the main Navbar
            >
              {/* ── Mobile Custom Floating Header ── */}
              <div className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between bg-white rounded-full shadow-lg px-4 py-3 border border-gray-100">
                <button onClick={() => router.back()} className="p-1 -ml-1 rounded-full hover:bg-gray-100 transition-colors">
                  <ArrowLeft size={20} className="text-gray-800" />
                </button>

                <div className="flex flex-col items-center flex-1 mx-2 cursor-pointer pt-0.5">
                  <span className="text-[14px] font-[600] text-gray-900 leading-tight">Homes in Map area</span>
                  <span className="text-xs text-gray-500 leading-tight mt-0.5">Any week • {guests ? `${guests} guest${guests === '1' ? '' : 's'}` : '1 guest'}</span>
                </div>

                <button className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors border border-gray-200 shadow-sm ml-1">
                  <Filter size={16} className="text-gray-800" />
                </button>
              </div>

              <SearchMap
                properties={properties}
                hoveredId={effectiveHoveredId}
                onMarkerClick={handleMarkerClick}
                locationId={location}
              />
            </div>

            {/* Mobile: Persistent Static Drawer Handle (Visible when drawer is closed) */}
            <div 
              className={`lg:hidden fixed bottom-0 left-0 right-0 z-20 flex flex-col items-center justify-start w-full h-[80px] pt-3 bg-white rounded-t-3xl shadow-[0_-4px_24px_rgba(0,0,0,0.1)] border-t border-gray-200 cursor-pointer transition-opacity duration-300 ${drawerOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              onClick={() => {
                setSnap(0.65);
                setDrawerOpen(true);
              }}
            >
              <div className="w-10 h-1.5 rounded-full bg-gray-300 mb-2" />
              <div className="mt-0.5">
                <span className="text-[15px] font-[600] text-gray-900">
                  Over {properties.length} homes
                </span>
              </div>
            </div>

            {/* Mobile: Vaul Bottom Sheet for Listings */}
            <div className="lg:hidden">
              <DrawerPrimitive.Root
                snapPoints={[0.65, 1]}
                activeSnapPoint={snap}
                setActiveSnapPoint={setSnap}
                fadeFromIndex={0}
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
                modal={false}
              >
                <DrawerPrimitive.Portal>
                  <DrawerPrimitive.Content
                    className="fixed bottom-0 left-0 right-0 z-30 flex flex-col bg-white rounded-t-3xl shadow-[0_-12px_40px_rgba(0,0,0,0.12)] outline-none border-t border-gray-200 lg:hidden pointer-events-auto"
                    style={{ height: `calc(100vh - ${MAP_TOP}px)` }}
                  >
                    {/* Accessibility requirements for Radix Dialog natively requested by vaul */}
                    <DrawerPrimitive.Title className="sr-only">Properties in Map Area</DrawerPrimitive.Title>
                    <DrawerPrimitive.Description className="sr-only">A list of available properties covering the visible map area.</DrawerPrimitive.Description>

                    {/* Drawer Handle (Inside Sheet) */}
                    <div 
                      className="flex flex-col items-center justify-start w-full h-[52px] pt-3 pb-2 bg-white rounded-t-3xl cursor-grab active:cursor-grabbing border-b border-gray-100 flex-shrink-0"
                      onClick={() => snap === 1 ? setSnap(0.65) : setSnap(1)}
                    >
                      <div className="w-10 h-1.5 rounded-full bg-gray-300" />
                    </div>
                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto vaul-scrollable bg-white">
                      {listingsContent}
                    </div>
                  </DrawerPrimitive.Content>
                </DrawerPrimitive.Portal>
              </DrawerPrimitive.Root>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// Inline skeleton so we don't need the old PropertyCardSkeleton shape
function PropertyCardSkeletonItem() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-sm animate-pulse">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="p-3.5 space-y-2">
        <div className="h-3.5 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-3 bg-gray-100 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-1/4 mt-2" />
      </div>
    </div>
  );
}
