"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Calendar, Users, MapPin, AlertCircle, Baby, PawPrint } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { SearchPropertyCard } from "./SearchPropertyCard";
import { PropertyGrid } from "./PropertyGrid";
import { useProperties } from "@/hooks/useProperties";
import { PropertyCardSkeleton } from "./PropertyCardSkeleton";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

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

export function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initial state from URL
  const [checkIn, setCheckIn] = useState(() => parseApiDateToInput(searchParams.get("checkIn")));
  const [checkOut, setCheckOut] = useState(() => parseApiDateToInput(searchParams.get("checkOut")));
  const [guests, setGuests] = useState(() => searchParams.get("occupants") || "");
  const [children, setChildren] = useState(() => searchParams.get("occupants_small") || "");
  const [pets, setPets] = useState(() => searchParams.get("pets") === "true"); // boolean
  const [activeFilters, setActiveFilters] = useState<string[]>(() => {
    const filtersParam = searchParams.get("filters");
    return filtersParam ? filtersParam.split(",") : [];
  });

  // Prepare API-friendly search params
  const searchApiParams = useMemo(() => {
    const startdate = formatInputToApiDate(checkIn);
    const enddate = formatInputToApiDate(checkOut);

    return {
      ...(startdate && { startdate }),
      ...(enddate && { enddate }),
      ...(guests && { occupants: parseInt(guests) }),
      ...(children && { occupants_small: parseInt(children) }),
      ...(pets && { pets: Boolean(pets) }), // backend expects number 1 for true
      ...(activeFilters.length > 0 && { filters: activeFilters }),
    };
  }, [checkIn, checkOut, guests, children, pets, activeFilters]);

  const { properties, loading, error } = useProperties(1, searchApiParams);

  // Update URL params on Search button click
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (checkIn) params.set("checkIn", formatInputToApiDate(checkIn));
    if (checkOut) params.set("checkOut", formatInputToApiDate(checkOut));
    if (guests) params.set("occupants", guests);
    if (children) params.set("occupants_small", children);
    if (pets) params.set("pets", "true");
    if (activeFilters.length > 0) params.set("filters", activeFilters.join(","));

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Filters */}
      <div className="bg-white border-b sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap gap-4 items-center">

            {/* Location */}
            <div className="flex-1 min-w-48">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Where in Big Bear?" className="pl-10" />
              </div>
            </div>

            {/* Check-in */}
            <div className="flex-1 min-w-36">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="pl-10"
                  placeholder="Check-in"
                />
              </div>
            </div>

            {/* Check-out */}
            <div className="flex-1 min-w-36">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="pl-10"
                  placeholder="Check-out"
                />
              </div>
            </div>

            {/* Adults */}
            <div className="flex-1 min-w-32">
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="number"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="pl-10"
                  placeholder="Adults"
                  min="0"
                />
              </div>
            </div>

            {/* Children */}
            <div className="flex-1 min-w-32">
              <div className="relative">
                <Baby className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="number"
                  value={children}
                  onChange={(e) => setChildren(e.target.value)}
                  className="pl-10"
                  placeholder="Children"
                  min="0"
                />
              </div>
            </div>

            {/* Pets */}
            <div className="flex-1 min-w-32 flex items-center space-x-2 bg-[#f3f3f5] px-4 py-2 rounded-md">
              <input
                type="checkbox"
                id="pets"
                checked={pets} // true/false
                onChange={(e) => setPets(e.target.checked)} // toggle boolean
                className="h-4 w-4 me-2 accent-black"
              />
              <label htmlFor="pets" className="text-gray-400 text-sm ms-3">Pets</label>
            </div>

            {/* Search Button */}
            <Button className="bg-red-500 hover:bg-red-600 text-white px-8" onClick={handleSearch}>
              Search
            </Button>

          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="mb-2 text-2xl font-bold">Stay in Big Bear</h1>
          {!loading && !error && (
            <p className="text-gray-600">Over 300 homes · {properties.length} results for your search</p>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              We couldn't load the properties at this moment. Please try again later.
            </AlertDescription>
          </Alert>
        )}

        <PropertyGrid>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <PropertyCardSkeleton key={i} />)
            : properties.map((property) => <SearchPropertyCard key={property.id} {...property} />)
          }
        </PropertyGrid>
      </div>
    </div>
  );
}
