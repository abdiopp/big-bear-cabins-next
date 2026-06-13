"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Filter, AlertCircle, ArrowLeft, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { SearchPropertyCard } from "./SearchPropertyCard";
import { useProperties } from "@/hooks/useProperties";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import dynamic from "next/dynamic";
import { Drawer as DrawerPrimitive } from "vaul";
import { Property } from "@/lib/types";
// ⚡ React Date Range Imports
import { DateRange, Range } from "react-date-range";
// Existing imports ke sath ye add karein
import { useReservationPrice } from '@/hooks/useReservationPrice';

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
const formatDateToInputString = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// ✨ New Helper: Input String (YYYY-MM-DD) ko UI format me convert karne ke liye (with Month Name)
const formatDateToUiString = (dateStr: string): string => {
  if (!dateStr) return "";
  const date = new Date(`${dateStr}T00:00:00`);
  if (isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${monthName} ${year}`; // Output format: 06 Jun 2026
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
const MAP_PAGE_SIZE = 20;
const MAP_LIST_SYNC_DEBOUNCE_MS = 280;

const isSamePropertyId = (
  left: string | number | null | undefined,
  right: string | number | null | undefined
) => left != null && right != null && String(left) === String(right);

export function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Calendar open/close state toggler
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Component block se bahar (Helpers ke neeche) add karein:
  const todayRef = useRef(new Date());
  const tomorrowRef = useRef(new Date(Date.now() + 86400000));

  const todayStr = useMemo(() => formatDateToInputString(todayRef.current), []);
  const tomorrowStr = useMemo(() => formatDateToInputString(tomorrowRef.current), []);

  // ── Filters ───────────────────────────────────────────────────────────────
  // ── Local Input States ──
  const [location, setLocation] = useState(() => searchParams.get("location") || "");
  const [bedrooms, setBedrooms] = useState(() => searchParams.get("bedrooms") || "");
  const [checkIn, setCheckIn] = useState(() => parseApiDateToInput(searchParams.get("checkIn")) || todayStr);
  const [checkOut, setCheckOut] = useState(() => parseApiDateToInput(searchParams.get("checkOut")) || tomorrowStr);

  // ── Advanced Popover Filter States ──
  const [guests, setGuests] = useState(() => searchParams.get("occupants") || "");
  const [children, setChildren] = useState(() => searchParams.get("occupants_small") || "");
  const [pets, setPets] = useState(() => searchParams.get("pets") === "true");
  const [sortBy, setSortBy] = useState(() => searchParams.get("sort_by") || "price_daily_low");
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
  const [snap, setSnap] = useState<number | string | null>(0.65);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Isko replace karein taake string aur number donon keys balance ho jayein
  const [calculatedRates, setCalculatedRates] = useState<Record<string | number, number>>({});
  const { calculatePrice } = useReservationPrice();



  useEffect(() => {
    setFilters({
      mountainView: activeFilters.includes("mountainView"),
      lakefront: activeFilters.includes("lakefront"),
      boatDock: activeFilters.includes("boatDock"),
      evCharger: activeFilters.includes("evCharger"),
      hotTub: activeFilters.includes("hotTub"),
    });
  }, [activeFilters]);


  // Click outside close calendar effect
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  // ── Map / card interaction state ──────────────────────────────────────────
  const [hoveredCardId, setHoveredCardId] = useState<string | number | null>(null);
  const [activeMarkerId, setActiveMarkerId] = useState<string | number | null>(null);
  const [focusedPropertyId, setFocusedPropertyId] = useState<string | number | null>(null);
  const [focusRequestId, setFocusRequestId] = useState(0);
  const propertyCardRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  // ── API params (Triggers strictly from URL) ──────────────────────────────────
  const searchApiParams = useMemo(() => {
    // 1. URL values target karein
    const urlCheckIn = searchParams.get("checkIn");
    const urlCheckOut = searchParams.get("checkOut");
    const urlLocation = searchParams.get("location");
    const urlBedrooms = searchParams.get("bedrooms");
    const urlGuests = searchParams.get("occupants");
    const urlChildren = searchParams.get("occupants_small");
    const urlPets = searchParams.get("pets");
    const urlSortBy = searchParams.get("sort_by");
    const urlFilters = searchParams.get("filters") ? searchParams.get("filters")!.split(",") : [];

    // 2. Fallbacks ensure karein (taake page load par by-default filters automatic chalein)
    const startdate = urlCheckIn ? formatInputToApiDate(parseApiDateToInput(urlCheckIn)) : formatInputToApiDate(todayStr);
    const enddate = urlCheckOut ? formatInputToApiDate(parseApiDateToInput(urlCheckOut)) : formatInputToApiDate(tomorrowStr);

    return {
      startdate,
      enddate,
      ...(urlGuests && { occupants: parseInt(urlGuests) }),
      ...(urlChildren && { occupants_small: parseInt(urlChildren) }),
      ...(urlPets === "true" && { pets: true }),
      ...(urlFilters.length > 0 && { filters: urlFilters }),
      ...(urlBedrooms && { bedrooms_number: parseInt(urlBedrooms) }),
      ...(urlLocation && { location_area_id: parseInt(urlLocation) }),
      sort_by: urlSortBy || "price_daily_low",
    };
  }, [searchParams]); // Dependency array me sirf searchParams aayega!
  // Synchronize local UI inputs with browser navigation actions
  // Synchronize local UI inputs with browser navigation actions
  useEffect(() => {
    const urlCheckIn = searchParams.get("checkIn");
    const urlCheckOut = searchParams.get("checkOut");

    // ⚡ CRUCIAL: Agar URL me dates missing hain, toh page open hotay hi slug/URL update kar do
    if (!urlCheckIn || !urlCheckOut) {
      const params = new URLSearchParams(searchParams.toString());
      if (!urlCheckIn) params.set("checkIn", formatInputToApiDate(todayStr));
      if (!urlCheckOut) params.set("checkOut", formatInputToApiDate(tomorrowStr));

      // router.replace se page reload nahi hoga, bas URL clean aur match ho jayega
      router.replace(`/search?${params.toString()}`);
      return;
    }

    // Baqi filters jo URL me hain unhe local state me sync rakhein
    setLocation(searchParams.get("location") || "");
    setBedrooms(searchParams.get("bedrooms") || "");
    setCheckIn(parseApiDateToInput(urlCheckIn));
    setCheckOut(parseApiDateToInput(urlCheckOut));
    setGuests(searchParams.get("occupants") || "");
    setChildren(searchParams.get("occupants_small") || "");
    setPets(searchParams.get("pets") === "true");
    setSortBy(searchParams.get("sort_by") || "price_daily_low");
  }, [searchParams, todayStr, tomorrowStr, router]);


  // ── Date Range Object Mapping for react-date-range component ──
  const dateRangeSelection = useMemo<Range>(() => {
    return {
      startDate: checkIn ? new Date(`${checkIn}T00:00:00`) : new Date(),
      endDate: checkOut ? new Date(`${checkOut}T00:00:00`) : new Date(Date.now() + 86400000),
      key: "selection",
    };
  }, [checkIn, checkOut]);

  const handleRangeChange = (rangesByKey: any) => {
    const { selection } = rangesByKey;
    if (!selection) return;

    if (selection.startDate) {
      setCheckIn(formatDateToInputString(selection.startDate));
    }
    if (selection.endDate) {
      setCheckOut(formatDateToInputString(selection.endDate));
    }
  };

  const { properties, loading, error } = useProperties(1, searchApiParams);
  const allCabins = properties;
  const [visibleCabins, setVisibleCabins] = useState<Property[]>([]);
  const [hasMapSyncInitialized, setHasMapSyncInitialized] = useState(false);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const mapSyncDebounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isListTransitioning, setIsListTransitioning] = useState(false);
  const [listAnimationCycle, setListAnimationCycle] = useState(0);
  const listTransitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousDisplayedSignatureRef = useRef("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const displayedCabins = useMemo(() => {
    const sourceCabins = hasMapSyncInitialized ? visibleCabins : allCabins;
    const start = activePageIndex * MAP_PAGE_SIZE;
    return sourceCabins.slice(start, start + MAP_PAGE_SIZE);
  }, [activePageIndex, allCabins, hasMapSyncInitialized, visibleCabins]);


  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(allCabins.length / MAP_PAGE_SIZE));
  }, [allCabins]);

  const displayedCabinsSignature = useMemo(
    () => displayedCabins.map((cabin) => String(cabin.id)).join("|"),
    [displayedCabins]
  );

  const applyVisibleProperties = useCallback((nextVisibleCabins: Property[]) => {
    setHasMapSyncInitialized(true);
    setVisibleCabins(nextVisibleCabins);
    setActivePageIndex(0);
  }, []);

  const handleRenderedPropertiesChange = useCallback(
    () => {
      if (mapSyncDebounceTimeoutRef.current) {
        clearTimeout(mapSyncDebounceTimeoutRef.current);
      }

      mapSyncDebounceTimeoutRef.current = setTimeout(() => {
        setHasMapSyncInitialized(true);
        mapSyncDebounceTimeoutRef.current = null;
      }, MAP_LIST_SYNC_DEBOUNCE_MS);
    },
    []
  );

  const handleVisiblePropertiesChange = useCallback(
    (nextVisibleCabins: Property[]) => {
      applyVisibleProperties(nextVisibleCabins);
    },
    [applyVisibleProperties]
  );

  const handlePageChange = useCallback((nextPageIndex: number) => {
    setActivePageIndex(nextPageIndex);
    setHoveredCardId(null);

    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  }, []);

  useEffect(() => {
    if (loading) return;

    const previousSignature = previousDisplayedSignatureRef.current;
    if (!previousSignature) {
      previousDisplayedSignatureRef.current = displayedCabinsSignature;
      return;
    }

    if (previousSignature === displayedCabinsSignature) return;

    previousDisplayedSignatureRef.current = displayedCabinsSignature;
    setListAnimationCycle((current) => current + 1);
    setIsListTransitioning(true);

    if (listTransitionTimeoutRef.current) {
      clearTimeout(listTransitionTimeoutRef.current);
    }

    listTransitionTimeoutRef.current = setTimeout(() => {
      setIsListTransitioning(false);
      listTransitionTimeoutRef.current = null;
    }, 300);
  }, [displayedCabinsSignature, loading]);

  useEffect(() => {
    if (activePageIndex >= totalPages) {
      setActivePageIndex(Math.max(0, totalPages - 1));
    }
  }, [activePageIndex, totalPages]);

  const paginationItems = useMemo(() => {
    const currentPage = activePageIndex + 1;
    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages: Array<number | "ellipsis"> = [];
    const pushRange = (start: number, end: number) => {
      for (let page = start; page <= end; page++) {
        if (!pages.includes(page)) pages.push(page);
      }
    };

    if (currentPage <= 4) {
      pushRange(1, 4);
      pages.push("ellipsis", totalPages);
      return pages;
    }

    if (currentPage >= totalPages - 3) {
      pages.push(1, "ellipsis");
      pushRange(totalPages - 3, totalPages);
      return pages;
    }

    pages.push(1, "ellipsis");
    pushRange(currentPage - 1, currentPage + 1);
    pages.push("ellipsis", totalPages);
    return pages;
  }, [activePageIndex, totalPages]);

  useEffect(() => {
    return () => {
      if (listTransitionTimeoutRef.current) {
        clearTimeout(listTransitionTimeoutRef.current);
        listTransitionTimeoutRef.current = null;
      }
      if (mapSyncDebounceTimeoutRef.current) {
        clearTimeout(mapSyncDebounceTimeoutRef.current);
        mapSyncDebounceTimeoutRef.current = null;
      }
    };
  }, []);

  // Ek useEffect lagayein jo properties change ya dates change hone par fire ho:
  useEffect(() => {
    if (properties && checkIn && checkOut) {
      properties.forEach(async (property) => {
        const res = await calculatePrice({
          unitId: Number(property.id),
          startDate: checkIn, // YYYY-MM-DD format me
          endDate: checkOut,
          occupants: guests ? parseInt(guests) : 1, // aapke context ke mutabik
        });
        if (res && res.average_nightly_rate) {
          setCalculatedRates(prev => ({
            ...prev,
            [property.id]: res.average_nightly_rate
          }));
        }
      });
    }
  }, [properties, checkIn, checkOut]);
  // ⚡ Total Days / Nights Calculation Logic
  const totalNights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(`${checkIn}T00:00:00`);
    const end = new Date(`${checkOut}T00:00:00`);
    const diffTime = end.getTime() - start.getTime();
    if (diffTime <= 0) return 0;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [checkIn, checkOut]);

  // ── URL sync execution ──────────────────────────────────────────────────────
  const handleSearch = () => {
    const params = new URLSearchParams();

    if (checkIn) params.set("checkIn", formatInputToApiDate(checkIn));
    if (checkOut) params.set("checkOut", formatInputToApiDate(checkOut));
    if (location) params.set("location", location);
    if (bedrooms) params.set("bedrooms", bedrooms);
    if (guests) params.set("occupants", guests);
    if (children) params.set("occupants_small", children);
    if (pets) params.set("pets", "true");
    if (sortBy && sortBy !== "price_daily_low") params.set("sort_by", sortBy);
    if (activeFilters.length > 0) params.set("filters", activeFilters.join(","));

    router.push(`/search?${params.toString()}`);
    setIsPopoverOpen(false);
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

  const requestMapFocus = useCallback((id: string | number | null) => {
    setFocusedPropertyId(id);
    setFocusRequestId((current) => current + 1);
  }, []);

  const registerPropertyCardRef = useCallback(
    (id: string | number, node: HTMLAnchorElement | null) => {
      const key = String(id);
      if (node) {
        propertyCardRefs.current[key] = node;
      } else {
        delete propertyCardRefs.current[key];
      }
    },
    []
  );

  const handleMarkerClick = useCallback((id: string | number | null) => {
    setActiveMarkerId(id);
    if (
      id != null &&
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 1023px)").matches
    ) {
      setSnap(0.65);
      setDrawerOpen(true);
    }
  }, []);

  const handleListingCardClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, id: string | number) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      // Keep keyboard Enter behavior for accessibility and direct navigation.
      if (event.detail === 0) {
        return;
      }
    },
    [requestMapFocus]
  );
  useEffect(() => {
    if (activeMarkerId == null) return;
    const cardNode = propertyCardRefs.current[String(activeMarkerId)];
    if (!cardNode) return;

    cardNode.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  }, [activeMarkerId, displayedCabins.length]);

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

            {/* ── ⚡ React Date Range Container Integration ── */}
            <div ref={calendarRef} className="relative z-30">
              <div
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="flex items-center gap-1.5 bg-[#f3f3f5] border border-input rounded-md px-3 h-9 shadow-sm flex-1 w-[340px] cursor-pointer select-none text-xs text-gray-700"
              >
                <Calendar className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                <div className="flex justify-between items-center w-full">
                  <span>{checkIn ? formatDateToUiString(checkIn) : "Check In"}</span>
                  <span className="text-gray-400 mx-1">→</span>
                  <span>{checkOut ? formatDateToUiString(checkOut) : "Check Out"}</span>
                  {/* ⚡ Live Days Tracker Badge */}
                  {totalNights > 0 && (
                    <span className="ml-2 bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full text-[10px]">
                      {totalNights} {totalNights === 1 ? "night" : "nights"}
                    </span>
                  )}
                </div>
              </div>

              {/* Float Inline Calendar Popover layout */}
              {isCalendarOpen && (
                <div className="absolute top-full mt-1.5 left-0 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden p-1">
                  <DateRange
                    ranges={[dateRangeSelection]}
                    onChange={handleRangeChange}
                    minDate={new Date()}
                    rangeColors={["#000"]} // Tailwind red-500 matching theme color
                    showDateDisplay={false}
                    direction="horizontal"
                    months={2}
                  />
                </div>
              )}
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
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
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
                        // 1. Local States ko reset karein
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
                        setIsPopoverOpen(false);

                        // 2. PERFECT FIX: New clean URLSearchParams banayein
                        const cleanParams = new URLSearchParams();

                        // Agar aap chahte hain ke Clear All karne par bhi Dates aur Location bach jayein (jo ke standard hota hai)
                        // toh hum sirf checkIn, checkOut aur location ko URL me barkarar rakhenge:
                        const currentCheckIn = searchParams.get("checkIn");
                        const currentCheckOut = searchParams.get("checkOut");
                        const currentLocation = searchParams.get("location");
                        const currentBedrooms = searchParams.get("bedrooms");

                        if (currentCheckIn) cleanParams.set("checkIn", currentCheckIn);
                        if (currentCheckOut) cleanParams.set("checkOut", currentCheckOut);
                        if (currentLocation) cleanParams.set("location", currentLocation);
                        if (currentBedrooms) cleanParams.set("bedrooms", currentBedrooms);

                        // 3. Router ko push karein taake baki occupancy aur advanced filters slug se foran gayab ho jayein
                        router.push(`/search?${cleanParams.toString()}`);
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
              {/* {!loading && !error && (
                <p className="text-sm text-gray-500 mt-0.5">
                  {allCabins.length} propert{allCabins.length === 1 ? "y" : "ies"} found
                </p>
              )} */}
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
              <div className="relative">
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 transition-opacity duration-300 ${isListTransitioning ? "opacity-75" : "opacity-100"
                    }`}
                >
                  {loading
                    ? Array.from({ length: 8 }).map((_, i) => (
                      <PropertyCardSkeletonItem key={i} />
                    ))
                    : displayedCabins.map((property, index) => (
                      <div
                        key={`${listAnimationCycle}-${property.id}`}
                        className="animate-in fade-in-0 slide-in-from-bottom-1 duration-500"
                        style={{ animationDelay: `${Math.min(index, 5) * 40}ms` }}
                      >
                        <SearchPropertyCard
                          {...property}
                          cardRef={(node) => registerPropertyCardRef(property.id, node)}
                          isHovered={isSamePropertyId(effectiveHoveredId, property.id)}
                          onMouseEnter={() => setHoveredCardId(property.id)}
                          onMouseLeave={() => setHoveredCardId(null)}
                          onCardClick={(event) => handleListingCardClick(event, property.id)}
                          averageNightlyRate={calculatedRates[property.id] || property.price}
                        />
                      </div>
                    ))}
                </div>

                {!loading && isListTransitioning && displayedCabins.length > 0 && (
                  <div className="pointer-events-none absolute inset-0 z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                    {Array.from({ length: Math.min(4, displayedCabins.length) }).map((_, index) => (
                      <PropertyCardTransitionSkeleton key={index} />
                    ))}
                  </div>
                )}
              </div>

              {!loading && !error && totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2 sm:gap-4 flex-wrap select-none">
                  <button
                    type="button"
                    onClick={() => handlePageChange(Math.max(0, activePageIndex - 1))}
                    disabled={activePageIndex === 0}
                    className="h-10 w-10 rounded-full flex items-center justify-center text-gray-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:text-gray-900 hover:bg-gray-100"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
                    {paginationItems.map((item, index) => {
                      if (item === "ellipsis") {
                        return (
                          <span key={`ellipsis-${index}`} className="px-1 text-2xl leading-none text-gray-600 tracking-[0.2em]">
                            ...
                          </span>
                        );
                      }

                      const isActivePage = item - 1 === activePageIndex;
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => handlePageChange(item - 1)}
                          className={`flex h-11 w-11 items-center justify-center rounded-full text-[17px] font-medium transition-all duration-200 ${isActivePage
                            ? "bg-gray-900 text-white shadow-[0_6px_18px_rgba(0,0,0,0.18)]"
                            : "text-gray-900 hover:bg-gray-100"
                            }`}
                          aria-current={isActivePage ? "page" : undefined}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePageChange(Math.min(totalPages - 1, activePageIndex + 1))}
                    disabled={activePageIndex >= totalPages - 1}
                    className="h-10 w-10 rounded-full flex items-center justify-center text-gray-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:text-gray-900 hover:bg-gray-100"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}

              {!loading && !error && displayedCabins.length === 0 && (
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
                  properties={allCabins}
                  hoveredId={effectiveHoveredId}
                  onMarkerClick={handleMarkerClick}
                  // locationId={location}
                  locationId={searchParams.get("location") || ""}
                  focusedPropertyId={focusedPropertyId}
                  focusRequestId={focusRequestId}
                  pageSize={MAP_PAGE_SIZE}
                  onRenderedPropertiesChange={handleRenderedPropertiesChange}
                  onVisiblePropertiesChange={handleVisiblePropertiesChange}
                  calculatedRates={calculatedRates}
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
                properties={allCabins}
                hoveredId={effectiveHoveredId}
                onMarkerClick={handleMarkerClick}
                locationId={location}
                focusedPropertyId={focusedPropertyId}
                focusRequestId={focusRequestId}
                pageSize={MAP_PAGE_SIZE}
                onRenderedPropertiesChange={handleRenderedPropertiesChange}
                onVisiblePropertiesChange={handleVisiblePropertiesChange}
                calculatedRates={calculatedRates}
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
                  Over {allCabins.length} homes
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
                    <DrawerPrimitive.Title className="sr-only">Properties</DrawerPrimitive.Title>
                    <DrawerPrimitive.Description className="sr-only">A list of available properties.</DrawerPrimitive.Description>

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

function PropertyCardTransitionSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white/80 shadow-sm border border-white/70 backdrop-blur-[1px] animate-pulse">
      <div className="aspect-[4/3] bg-gray-200/80" />
      <div className="p-3.5 space-y-2">
        <div className="h-3.5 bg-gray-200/80 rounded w-3/4" />
        <div className="h-3 bg-gray-100/80 rounded w-1/2" />
        <div className="h-3 bg-gray-100/80 rounded w-1/3" />
        <div className="h-4 bg-gray-200/80 rounded w-1/4 mt-2" />
      </div>
    </div>
  );
}