"use client";

import { useState } from "react";
import { Calendar, Users, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { SearchPropertyCard } from "./SearchPropertyCard";
import { PropertyGrid } from "./PropertyGrid";

const mockProperties = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&h=300&fit=crop",
    title: "Luxury Mountain Cabin",
    location: "Big Bear Lake, CA",
    rating: 4.9,
    reviewCount: 127,
    price: 299,
    dates: "Dec 15-20",
    isSuperhost: true
  },
  {
    id: "2", 
    imageUrl: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=500&h=300&fit=crop",
    title: "Cozy Lakefront Retreat",
    location: "Big Bear Lake, CA", 
    rating: 4.8,
    reviewCount: 89,
    price: 249,
    dates: "Dec 22-27",
    isSuperhost: false
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
    title: "Modern A-Frame Cabin",
    location: "Big Bear Village, CA",
    rating: 4.7,
    reviewCount: 156,
    price: 189,
    dates: "Jan 3-8",
    isSuperhost: false
  }
];

export function SearchPage() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Filters */}
      <div className="bg-white border-b sticky top-20 z-10">
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
          <h1 className="mb-2">Stay in Big Bear</h1>
          <p className="text-gray-600">Over 300 homes · {mockProperties.length} results for your search</p>
        </div>

        <PropertyGrid>
          {mockProperties.map((property) => (
            <SearchPropertyCard key={property.id} {...property} />
          ))}
        </PropertyGrid>
      </div>
    </div>
  );
}