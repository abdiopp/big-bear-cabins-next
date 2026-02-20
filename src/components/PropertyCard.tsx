"use client";

import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import Link from "next/link";;

interface PropertyCardProps {
  property: {
    id: string | number;
    imageUrl?: string;
    images?: string[];
    title: string;
    location: string;
    rating: number;
    reviewCount: number;
    price: number;
    dates: string;
    isFavorite?: boolean;
    isSuperhost?: boolean;
    priceLabel?: string;
  };
}

export function PropertyCard({ property }: PropertyCardProps) {
  const {
    imageUrl,
    images,
    title,
    location,
    dates,
    isFavorite = false,
    isSuperhost = false,
  } = property;

  const displayImage = imageUrl || (images && images[0]) || "";
  const hasMultipleImages = images && images.length > 1;

  return (
    <Link href={`/property/${property.id}`} className="group cursor-pointer block">
      {/* Image container */}
      <div className="relative aspect-square mb-3 overflow-hidden rounded-xl">
        <ImageWithFallback
          src={displayImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

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

        {/* Image indicators */}
        {hasMultipleImages && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {images!.slice(0, 5).map((_, index) => (
              <div
                key={index}
                className="w-1.5 h-1.5 rounded-full bg-background/60 backdrop-blur-sm"
              />
            ))}
          </div>
        )}
      </div>

      {/* Property details */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium truncate">{location.replace(/^\d+[-]/, "")}</h3>

        </div>

        <p className="text-muted-foreground text-sm truncate">{title}</p>
        <p className="text-muted-foreground text-sm">{dates}</p>


      </div>
    </Link>
  );
}