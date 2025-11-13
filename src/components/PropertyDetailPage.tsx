"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  Star,
  Heart,
  Share,
  Grid3X3,
  MapPin,
  Users,
  Bed,
  Bath,
  Wifi,
  Car,
  Coffee,
  Tv,
  Wind,
  Award,
  Medal,
} from "lucide-react";

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  guests: number;
  amenities: string[];
  description: string;
  host: {
    name: string;
    joinedYear: number;
    isSupderhost: boolean;
  };
  badge: "platinum" | "gold" | "silver" | "bronze";
}

// Mock property data
const mockProperty: Property = {
  id: "1",
  title: "Luxury Mountain Cabin with Stunning Views",
  location: "Big Bear Lake, CA",
  price: 299,
  rating: 4.95,
  reviewCount: 127,
  images: [
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1520637836862-4d197d17c155?w=400&h=300&fit=crop",
  ],
  bedrooms: 3,
  bathrooms: 2,
  guests: 8,
  amenities: ["Wifi", "Kitchen", "Parking", "Pool", "Hot tub", "TV", "Air conditioning"],
  description:
    "Experience the perfect mountain getaway in this beautifully appointed luxury cabin. Located in the heart of Big Bear Lake, this stunning property offers breathtaking views, modern amenities, and the perfect blend of rustic charm and contemporary comfort. The cabin features expansive windows that frame panoramic mountain vistas, a gourmet kitchen with top-of-the-line appliances, and a spacious living area with a stone fireplace perfect for cozy evenings. The master suite boasts a private balcony and spa-like bathroom with a soaking tub. Additional amenities include a private hot tub on the deck, game room with pool table, and direct access to hiking trails.",
  host: {
    name: "Sarah Johnson",
    joinedYear: 2019,
    isSupderhost: true,
  },
  badge: "platinum",
};

const amenityIcons = {
  Wifi: Wifi,
  Kitchen: Coffee,
  Parking: Car,
  TV: Tv,
  "Air conditioning": Wind,
};

