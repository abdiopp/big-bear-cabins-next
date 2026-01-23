"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Calendar,
  Gift,
  Percent,
  Mountain,
  Waves,
  Dumbbell,
  Beer,
  ArrowLeft,
  Check,
  MapPin,
  Phone,
  Mail,
  Star,
  Tag
} from "lucide-react";

// Icon mapping
const ICON_MAP: Record<string, any> = {
  Beer,
  Mountain,
  Gift,
  Percent,
  Dumbbell,
  Waves,
  Star,
  Tag,
  Calendar,
  Check,
  MapPin,
  Phone,
  Mail,
  ArrowLeft
};

export function SpecialOfferDetailPage({ offer }: { offer: any }) {
  const router = useRouter();

  if (!offer) {
    return null;
  }

  const Icon = (offer.icon && ICON_MAP[offer.icon]) ? ICON_MAP[offer.icon] : Tag;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden mb-12">
        <img src={offer.heroImage || offer.offerImage} alt={offer.offerTitle} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 rounded-xl bg-white/90 backdrop-blur-sm">
                <Icon className="h-8 w-8 text-gray-800" />
              </div>
              {offer.discount && (
                <Badge className="bg-red-600 text-white px-4 py-2 text-base">{offer.discount}</Badge>
              )}
            </div>
            <h1 className="text-5xl md:text-6xl text-white mb-3">{offer.offerTitle}</h1>
            <p className="text-2xl text-white/90">{offer.offerSubtitle}</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            {offer.images && offer.images.length > 0 && (
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-3xl mb-6">Gallery</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {offer.images.map((image: string, index: number) => (
                      <div key={index} className="aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
                        <img
                          src={image}
                          alt={`${offer.offerTitle} ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-3xl mb-4">About This Offer</h2>
                <div className="text-gray-600 text-lg leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: offer.offerDescription }} />
                <p className="text-gray-700 leading-relaxed">{offer.longDescription}</p>
              </CardContent>
            </Card>

            {/* Features */}
            {offer.features && offer.features.length > 0 && (
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-3xl mb-6">Event Features</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {offer.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="text-4xl text-gray-900 mb-2">{offer.discount || "Special Offer"}</div>
                  <p className="text-gray-600">Special Offer</p>
                </div>

                {/* Promo Code */}
                {offer.promoCode && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border-2 border-blue-200 mb-6">
                    <div className="text-center">
                      <span className="text-sm text-gray-600 font-medium block mb-2">Use Promo Code:</span>
                      <code className="text-2xl font-mono font-bold text-gray-900 block mb-3">{offer.promoCode}</code>
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(offer.promoCode);
                        }}
                        variant="outline"
                        className="w-full"
                      >
                        Copy Code
                      </Button>
                    </div>
                  </div>
                )}

                {/* Details */}
                <div className="space-y-4 mb-6">
                  {offer.dates && (
                    <div className="flex items-start space-x-3">
                      <Calendar className="h-5 w-5 text-gray-600 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-600">Dates</div>
                        <div className="font-medium text-gray-900">{offer.dates}</div>
                      </div>
                    </div>
                  )}
                  {offer.location && (
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-600">Location</div>
                        <div className="font-medium text-gray-900">{offer.location}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Package Includes */}
                {offer.inclusions && offer.inclusions.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg mb-3">Package Includes:</h3>
                    <div className="space-y-2">
                      {offer.inclusions.map((item: string, index: number) => (
                        <div key={index} className="flex items-start space-x-2">
                          <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button className="w-full bg-[#477023] hover:bg-[#3a5c1c] text-white text-lg py-6 mb-4" size="lg">
                  Book Now
                </Button>

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-center justify-center space-x-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">(909) 555-BEAR</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">info@bigbearcabins.com</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Back Button at Bottom */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t mt-12 flex justify-center">
          <Button variant="outline" onClick={() => router.push("/special-offers")} className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Offers
          </Button>
        </div>
      </div>
    </div>
  );
}
