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

import { useProperty } from "@/hooks/useProperty";
import { useAvailability } from "@/hooks/useAvailability";
import { PropertyCardSkeleton } from "./PropertyCardSkeleton";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle } from "lucide-react";
import { BookingForm } from "./BookingForm";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";

import { Map } from "./Map";

const amenityIcons = {
  Wifi: Wifi,
  Kitchen: Coffee,
  Parking: Car,
  TV: Tv,
  "Air conditioning": Wind,
};

const defaultAmenities = ["Wifi", "Kitchen", "Parking", "TV", "Air conditioning", "Heating", "Smoke alarm"];

export function PropertyDetailPage() {
  const { id } = useParams();
  const { property, loading, error } = useProperty(id as string);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const { blockedDays } = useAvailability({
    unitId: Number(id),
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    autoFetch: true
  });

  const disabledDates = [
    { before: new Date(new Date().setHours(0, 0, 0, 0)) },
    ...blockedDays.map((d) => new Date(d.date))
  ];

  const getBadgeColor = (badge?: string) => {
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
        return "bg-yellow-500 text-white";
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-8 w-64 bg-gray-200 animate-pulse rounded mb-8" />
        <div className="aspect-video w-full bg-gray-200 animate-pulse rounded-xl mb-12" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
            <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Error Loading Property</h1>
          <p className="text-gray-600 mb-6">{error || "Property could not be found."}</p>
          <Button onClick={() => window.location.href = "/search"}>
            Back to Search
          </Button>
        </div>
      </div>
    );
  }

  const propertyImages = property.images && property.images.length > 0 ? property.images : [property.imageUrl];
  const propertyAmenities = property.amenities && property.amenities.length > 0 ? property.amenities : defaultAmenities;
  const propertyDescription = property.description || "No description available for this property.";
  const propertyBadge = property.isSuperhost ? "platinum" : "gold";

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
            {propertyImages.map((image: string, index: number) => (
              <ImageWithFallback
                key={index}
                src={image}
                alt={`${property.title} ${index + 1}`}
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
            <h1 className="text-2xl font-semibold text-gray-900">{property.title}</h1>
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
                src={propertyImages[0]}
                alt={property.title}
                className="w-full h-full object-cover rounded-l-xl"
              />
            </div>

            {/* Right side - 2x2 grid of smaller images (40% width) */}
            <div className="w-2/5 grid grid-cols-2 gap-2">
              {propertyImages.slice(1, 5).map((image: string, index: number) => (
                <div key={index} className="relative">
                  <ImageWithFallback
                    src={image}
                    alt={`${property.title} ${index + 2}`}
                    className={`w-full h-full object-cover ${index === 1 ? "rounded-tr-xl" : index === 3 ? "rounded-br-xl" : ""
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
          <h2 className="text-xl font-semibold mb-2">Entire cabin in {property.location.split(",")[0]}</h2>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{property.rating}</span>
              <span className="text-sm text-gray-600">({property.reviewCount} reviews)</span>
            </div>
            <span className="text-gray-400">·</span>
            <span className="text-sm text-gray-600 underline">{property.location}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Stats */}
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{property.guests || 2} guests</span>
              </div>
              <div className="flex items-center space-x-1">
                <Bed className="w-4 h-4" />
                <span>{property.bedrooms || 1} bedrooms</span>
              </div>
              <div className="flex items-center space-x-1">
                <Bath className="w-4 h-4" />
                <span>{property.bathrooms || 1} bathrooms</span>
              </div>
            </div>

            <Separator />

            {/* Badge with Platinum Stamp */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Medal className="w-5 h-5 text-yellow-500" />
                <Badge className={`${getBadgeColor(propertyBadge)} px-3 py-1 text-xs uppercase font-medium`}>
                  {propertyBadge}
                </Badge>
              </div>
            </div>

            {/* Description with Show More */}
            <div>
              <p className="text-gray-700 leading-relaxed">
                {showFullDescription ? propertyDescription : `${propertyDescription.substring(0, 200)}...`}
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
                {propertyAmenities.map((amenity: string, index: number) => {
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
            <div id="calendar-section" className="py-8 border-b border-gray-200">
              <div className="mb-6">
                <h3 className="text-xl font-medium mb-2">
                  {dateRange?.from && dateRange?.to
                    ? `${Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))} nights in ${property.location.split(",")[0]}`
                    : "Select dates"}
                </h3>
                <p className="text-gray-600 text-sm">
                  {dateRange?.from ? dateRange.from.toLocaleDateString() : "Add dates"}
                  {dateRange?.to ? ` - ${dateRange.to.toLocaleDateString()}` : ""}
                </p>
              </div>

              {/* Calendar Grid */}
              <div className="flex justify-center">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  disabled={disabledDates}
                  className="border rounded-md p-4"
                />
              </div>

              {/* Clear Dates Button */}
              <div className="flex justify-between items-center mt-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-4 h-4 border border-gray-400 rounded flex items-center justify-center">📅</div>
                </div>
                <Button
                  variant="ghost"
                  className="text-sm underline font-medium"
                  onClick={() => setDateRange(undefined)}
                >
                  Clear dates
                </Button>
              </div>
            </div>

            {/* SECOND IMAGE - Reviews Section */}
            <div className="py-6 border-b border-gray-200">
              <span className="text-xl font-medium">{property.rating}</span>
              <span className="text-gray-600">·</span>
              <span className="text-xl font-medium">{property.reviewCount} reviews</span>

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
                    was very accommodating. I will always choose this place when visiting {property.location.split(",")[0]}
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
              <p className="text-gray-700 mb-6">{property.location}</p>

              {/* Map Container */}
              {/* Map Container */}
              <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
                {(property.latitude && property.longitude) || property.location ? (
                  <Map latitude={property.latitude} longitude={property.longitude} address={property.location} />
                ) : (
                  <div className="w-full h-full relative">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=800&h=400&fit=crop"
                      alt={`Map of ${property.location} location`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                      <span className="bg-white/90 px-4 py-2 rounded-lg text-sm font-medium shadow-sm">
                        Map location not available
                      </span>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Right Column - Booking Widget */}
          <div className="lg:col-span-1">
            <BookingForm
              propertyId={Number(property.id)}
              propertyName={property.title}
              basePrice={property.price}
              maxGuests={property.guests || 10}
              checkInDate={dateRange?.from}
              checkOutDate={dateRange?.to}
              onDateChange={(range) => {
                setDateRange({
                  from: range.from,
                  to: range.to
                });
              }}
              onDateClick={() => {
                const calendarSection = document.getElementById('calendar-section');
                if (calendarSection) {
                  calendarSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
