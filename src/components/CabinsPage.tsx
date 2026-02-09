"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { SearchPropertyCard } from "./SearchPropertyCard";
import { PropertyGrid } from "./PropertyGrid";
import { useProperties } from "@/hooks/useProperties";
import { PropertyCardSkeleton } from "./PropertyCardSkeleton";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const ITEMS_PER_PAGE = 20;

export function CabinsPage() {
    const [page, setPage] = useState(1);
    const [allProperties, setAllProperties] = useState<any[]>([]);
    const [hasLoadedInitial, setHasLoadedInitial] = useState(false);

    const { properties, loading, error } = useProperties(page);

    // Accumulate properties as we load more pages
    if (!loading && properties.length > 0 && !hasLoadedInitial) {
        setAllProperties(properties);
        setHasLoadedInitial(true);
    }

    // When page changes and new data arrives, append it
    if (!loading && properties.length > 0 && page > 1 && hasLoadedInitial) {
        const currentIds = new Set(allProperties.map(p => p.id));
        const newProperties = properties.filter(p => !currentIds.has(p.id));
        if (newProperties.length > 0) {
            setAllProperties(prev => [...prev, ...newProperties]);
        }
    }

    const handleLoadMore = () => {
        setPage(prev => prev + 1);
    };

    const displayProperties = allProperties.length > 0 ? allProperties : properties;
    const showLoadMore = !loading && displayProperties.length >= page * ITEMS_PER_PAGE;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <h1 className="text-3xl font-bold mb-2">All Big Bear Cabins</h1>
                    {!loading && !error && (
                        <p className="text-gray-600">
                            {displayProperties.length} cabin{displayProperties.length !== 1 ? 's' : ''} available
                        </p>
                    )}
                </div>
            </div>

            {/* Results */}
            <div className="max-w-7xl mx-auto px-6 py-8">
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
                    {displayProperties.map((property) => (
                        <SearchPropertyCard key={property.id} {...property} />
                    ))}

                    {/* Loading skeletons when fetching more */}
                    {loading && (
                        Array.from({ length: page === 1 ? 20 : 8 }).map((_, i) => (
                            <PropertyCardSkeleton key={`skeleton-${i}`} />
                        ))
                    )}
                </PropertyGrid>

                {/* Load More Button */}
                {showLoadMore && (
                    <div className="flex justify-center mt-8">
                        <Button
                            onClick={handleLoadMore}
                            disabled={loading}
                            className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 text-lg"
                        >
                            {loading ? "Loading..." : "Load More"}
                        </Button>
                    </div>
                )}

                {/* No results message */}
                {!loading && displayProperties.length === 0 && !error && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No cabins available at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
