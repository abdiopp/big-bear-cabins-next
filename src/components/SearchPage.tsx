"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Calendar, Users, Baby, Filter, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { SearchPropertyCard } from "./SearchPropertyCard";
import { PropertyGrid } from "./PropertyGrid";
import { useProperties } from "@/hooks/useProperties";
import { PropertyCardSkeleton } from "./PropertyCardSkeleton";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

// Parse MM/DD/YYYY format from URL to YYYY-MM-DD for input fields
const parseApiDateToInput = (apiDate: string | null): string => {
  if (!apiDate) return "";
  const parts = apiDate.split("/");
  if (parts.length !== 3) return "";
  const [month, day, year] = parts;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

// Convert input date (YYYY-MM-DD) to API format (MM/DD/YYYY)
const formatInputToApiDate = (inputDate: string): string => {
  if (!inputDate) return "";
  const parts = inputDate.split("-");
  if (parts.length !== 3) return "";
  const [year, month, day] = parts;
  return `${month}/${day}/${year}`;
};

// ── Location areas from Streamline API ─────────────────────────────────────
const LOCATIONS = [
  { id: "", label: "Any Location" },
  { id: "11226", label: "Big Bear Lake" },
  { id: "17601", label: "Big Bear City East" },
  { id: "23687", label: "Lakefront Location" },
  { id: "13073", label: "North Shore / Fawnskin" },
  { id: "17611", label: "Ski Resorts" },
];

// ── Bedroom options matching bigbearcabins.com ──────────────────────────────
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

// ── Sort options matching bigbearcabins.com ─────────────────────────────────
const SORT_OPTIONS = [
  { value: "price_daily_low", label: "Price: Low to High" },
  { value: "price_daily_high", label: "Price: High to Low" },
  { value: "bedrooms_number_desc", label: "Bedrooms: Most First" },
  { value: "bedrooms_number_asc", label: "Bedrooms: Fewest First" },
  { value: "max_occupants_desc", label: "Guests: Most First" },
  { value: "max_occupants_asc", label: "Guests: Fewest First" },
];

export function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // ── Primary filters ──────────────────────────────────────────────────────
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
  const [location, setLocation] = useState(
    () => searchParams.get("location") || ""
  );
  const [sortBy, setSortBy] = useState(
    () => searchParams.get("sort_by") || "price_daily_low"
  );

  // ── Advanced amenity filters ──────────────────────────────────────────────
  const [filters, setFilters] = useState({
    mountainView: false,
    lakefront: false,
    boatDock: false,
    evCharger: false,
    hotTub: false,
  });

  const [activeFilters, setActiveFilters] = useState<string[]>(() => {
    const filtersParam = searchParams.get("filters");
    return filtersParam ? filtersParam.split(",") : [];
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

  // ── Build API params ──────────────────────────────────────────────────────
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

  // ── URL sync on Search ────────────────────────────────────────────────────
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
      const newActiveFilters = Object.keys(updated).filter(
        (key) => updated[key as keyof typeof updated]
      );
      setActiveFilters(newActiveFilters);
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

  // ── Shared select style ───────────────────────────────────────────────────
  const selectClass =
    "h-9 rounded-md border border-input bg-[#f3f3f5] px-3 py-1 text-sm text-gray-600 shadow-sm focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Search Bar ──────────────────────────────────────────────────── */}
      <div className="bg-white border-b sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap gap-3 items-center">

            {/* Location dropdown */}
            <div className="flex-1 min-w-[160px]">
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
            <div className="flex-1 min-w-[140px]">
              <Input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                placeholder="Arrival"
              />
            </div>

            {/* Departure */}
            <div className="flex-1 min-w-[140px]">
              <Input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                placeholder="Departure"
              />
            </div>

            {/* Bedrooms dropdown */}
            <div className="flex-1 min-w-[140px]">
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



            {/* Advanced Filters button */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="relative rounded-full h-9 px-3 border-gray-300 gap-1"
                >
                  <Filter className="h-4 w-4" />
                  <span className="text-sm">Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4 max-h-[80vh] overflow-y-auto" align="end">
                <div className="space-y-6">

                  {/* Occupancy Section */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                      Occupancy
                    </h3>
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

                  {/* Sort Section */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                      Sort By
                    </h3>
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

                  {/* Preferences Section */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                      Preferences & Amenities
                    </h3>
                    <div className="space-y-3">
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
                          <Label htmlFor={`popover_${key}`} className="text-sm cursor-pointer">
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
              className="bg-red-500 hover:bg-red-600 text-white px-6"
              onClick={handleSearch}
            >
              Update Results
            </Button>
          </div>
        </div>
      </div>

      {/* ── Results ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="mb-1 text-2xl font-bold">Stay in Big Bear</h1>
            {!loading && !error && (
              <p className="text-gray-500 text-sm">
                {properties.length} propert{properties.length === 1 ? "y" : "ies"} found
              </p>
            )}
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              We couldn&apos;t load the properties at this moment. Please try again
              later.
            </AlertDescription>
          </Alert>
        )}

        <PropertyGrid>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))
            : properties.map((property) => (
              <SearchPropertyCard key={property.id} {...property} />
            ))}
        </PropertyGrid>
      </div>
    </div>
  );
}
