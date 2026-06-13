"use client";

import type { MouseEvent } from "react";
import { Heart, BedDouble, Users, Bath } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
  bedrooms?: number;
  bathrooms?: number;
  guests?: number;
  amenities?: { group: string; name: string }[];
  isHovered?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  cardRef?: (node: HTMLAnchorElement | null) => void;
  onCardClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  averageNightlyRate?: number; // Naya optional prop
}

export function SearchPropertyCard({
  id,
  imageUrl,
  title,
  location,
  price,
  dates,
  isSuperhost = false,
  isFavorite = false,
  bedrooms,
  bathrooms,
  guests: initialGuests,
  amenities = [],
  isHovered = false,
  onMouseEnter,
  onMouseLeave,
  cardRef,
  onCardClick,
  averageNightlyRate
}: SearchPropertyCardProps) {
  // 1. URL se exact wahi keys nikalenge jo handleSearch set kar raha hai
  const searchParams = useSearchParams();
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const occupants = searchParams.get("occupants") || "1";
  const occupantsSmall = searchParams.get("occupants_small") || "0";
  const pets = searchParams.get("pets") || "false";

  const cleanLocation = location.replace(/^[\d]+-?/, "").trim();

  // 2. Ab strict handleSearch dynamic structure ke mutabiq params object banayein gey
  const params = new URLSearchParams();

  if (checkIn) params.set("checkIn", checkIn);
  if (checkOut) params.set("checkOut", checkOut);
  if (occupants) params.set("guests", occupants);
  if (occupantsSmall && occupantsSmall !== "0") params.set("children", occupantsSmall);
  if (pets === "true") {
    params.set("pets", "true");
  }
  const queryString = params.toString();

  return (
    <Link
      href={`/property/${id}?${queryString}`}
      className="group block cursor-pointer"
      ref={cardRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onCardClick}
    >
      <div
        className="rounded-2xl overflow-hidden transition-all duration-200"
        style={{
          boxShadow: isHovered
            ? "0 8px 32px rgba(0,0,0,0.18)"
            : "0 1px 4px rgba(0,0,0,0.08)",
          transform: isHovered ? "translateY(-2px)" : "translateY(0)",
          background: "#ffffff",
        }}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <ImageWithFallback
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Superhost badge */}
          {isSuperhost && (
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm">
              <span className="text-xs font-semibold text-gray-800">⭐ Superhost</span>
            </div>
          )}

          {/* Favorite button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2.5 right-2.5 rounded-full p-2 h-auto w-auto bg-white/80 hover:bg-white backdrop-blur-sm shadow-sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-700"
                }`}
            />
          </Button>
        </div>

        {/* Details */}
        <div className="p-3.5">
          {/* Title */}
          <div className="mb-1">
            <h3 className="font-semibold text-[13px] text-gray-900 truncate leading-tight">
              {title}
            </h3>
          </div>

          {/* Location */}
          <p className="text-[12px] text-gray-500 truncate mb-2">{cleanLocation}</p>

          {/* Property specs */}
          {(bedrooms || bathrooms || initialGuests) && (
            <div className="flex items-center gap-3 mb-2.5 flex-wrap">
              {bedrooms && (
                <div className="flex items-center gap-1 text-gray-500">
                  <BedDouble className="h-3 w-3" />
                  <span className="text-[11px]">{bedrooms} bed{bedrooms > 1 ? "s" : ""}</span>
                </div>
              )}
              {bathrooms && (
                <div className="flex items-center gap-1 text-gray-500">
                  <Bath className="h-3 w-3" />
                  <span className="text-[11px]">{bathrooms} bath{bathrooms > 1 ? "s" : ""}</span>
                </div>
              )}
              {initialGuests && (
                <div className="flex items-center gap-1 text-gray-500">
                  <Users className="h-3 w-3" />
                  <span className="text-[11px]">{initialGuests} guests</span>
                </div>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-1">
            <span className="text-[15px] font-bold text-gray-900">
              {averageNightlyRate !== undefined && averageNightlyRate > 0 ? `$${averageNightlyRate.toFixed(2)}` : "Select dates for price"}
            </span>
            {averageNightlyRate !== undefined && averageNightlyRate > 0 && (
              <span className="text-[12px] text-gray-500">/ night</span>
            )}
          </div>

          {dates && dates !== "Available now" && (
            <p className="text-[11px] text-gray-400 mt-0.5">{dates}</p>
          )}
        </div>
      </div>
    </Link>
  );
}