import React from "react";
import { Skeleton } from "./ui/skeleton";
import { Separator } from "./ui/separator";

export function PropertyPageSkeleton() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header Skeleton */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between mb-6">
                    <Skeleton className="h-8 w-1/3" />
                    <div className="flex items-center space-x-3">
                        <Skeleton className="h-9 w-20" />
                        <Skeleton className="h-9 w-20" />
                    </div>
                </div>
            </div>

            {/* Image Gallery Skeleton */}
            <div className="relative mb-8 w-full">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex gap-2 h-[400px]">
                        {/* Main large image - left side (60% width) */}
                        <div className="w-3/5">
                            <Skeleton className="w-full h-full rounded-l-xl" />
                        </div>

                        {/* Right side - 2x2 grid of smaller images (40% width) */}
                        <div className="w-2/5 grid grid-cols-2 gap-2">
                            <Skeleton className="w-full h-full rounded-tr-xl" />
                            <Skeleton className="w-full h-full" />
                            <Skeleton className="w-full h-full" />
                            <Skeleton className="w-full h-full rounded-br-xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Title & Meta */}
                <div className="mb-6 space-y-2">
                    <Skeleton className="h-6 w-1/2" />
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Stats */}
                        <div className="flex items-center space-x-6">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-24" />
                        </div>

                        <Separator />

                        {/* Badge */}
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/4 mt-4" />
                        </div>

                        <Separator />

                        {/* Amenities */}
                        <div>
                            <Skeleton className="h-6 w-48 mb-4" />
                            <div className="grid grid-cols-2 gap-3">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="flex items-center space-x-3">
                                        <Skeleton className="h-5 w-5" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="py-6 border-b border-gray-200">
                            <Skeleton className="h-12 w-48 rounded-lg" />
                        </div>

                        {/* Calendar Placeholder */}
                        <div className="py-8 border-b border-gray-200 space-y-4">
                            <Skeleton className="h-6 w-64" />
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-[350px] w-full rounded-md" />
                        </div>
                    </div>

                    {/* Right Column - Booking Widget */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 border rounded-xl p-6 shadow-xl space-y-6">
                            <div className="flex justify-between items-end">
                                <Skeleton className="h-8 w-32" />
                                <Skeleton className="h-4 w-16" />
                            </div>

                            <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="border rounded-t-lg p-3">
                                        <Skeleton className="h-3 w-12 mb-1" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                    <div className="border rounded-t-lg p-3">
                                        <Skeleton className="h-3 w-12 mb-1" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                </div>
                                <div className="border rounded-b-lg p-3">
                                    <Skeleton className="h-3 w-12 mb-1" />
                                    <Skeleton className="h-4 w-full" />
                                </div>
                            </div>

                            <Skeleton className="h-12 w-full rounded-lg" />

                            <div className="space-y-3 pt-4">
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                            </div>

                            <Separator />

                            <div className="flex justify-between items-center">
                                <Skeleton className="h-5 w-20" />
                                <Skeleton className="h-5 w-20" />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
