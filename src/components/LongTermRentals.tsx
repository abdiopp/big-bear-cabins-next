"use client";

import { ChevronRight, AlertCircle } from "lucide-react";
import { PropertyCard } from "./PropertyCard";
import { useProperties } from "@/hooks/useProperties";
import { PropertyCardSkeleton } from "./PropertyCardSkeleton";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export function LongTermRentals() {
  const { properties, loading, error } = useProperties(2); // Using page 2 for different results

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl text-black">Long Term Rentals</h2>
            <ChevronRight className="h-6 w-6 text-black" />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              We couldn't load the long term rentals at this moment. Please try again later.
            </AlertDescription>
          </Alert>
        )}

        {/* Property Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))
          ) : (
            properties.slice(0, 4).map((property) => (
              <PropertyCard
                key={property.id}
                property={{
                  ...property,
                  dates: "Monthly",
                  priceLabel: "month",
                  price: property.price * 15 // Roughly estimating monthly price for display variety
                }}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}