"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ChevronRight, AlertCircle, Star } from "lucide-react";
import { useProperties } from "@/hooks/useProperties";
import { PropertyCardSkeleton } from "./PropertyCardSkeleton";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const categoryTitles: { [key: string]: string } = {
  cabins: "Cabins",
  lakefront: "Lakefront",
  ski: "Ski-In/Ski-Out",
  jacuzzi: "Hot Tub & Jacuzzi",
  "pool-table": "Pool Table & Game Room",
  luxury: "Luxury Rentals",
  "pet-friendly": "Pet-Friendly",
  mountains: "Mountain Views",
};

export function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const { properties, loading, error } = useProperties(1); // In a real scenario, we'd pass category to API

  const categoryTitle = categoryTitles[category || "cabins"] || "Properties";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{categoryTitle}</h1>
            {!loading && !error && (
              <p className="text-gray-600 mt-1">{properties.length} stays</p>
            )}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              We couldn't load the properties for this category. Please try again later.
            </AlertDescription>
          </Alert>
        )}

        {/* Property Grid - 5 per row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {loading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))
          ) : (
            properties.map((property) => (
              <Link key={property.id} href={`/property/${property.id}`} className="group cursor-pointer block">
                <div className="relative overflow-hidden rounded-xl">
                  <ImageWithFallback
                    src={property.imageUrl}
                    alt={property.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Heart Icon */}
                  <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors">
                    <svg
                      className="w-4 h-4 text-gray-600 hover:text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate">{property.title}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{property.rating}</span>
                    </div>
                  </div>

                  <p className="text-gray-500 text-sm">{property.location}</p>
                  <p className="text-gray-500 text-sm">
                    {property.bedrooms} beds · {property.bathrooms} baths
                  </p>

                  <div className="mt-2 text-sm text-gray-600 truncate">
                    Max {property.guests} guests
                  </div>

                  <div className="mt-2">
                    <span className="font-semibold text-gray-900">${property.price.toLocaleString()}</span>
                    <span className="text-gray-500"> night</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* No results message */}
        {!loading && properties.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-500">Try adjusting your filters or search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

