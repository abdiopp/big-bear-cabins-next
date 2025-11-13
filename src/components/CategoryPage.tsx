"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PropertyCard } from "./PropertyCard";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  images: string[];
  amenities: string[];
  beds: number;
  bathrooms: number;
  guests: number;
}

const mockProperties: Property[] = [
  {
    id: "1",
    title: "Cozy Mountain Cabin with Fireplace",
    location: "Big Bear Lake, CA",
    price: 189,
    rating: 4.8,
    reviewCount: 124,
    images: [
      "https://images.unsplash.com/photo-1610486870547-05b74398c3d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWJpbiUyMG1vdW50YWluJTIwdmlld3xlbnwxfHx8fDE3NTg4OTk5MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    amenities: ["Mountain view", "Hot Tub", "Fireplace"],
    beds: 3,
    bathrooms: 2,
    guests: 6,
  },
  {
    id: "2",
    title: "Lakefront Retreat with Private Dock",
    location: "Big Bear Lake, CA",
    price: 245,
    rating: 4.9,
    reviewCount: 89,
    images: [
      "https://images.unsplash.com/photo-1670121180530-cfcba4438038?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWtlZnJvbnQlMjBjYWJpbiUyMGRvY2t8ZW58MXx8fHwxNzU4ODk5OTI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    amenities: ["Lakefront", "Boat Dock", "EV charger"],
    beds: 4,
    bathrooms: 3,
    guests: 8,
  },
  {
    id: "3",
    title: "Luxury Ski-In Ski-Out Lodge",
    location: "Snow Summit, CA",
    price: 320,
    rating: 4.7,
    reviewCount: 156,
    images: [
      "https://images.unsplash.com/photo-1577910277144-10be41309dec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2klMjBsb2RnZSUyMGNhYmlufGVufDF8fHx8MTc1ODg5OTkzM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    amenities: ["Mountain view", "Hot Tub", "Ski access"],
    beds: 5,
    bathrooms: 4,
    guests: 10,
  },
  {
    id: "4",
    title: "Pet-Friendly Cabin with Fenced Yard",
    location: "Big Bear Village, CA",
    price: 165,
    rating: 4.6,
    reviewCount: 78,
    images: [
      "https://images.unsplash.com/photo-1610486870547-05b74398c3d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWJpbiUyMG1vdW50YWluJTIwdmlld3xlbnwxfHx8fDE3NTg4OTk5MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    amenities: ["Pet friendly", "Fenced yard", "Mountain view"],
    beds: 2,
    bathrooms: 2,
    guests: 4,
  },
  {
    id: "5",
    title: "Rustic Cabin with Pool Table",
    location: "Moonridge, CA",
    price: 198,
    rating: 4.5,
    reviewCount: 92,
    images: [
      "https://images.unsplash.com/photo-1699078614960-82b2ebe8d896?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYWJpbiUyMGludGVyaW9yfGVufDF8fHx8MTc1ODg5OTkzN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    amenities: ["Pool table", "Game room", "Hot Tub"],
    beds: 3,
    bathrooms: 2,
    guests: 6,
  },
  {
    id: "6",
    title: "Modern Cabin with Jacuzzi",
    location: "Bear Mountain, CA",
    price: 275,
    rating: 4.8,
    reviewCount: 134,
    images: [
      "https://images.unsplash.com/photo-1682906159394-a9912cb007b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWJpbiUyMGhvdCUyMHR1YiUyMGphY3V6eml8ZW58MXx8fHwxNzU4ODk5OTQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    amenities: ["Jacuzzi", "Mountain view", "Modern amenities"],
    beds: 4,
    bathrooms: 3,
    guests: 8,
  },
  {
    id: "7",
    title: "Mountain View Chalet",
    location: "North Shore, CA",
    price: 225,
    rating: 4.7,
    reviewCount: 67,
    images: [
      "https://images.unsplash.com/photo-1649014239025-7914a09918dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGNoYWxldCUyMGNhYmlufGVufDF8fHx8MTc1ODg5OTk4MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    amenities: ["Mountain view", "Fireplace", "Deck"],
    beds: 3,
    bathrooms: 2,
    guests: 6,
  },
  {
    id: "8",
    title: "Lakefront Villa with Private Beach",
    location: "East Area, CA",
    price: 380,
    rating: 4.9,
    reviewCount: 201,
    images: [
      "https://images.unsplash.com/photo-1758241111370-460859cddde4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBsYWtlZnJvbnQlMjB2aWxsYXxlbnwxfHx8fDE3NTg4OTk5ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    amenities: ["Lakefront", "Private beach", "EV charger"],
    beds: 6,
    bathrooms: 4,
    guests: 12,
  },
  {
    id: "9",
    title: "Cozy Ski Cabin",
    location: "Village Area, CA",
    price: 210,
    rating: 4.6,
    reviewCount: 88,
    images: [
      "https://images.unsplash.com/photo-1577910277144-10be41309dec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2klMjBsb2RnZSUyMGNhYmlufGVufDF8fHx8MTc1ODg5OTkzM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    amenities: ["Ski access", "Hot Tub", "Mountain view"],
    beds: 3,
    bathrooms: 2,
    guests: 6,
  },
  {
    id: "10",
    title: "Luxury Mountain Estate",
    location: "West Area, CA",
    price: 450,
    rating: 5.0,
    reviewCount: 156,
    images: [
      "https://images.unsplash.com/photo-1699078614960-82b2ebe8d896?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYWJpbiUyMGludGVyaW9yfGVufDF8fHx8MTc1ODg5OTkzN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    amenities: ["Mountain view", "Hot Tub", "EV charger", "Pool table"],
    beds: 7,
    bathrooms: 5,
    guests: 14,
  },
  {
    id: "11",
    title: "Family Cabin with Game Room",
    location: "Big Bear Lake, CA",
    price: 195,
    rating: 4.7,
    reviewCount: 112,
    images: [
      "https://images.unsplash.com/photo-1697807713040-b5fb60d6f012?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydXN0aWMlMjBjYWJpbiUyMGludGVyaW9yfGVufDF8fHx8MTc1ODg5OTk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    amenities: ["Game room", "Pet friendly", "Hot Tub"],
    beds: 4,
    bathrooms: 3,
    guests: 8,
  },
  {
    id: "12",
    title: "Romantic Lakefront Getaway",
    location: "Big Bear Lake, CA",
    price: 285,
    rating: 4.8,
    reviewCount: 94,
    images: [
      "https://images.unsplash.com/photo-1670121180530-cfcba4438038?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWtlZnJvbnQlMjBjYWJpbiUyMGRvY2t8ZW58MXx8fHwxNzU4ODk5OTI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    amenities: ["Lakefront", "Jacuzzi", "Boat Dock"],
    beds: 2,
    bathrooms: 2,
    guests: 4,
  },
  {
    id: "13",
    title: "Adventure Base Camp Cabin",
    location: "Bear Mountain, CA",
    price: 175,
    rating: 4.5,
    reviewCount: 73,
    images: [
      "https://images.unsplash.com/photo-1610486870547-05b74398c3d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWJpbiUyMG1vdW50YWluJTIwdmlld3xlbnwxfHx8fDE3NTg4OTk5MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    amenities: ["Mountain view", "Pet friendly", "EV charger"],
    beds: 3,
    bathrooms: 2,
    guests: 6,
  },
  {
    id: "14",
    title: "Premium Ski Lodge",
    location: "Snow Summit, CA",
    price: 365,
    rating: 4.9,
    reviewCount: 187,
    images: [
      "https://images.unsplash.com/photo-1577910277144-10be41309dec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2klMjBsb2RnZSUyMGNhYmlufGVufDF8fHx8MTc1ODg5OTkzM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    amenities: ["Ski access", "Hot Tub", "Mountain view", "Pool table"],
    beds: 5,
    bathrooms: 4,
    guests: 10,
  },
  {
    id: "15",
    title: "Secluded Mountain Hideaway",
    location: "Moonridge, CA",
    price: 235,
    rating: 4.6,
    reviewCount: 65,
    images: [
      "https://images.unsplash.com/photo-1649014239025-7914a09918dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGNoYWxldCUyMGNhYmlufGVufDF8fHx8MTc1ODg5OTk4MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    amenities: ["Mountain view", "Hot Tub", "Fireplace"],
    beds: 3,
    bathrooms: 2,
    guests: 6,
  },
];

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
  const [filteredProperties, setFilteredProperties] = useState(mockProperties);

  const categoryTitle = categoryTitles[category || "cabins"] || "Properties";
  const resultCount = filteredProperties.length;

  // Filter properties based on category
  const getFilteredProperties = () => {
    switch (category) {
      case "lakefront":
        return mockProperties.filter((p) => p.amenities.some((a) => a.toLowerCase().includes("lakefront")));
      case "ski":
        return mockProperties.filter((p) => p.amenities.some((a) => a.toLowerCase().includes("ski")));
      case "jacuzzi":
        return mockProperties.filter((p) =>
          p.amenities.some((a) => a.toLowerCase().includes("jacuzzi") || a.toLowerCase().includes("hot tub")),
        );
      case "pool-table":
        return mockProperties.filter((p) => p.amenities.some((a) => a.toLowerCase().includes("pool table")));
      case "luxury":
        return mockProperties.filter((p) => p.price >= 300);
      case "pet-friendly":
        return mockProperties.filter((p) => p.amenities.some((a) => a.toLowerCase().includes("pet friendly")));
      case "mountains":
        return mockProperties.filter((p) => p.amenities.some((a) => a.toLowerCase().includes("mountain view")));
      default:
        return mockProperties;
    }
  };

  const categoryProperties = getFilteredProperties();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{categoryTitle}</h1>
            <p className="text-gray-600 mt-1">{categoryProperties.length} stays</p>
          </div>
        </div>

        {/* Property Grid - 5 per row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {categoryProperties.map((property) => (
            <Link key={property.id} href={`/property/${property.id}`} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-xl">
                <ImageWithFallback
                  src={property.images[0]}
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
                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm text-gray-600">{property.rating}</span>
                  </div>
                </div>

                <p className="text-gray-500 text-sm">{property.location}</p>
                <p className="text-gray-500 text-sm">
                  {property.beds} beds · {property.bathrooms} baths
                </p>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {property.amenities.slice(0, 2).map((amenity, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {amenity}
                    </span>
                  ))}
                </div>

                <div className="mt-2">
                  <span className="font-semibold text-gray-900">${property.price}</span>
                  <span className="text-gray-500"> night</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No results message */}
        {categoryProperties.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-500">Try adjusting your filters or search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
