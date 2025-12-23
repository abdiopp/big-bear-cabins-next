"use client";

import { useState } from "react";
import { Calendar, Users, MapPin, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { SearchPropertyCard } from "./SearchPropertyCard";
import { PropertyGrid } from "./PropertyGrid";
import { useProperties } from "@/hooks/useProperties";
import { PropertyCardSkeleton } from "./PropertyCardSkeleton";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export function SearchPage() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("");
  const { properties, loading, error } = useProperties(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Filters */}
      <div className="bg-white border-b sticky top-20 z-10">
        {/* ... existing filters code ... */}
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-48">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Where in Big Bear?"
                  className="pl-10"
                />
              </div>
            </div>

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

            <div className="flex-1 min-w-32">
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="number"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="pl-10"
                  placeholder="Guests"
                  min="1"
                />
              </div>
            </div>

            <Button className="bg-red-500 hover:bg-red-600 text-white px-8">
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

        {/* Error State */}
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
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))
          ) : (
            properties.map((property) => (
              <SearchPropertyCard key={property.id} {...property} />
            ))
          )}
        </PropertyGrid>
      </div>
    </div>
  );
}