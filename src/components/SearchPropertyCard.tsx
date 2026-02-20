"use client";

import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import Link from "next/link";;

interface SearchPropertyCardProps {
  id: string | number;
  imageUrl: string;
  title: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: number;
  dates: string;
  isSuperhost?: boolean;
  isFavorite?: boolean;
  amenities?: { group: string; name: string }[];
}

export function SearchPropertyCard({
  id,
  imageUrl,
  title,
  location,
  dates,
  isSuperhost = false,
  isFavorite = false,
  amenities = []
}: SearchPropertyCardProps) {

  // Helper to check for specific amenities
  const hasAmenity = (keywords: string[]) =>
    amenities?.some(a => keywords.some(k => a.name.toLowerCase().includes(k)));

  const isPetFriendly = hasAmenity(['pet', 'dog']);
  const hasWifi = hasAmenity(['wifi', 'internet', 'wireless']);
  const hasLakeView = hasAmenity(['lake', 'water']);

  return (
    <Link href={`/property/${id}`} className="group cursor-pointer block">
      {/* Image container */}
      <div className="relative aspect-square mb-3 overflow-hidden rounded-xl">
        <ImageWithFallback
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Superhost badge */}
        {isSuperhost && (
          <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1">
            <span className="text-xs font-medium">Superhost</span>
          </div>
        )}

        {/* Favorite button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 right-3 rounded-full p-2 h-auto w-auto bg-background/80 hover:bg-background/90 backdrop-blur-sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Handle favorite toggle here
          }}
        >
          <Heart
            className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-foreground"
              }`}
          />
        </Button>
      </div>

      {/* Property details */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium truncate">{location.replace(/^\d+[-]/, "")}</h3>

        </div>

        <p className="text-muted-foreground text-sm truncate">{title}</p>
        <p className="text-muted-foreground text-sm">{dates}</p>

        {/* Amenities Row */}
        <div className="flex items-center gap-3 pt-1 text-muted-foreground">
          {isPetFriendly && (
            <div className="flex items-center gap-1" title="Pet Friendly">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5" /><path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.955-1.45-2.344-2.5" /><path d="M8 14v.5" /><path d="M16 14v.5" /><path d="M11.25 16.25h1.5L12 17l-.75-.75Z" /><path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306" /></svg>
              <span className="text-xs">Pet Friendly</span>
            </div>
          )}
          {hasWifi && (
            <div className="flex items-center gap-1" title="WiFi">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13a10 10 0 0 1 14 0" /><path d="M8.5 16.5a5 5 0 0 1 7 0" /><path d="M2 8.82a15 15 0 0 1 20 0" /><line x1="12" x2="12.01" y1="20" y2="20" /></svg>
              <span className="text-xs">WiFi</span>
            </div>
          )}
          {hasLakeView && (
            <div className="flex items-center gap-1" title="Lake View">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6c.6 0 1.2-.2 1.7-.6C4.6 4.5 5.5 4 6.5 4s1.9.5 2.8 1.4c.5.4 1.1.6 1.7.6s1.2-.2 1.7-.6C13.6 4.5 14.5 4 15.5 4s1.9.5 2.8 1.4c.5.4 1.1.6 1.7.6s1.2-.2 1.7-.6C22.6 4.5 23.5 4 24 4" /><path d="M2 12c.6 0 1.2-.2 1.7-.6C4.6 10.5 5.5 10 6.5 10s1.9.5 2.8 1.4c.5.4 1.1.6 1.7.6s1.2-.2 1.7-.6C13.6 10.5 14.5 10 15.5 10s1.9.5 2.8 1.4c.5.4 1.1.6 1.7.6s1.2-.2 1.7-.6C22.6 10.5 23.5 10 24 10" /><path d="M2 18c.6 0 1.2-.2 1.7-.6C4.6 16.5 5.5 16 6.5 16s1.9.5 2.8 1.4c.5.4 1.1.6 1.7.6s1.2-.2 1.7-.6C13.6 16.5 14.5 16 15.5 16s1.9.5 2.8 1.4c.5.4 1.1.6 1.7.6s1.2-.2 1.7-.6C22.6 16.5 23.5 16 24 16" /></svg>
              <span className="text-xs">Lake View</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}