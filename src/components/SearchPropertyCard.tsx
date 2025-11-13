"use client";

import { Heart, Star } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import Link from "next/link";;

interface SearchPropertyCardProps {
  id: string;
  imageUrl: string;
  title: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: number;
  dates: string;
  isSuperhost?: boolean;
  isFavorite?: boolean;
}

export function SearchPropertyCard({
  id,
  imageUrl,
  title,
  location,
  rating,
  reviewCount,
  price,
  dates,
  isSuperhost = false,
  isFavorite = false
}: SearchPropertyCardProps) {
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
            className={`h-4 w-4 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-foreground"
            }`}
          />
        </Button>
      </div>

      {/* Property details */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium truncate">{location}</h3>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm">{rating}</span>
            <span className="text-sm text-muted-foreground">({reviewCount})</span>
          </div>
        </div>
        
        <p className="text-muted-foreground text-sm truncate">{title}</p>
        <p className="text-muted-foreground text-sm">{dates}</p>
        
        <div className="flex items-baseline space-x-1">
          <span className="font-medium">${price.toLocaleString()}</span>
          <span className="text-sm text-muted-foreground">night</span>
        </div>
      </div>
    </Link>
  );
}