export function PropertyDetailPage() {
  const { id } = useParams();
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "platinum":
        return "bg-gray-800 text-white";
      case "gold":
        return "bg-yellow-500 text-white";
      case "silver":
        return "bg-gray-400 text-white";
      case "bronze":
        return "bg-orange-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  if (showAllPhotos) {
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Photos</h1>
            <Button variant="ghost" onClick={() => setShowAllPhotos(false)}>
              Close
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockProperty.images.map((image, index) => (
              <ImageWithFallback
                key={index}
                src={image}
                alt={`${mockProperty.title} ${index + 1}`}
                className="w-full aspect-square object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Constrained Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{mockProperty.title}</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
              <Share className="w-4 h-4" />
              <span>Share</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span>Save</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Image Gallery - Airbnb Layout */}
      <div className="relative mb-8 w-full">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 h-[400px]">
            {/* Main large image - left side (60% width) */}
            <div className="w-3/5">
              <ImageWithFallback
                src={mockProperty.images[0]}
                alt={mockProperty.title}
                className="w-full h-full object-cover rounded-l-xl"
              />
            </div>

            {/* Right side - 2x2 grid of smaller images (40% width) */}
            <div className="w-2/5 grid grid-cols-2 gap-2">
              {mockProperty.images.slice(1, 5).map((image, index) => (
                <div key={index} className="relative">
                  <ImageWithFallback
                    src={image}
                    alt={`${mockProperty.title} ${index + 2}`}
                    className={`w-full h-full object-cover ${
                      index === 1 ? "rounded-tr-xl" : index === 3 ? "rounded-br-xl" : ""
                    }`}
                  />
                  {/* Show all photos button on the last image (bottom-right) */}
                  {index === 3 && (
                    <div className="absolute bottom-4 right-4">
                      <Button
                        variant="outline"
                        onClick={() => setShowAllPhotos(true)}
                        className="bg-white text-black hover:bg-gray-100 border border-gray-400 shadow-sm flex items-center space-x-2 px-4 py-2 text-sm"
                      >
                        <Grid3X3 className="w-4 h-4" />
                        <span>Show all photos</span>
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Back to Constrained Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabin Type and Location */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Entire cabin in {mockProperty.location.split(",")[0]}</h2>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{mockProperty.rating}</span>
              <span className="text-sm text-gray-600">({mockProperty.reviewCount} reviews)</span>
            </div>
            <span className="text-gray-400">·</span>
            <span className="text-sm text-gray-600 underline">{mockProperty.location}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Stats */}
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{mockProperty.guests} guests</span>
              </div>
              <div className="flex items-center space-x-1">
                <Bed className="w-4 h-4" />
                <span>{mockProperty.bedrooms} bedrooms</span>
              </div>
              <div className="flex items-center space-x-1">
                <Bath className="w-4 h-4" />
                <span>{mockProperty.bathrooms} bathrooms</span>
              </div>
            </div>

            <Separator />

            {/* Badge with Platinum Stamp */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Medal className="w-5 h-5 text-yellow-500" />
                <Badge className={`${getBadgeColor(mockProperty.badge)} px-3 py-1 text-xs uppercase font-medium`}>
                  {mockProperty.badge}
                </Badge>
              </div>
            </div>

            {/* Description with Show More */}
            <div>
              <p className="text-gray-700 leading-relaxed">
                {showFullDescription ? mockProperty.description : `${mockProperty.description.substring(0, 200)}...`}
              </p>
              <Button
                variant="ghost"
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="p-0 h-auto text-sm underline font-medium mt-2"
              >
                {showFullDescription ? "Show less" : "Show more"}
              </Button>
            </div>

            <Separator />

            {/* Amenities */}
            <div>
              <h3 className="text-lg font-semibold mb-4">What this place offers</h3>
              <div className="grid grid-cols-2 gap-3">
                {mockProperty.amenities.map((amenity, index) => {
                  const IconComponent = amenityIcons[amenity as keyof typeof amenityIcons];
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      {IconComponent ? (
                        <IconComponent className="w-5 h-5 text-gray-600" />
                      ) : (
                        <div className="w-5 h-5 bg-gray-300 rounded-full" />
                      )}
                      <span className="text-sm">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FIRST IMAGE - Show All Amenities Button */}
            <div className="py-6 border-b border-gray-200">
              <Button
                variant="outline"
                className="bg-white hover:bg-gray-50 border border-gray-300 px-6 py-3 rounded-lg font-medium"
              >
                Show all 46 amenities
              </Button>
            </div>

            {/* CALENDAR SECTION - 6 nights selection */}
            <div className="py-8 border-b border-gray-200">
              <div className="mb-6">
                <h3 className="text-xl font-medium mb-2">6 nights in Islamabad</h3>
                <p className="text-gray-600 text-sm">Feb 2, 2026 - Feb 8, 2026</p>
              </div>

              {/* Calendar Grid */}
              <div className="flex flex-col lg:flex-row gap-8">
                {/* August 2026 Calendar */}
                <div className="flex-1">
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <h4 className="font-medium">August 2026</h4>
                      <div className="w-8"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center text-sm">
                    {/* Day headers */}
                    <div className="p-2 text-gray-500 font-medium">S</div>
                    <div className="p-2 text-gray-500 font-medium">M</div>
                    <div className="p-2 text-gray-500 font-medium">T</div>
                    <div className="p-2 text-gray-500 font-medium">W</div>
                    <div className="p-2 text-gray-500 font-medium">T</div>
                    <div className="p-2 text-gray-500 font-medium">F</div>
                    <div className="p-2 text-gray-500 font-medium">S</div>

                    {/* Calendar days */}
                    <div className="p-2"></div>
                    <div className="p-2"></div>
                    <div className="p-2"></div>
                    <div className="p-2"></div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">1</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">2</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">3</div>

                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">4</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">5</div>
                    <div className="p-2 bg-black text-white rounded-full cursor-pointer">6</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">7</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">8</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">9</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">10</div>

                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">11</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">12</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">13</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">14</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">15</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">16</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">17</div>

                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">18</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">19</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">20</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">21</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">22</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">23</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">24</div>

                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">25</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">26</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">27</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">28</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">29</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">30</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">31</div>
                  </div>
                </div>

                {/* September 2026 Calendar */}
                <div className="flex-1">
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-8"></div>
                      <h4 className="font-medium">September 2026</h4>
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center text-sm">
                    {/* Day headers */}
                    <div className="p-2 text-gray-500 font-medium">S</div>
                    <div className="p-2 text-gray-500 font-medium">M</div>
                    <div className="p-2 text-gray-500 font-medium">T</div>
                    <div className="p-2 text-gray-500 font-medium">W</div>
                    <div className="p-2 text-gray-500 font-medium">T</div>
                    <div className="p-2 text-gray-500 font-medium">F</div>
                    <div className="p-2 text-gray-500 font-medium">S</div>

                    {/* Calendar days */}
                    <div className="p-2"></div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">1</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">2</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">3</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">4</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">5</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">6</div>

                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">7</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">8</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">9</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">10</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">11</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">12</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">13</div>

                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">14</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">15</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">16</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">17</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">18</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">19</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">20</div>

                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">21</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">22</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">23</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">24</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">25</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">26</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">27</div>

                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">28</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">29</div>
                    <div className="p-2 text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">30</div>
                    <div className="p-2"></div>
                    <div className="p-2"></div>
                    <div className="p-2"></div>
                    <div className="p-2"></div>
                  </div>
                </div>
              </div>

              {/* Clear Dates Button */}
              <div className="flex justify-between items-center mt-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-4 h-4 border border-gray-400 rounded flex items-center justify-center">📅</div>
                </div>
                <Button variant="ghost" className="text-sm underline font-medium">
                  Clear dates
                </Button>
              </div>
            </div>

            {/* SECOND IMAGE - Reviews Section */}
            <div className="py-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-black fill-current" />
                  <span className="text-xl font-medium">{mockProperty.rating}</span>
                  <span className="text-gray-600">·</span>
                  <span className="text-xl font-medium">{mockProperty.reviewCount} reviews</span>
                </div>
              </div>

              {/* Reviews Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Review 1 */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
                        alt="Shajee"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">Shajee</p>
                      <p className="text-sm text-gray-600">Riyadh, Saudi Arabia</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-black fill-current" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">2 weeks ago</span>
                    <span className="text-sm text-gray-600">· Stayed with kids</span>
                  </div>
                  <p className="text-gray-900 leading-relaxed">
                    I stayed with my family for 2 nights. It was a great experience, the place was clean and the host
                    was very accommodating. I will always choose this place when visiting Islamabad
                  </p>
                  <Button variant="ghost" className="p-0 h-auto text-sm underline font-medium">
                    Show more
                  </Button>
                </div>

                {/* Review 2 */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
                        alt="Ellie"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">Ellie</p>
                      <p className="text-sm text-gray-600">Chicago, Illinois</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-black fill-current" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">February 2025</span>
                    <span className="text-sm text-gray-600">· Stayed with kids</span>
                  </div>
                  <p className="text-gray-900 leading-relaxed">
                    The space was larger than I realized and included a dining room that is not pictured in the listing.
                    One highlight for our family was the large park with walking...
                  </p>
                  <Button variant="ghost" className="p-0 h-auto text-sm underline font-medium">
                    Show more
                  </Button>
                </div>

                {/* Review 3 */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                        alt="Haisam"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">Haisam</p>
                      <p className="text-sm text-gray-600">Lahore, Pakistan</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-black fill-current" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">January 2025</span>
                    <span className="text-sm text-gray-600">· Stayed with kids</span>
                  </div>
                  <p className="text-gray-900 leading-relaxed">
                    A great and clean place to stay. Felt like home and the helper at the house was very helpful.
                    Everything there is a public park right in front of the house, your kids would be ver...
                  </p>
                  <Button variant="ghost" className="p-0 h-auto text-sm underline font-medium">
                    Show more
                  </Button>
                </div>

                {/* Review 4 */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face"
                        alt="Zafar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">Zafar</p>
                      <p className="text-sm text-gray-600">Vancouver, Canada</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-black fill-current" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">February 2025</span>
                    <span className="text-sm text-gray-600">· Group trip</span>
                  </div>
                  <p className="text-gray-900 leading-relaxed">
                    This was my second time staying at Ibrahim's place. Enjoyed it last time around and enjoyed it this
                    time as well. Caretaker is extremely helpful. I will stay there again. I highly recommend...
                  </p>
                  <Button variant="ghost" className="p-0 h-auto text-sm underline font-medium">
                    Show more
                  </Button>
                </div>

                {/* Review 5 */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
                        alt="Kashif"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">Kashif</p>
                      <p className="text-sm text-gray-600">Dubai, United Arab Emirates</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-black fill-current" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">December 2024</span>
                    <span className="text-sm text-gray-600">· Stayed with kids</span>
                  </div>
                  <p className="text-gray-900 leading-relaxed">
                    Amazing place and 100% as described. Very well kept property. My family enjoyed a lot. Its very
                    close to everything you need for daily life.
                  </p>
                </div>

                {/* Review 6 */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
                        alt="Amer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">Amer</p>
                      <p className="text-sm text-gray-600">8 years on Airbnb</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-black fill-current" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">December 2024</span>
                    <span className="text-sm text-gray-600">· Stayed a few nights</span>
                  </div>
                  <p className="text-gray-900 leading-relaxed">
                    We booked this accommodation for 5 nights. We felt right at home. Very good location. It was close
                    to all local amenities. Will be visiting again soon. 5 stars.
                  </p>
                </div>
              </div>

              {/* Show All Reviews Button */}
              <div className="mt-8">
                <Button
                  variant="outline"
                  className="bg-white hover:bg-gray-50 border border-gray-300 px-6 py-3 rounded-lg font-medium"
                >
                  Show all 42 reviews
                </Button>
              </div>
            </div>

            {/* THIRD IMAGE - Where You'll Be Section */}
            <div className="py-6">
              <h3 className="text-xl font-semibold mb-4">Where you'll be</h3>
              <p className="text-gray-700 mb-6">Islamabad, Islamabad Capital Territory, Pakistan</p>

              {/* Map Container */}
              <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=800&h=400&fit=crop"
                  alt="Map of Islamabad location"
                  className="w-full h-full object-cover"
                />

                {/* Map Overlay with Location Pin */}
                <div className="absolute inset-0 bg-green-50 bg-opacity-90">
                  <div className="relative w-full h-full">
                    {/* Location Pin */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Map Labels */}
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium border border-gray-200">
                      BLUE AREA
                    </div>

                    <div className="absolute top-1/3 left-1/4 bg-white px-2 py-1 rounded text-xs border border-gray-200">
                      🌳 Corner Park
                    </div>

                    <div className="absolute bottom-1/3 right-1/3 bg-white px-2 py-1 rounded text-xs border border-gray-200">
                      🌹 Rose And Jasmine Garden
                    </div>

                    <div className="absolute bottom-1/4 left-1/3 bg-white px-2 py-1 rounded text-xs border border-gray-200">
                      🥘 Basit The Food Street
                    </div>

                    <div className="absolute top-1/2 right-1/4 bg-white px-2 py-1 rounded text-xs border border-gray-200">
                      🏛️ Gumbdi Pakwan
                    </div>

                    <div className="absolute bottom-4 right-4 bg-white px-2 py-1 rounded text-xs border border-gray-200">
                      🌲 Shakarparian National Park
                    </div>
                  </div>
                </div>

                {/* Map Controls */}
                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                  <Button size="sm" variant="outline" className="w-10 h-10 p-0 bg-white hover:bg-gray-50">
                    🔍
                  </Button>
                  <Button size="sm" variant="outline" className="w-10 h-10 p-0 bg-white hover:bg-gray-50">
                    ⛶
                  </Button>
                </div>

                <div className="absolute bottom-4 left-4 flex flex-col space-y-1">
                  <Button size="sm" variant="outline" className="w-8 h-8 p-0 bg-white hover:bg-gray-50 text-lg">
                    +
                  </Button>
                  <Button size="sm" variant="outline" className="w-8 h-8 p-0 bg-white hover:bg-gray-50 text-lg">
                    −
                  </Button>
                </div>

                {/* Expand Map Button */}
                <div className="absolute bottom-4 right-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white hover:bg-gray-50 px-3 py-2 text-sm border border-gray-300"
                  >
                    ⛶ Show area
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              {/* All Fees Included Badge - Above the price box */}
              <div className="flex justify-center mb-4">
                <Badge className="bg-black text-white px-6 py-3 text-sm font-medium">All fees included</Badge>
              </div>

              <Card className="p-6 shadow-lg border border-gray-200">
                <CardContent className="p-0 space-y-4">
                  {/* Price */}
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-semibold">${mockProperty.price}</span>
                    <span className="text-gray-600">night</span>
                  </div>

                  {/* Dates and Guests */}
                  <div className="border border-gray-300 rounded-lg">
                    <div className="grid grid-cols-2">
                      <div className="p-3 border-r border-gray-300">
                        <div className="text-xs font-medium text-gray-700 uppercase">Check-in</div>
                        <div className="text-sm text-gray-500">Add date</div>
                      </div>
                      <div className="p-3">
                        <div className="text-xs font-medium text-gray-700 uppercase">Checkout</div>
                        <div className="text-sm text-gray-500">Add date</div>
                      </div>
                    </div>
                    <div className="p-3 border-t border-gray-300">
                      <div className="text-xs font-medium text-gray-700 uppercase">Guests</div>
                      <div className="text-sm text-gray-500">1 guest</div>
                    </div>
                  </div>

                  {/* Book Button */}
                  <Button className="w-full text-white py-3 font-medium" style={{ backgroundColor: "#477023" }}>
                    Let's Book!
                  </Button>

                  {/* Fee Breakdown */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">${mockProperty.price} × 5 nights</span>
                      <span>${mockProperty.price * 5}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cleaning fee</span>
                      <span>$50</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service fee</span>
                      <span>$75</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total before taxes</span>
                      <span>${mockProperty.price * 5 + 50 + 75}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
