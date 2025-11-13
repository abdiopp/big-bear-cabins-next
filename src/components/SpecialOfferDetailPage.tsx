"use client";

import { useParams } from "next/navigation";
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
  Clock,
  Users,
  Star,
  Phone,
  Mail,
} from "lucide-react";

const offerDetails = {
  oktoberfest: {
    id: "oktoberfest",
    title: "BIG BEAR OKTOBERFEST",
    subtitle: "Traditional Celebration",
    code: "OKTOBERFEST",
    discount: "15% Off",
    icon: Beer,
    heroImage: "https://images.unsplash.com/photo-1669778631871-7bb6d5411c4b?w=1200&h=600&fit=crop",
    description:
      "Join us for an authentic German celebration in the heart of Big Bear! Experience traditional Bavarian festivities with live music, delicious authentic foods, and craft brews.",
    longDescription:
      "Immerse yourself in the rich traditions of Oktoberfest without leaving the mountains. Our Big Bear Oktoberfest celebration brings authentic German culture to the San Bernardino Mountains with live oompah bands, traditional dancers, and a festive atmosphere that rivals Munich itself. Book your cabin now and enjoy exclusive savings while experiencing this unforgettable cultural event.",
    dates: "September 20-22, 2025",
    location: "Big Bear Village Convention Center",
    features: [
      "Live German oompah band performances",
      "Traditional Bavarian dancers and entertainment",
      "Authentic German cuisine and artisan sausages",
      "Premium craft beer selection from local and German breweries",
      "Family-friendly activities and games",
      "Costume contests with prizes",
      "Exclusive cabin guest discount vouchers",
      "Free shuttle service from participating cabins",
    ],
    inclusions: [
      "15% off cabin rental for event weekend",
      "2 complimentary event tickets per cabin",
      "Priority seating reservations",
      "Special breakfast package available",
    ],
    images: [
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1669778631871-7bb6d5411c4b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1585803114088-cd027272106a?w=400&h=300&fit=crop",
    ],
  },
  "yoga-festival": {
    id: "yoga-festival",
    title: "YOGA FESTIVAL",
    subtitle: "10/4",
    code: "YOGABLISS",
    discount: "Wellness Package",
    icon: Mountain,
    heroImage: "https://images.unsplash.com/photo-1641745143915-a433c508348d?w=1200&h=600&fit=crop",
    description:
      "Find your zen in the mountains. Restore your mind, body, and soul with guided sessions surrounded by nature's beauty.",
    longDescription:
      "Escape to the tranquil mountains of Big Bear for a transformative yoga and wellness experience. Our annual Yoga Festival brings together renowned instructors, holistic practitioners, and wellness enthusiasts for a day of rejuvenation, meditation, and mountain-fresh inspiration. Practice sunrise yoga with panoramic lake views, attend workshops on mindfulness and healthy living, and connect with a community of like-minded souls.",
    dates: "October 4, 2025",
    location: "Big Bear Lake Waterfront Park",
    features: [
      "Multiple yoga sessions for all skill levels",
      "Guided meditation and breathwork classes",
      "Outdoor sessions with lake and mountain views",
      "Wellness workshops and seminars",
      "Healthy food vendors and smoothie bar",
      "Sound healing sessions",
      "Aromatherapy and essential oils station",
      "Sunset meditation on the lake",
    ],
    inclusions: [
      "Wellness package discount on cabin stays",
      "Complimentary festival admission",
      "Yoga mat and water bottle provided",
      "Healthy breakfast basket in cabin",
    ],
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1641745143915-a433c508348d?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1585803114088-cd027272106a?w=400&h=300&fit=crop",
    ],
  },
  "third-night-free": {
    id: "third-night-free",
    title: "3RD NIGHT FREE!",
    subtitle: "Extended Stay Special",
    code: "STAY3FREE",
    discount: "33% Savings",
    icon: Gift,
    heroImage: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=600&fit=crop",
    description:
      "Stay 2 nights, get the 3rd absolutely FREE! Perfect for long weekends and extra relaxation time in your mountain retreat.",
    longDescription:
      "Why rush your mountain getaway? With our 3rd Night Free special, you can extend your stay and truly unwind without breaking the bank. This incredible offer gives you 33% off your total stay, allowing you more time to explore Big Bear's trails, enjoy the lake, and simply relax in your cozy cabin. Whether it's a romantic long weekend or a family adventure, this deal makes it easy to stay longer.",
    dates: "Valid Sunday-Thursday (excluding holidays)",
    location: "All participating Big Bear Cabins",
    features: [
      "Applicable to any cabin in our collection",
      "Valid for midweek stays (Sunday-Thursday)",
      "Can be combined with extended stays",
      "Flexible check-in and check-out times",
      "Access to all cabin amenities for 3 nights",
      "Welcome gift basket included",
      "Late checkout available on 3rd night",
      "Extra time to explore local attractions",
    ],
    inclusions: [
      "3rd night completely free",
      "All standard cabin amenities",
      "Complimentary firewood bundle",
      "Local activities guide and discount coupons",
    ],
    images: [
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1585803114088-cd027272106a?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    ],
  },
  "midweek-discount": {
    id: "midweek-discount",
    title: "25% OFF MIDWEEK",
    subtitle: "Monday - Thursday",
    code: "MIDWEEK25",
    discount: "25% Off",
    icon: Percent,
    heroImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=600&fit=crop",
    description:
      "Escape the crowds and enjoy peaceful mountain serenity. Midweek stays offer the perfect work-from-cabin experience.",
    longDescription:
      "Experience Big Bear at its most peaceful with our exclusive midweek discount. Skip the weekend crowds and enjoy a more serene mountain escape. Perfect for remote workers, digital nomads, or anyone seeking a quiet retreat, our cabins offer high-speed internet, comfortable workspaces, and all the amenities you need. Take advantage of emptier trails, quieter restaurants, and a more authentic mountain experience—all while saving 25%.",
    dates: "Year-round (Monday-Thursday arrivals)",
    location: "Select Big Bear Cabins",
    features: [
      "High-speed WiFi for remote work",
      "Dedicated workspace in cabin",
      "Peaceful environment with fewer tourists",
      "Easy access to hiking trails and nature",
      "Local restaurants less crowded",
      "Better availability and cabin selection",
      "Extended quiet hours",
      "Flexible check-in times",
    ],
    inclusions: [
      "25% off nightly rate Monday-Thursday",
      "Complimentary coffee and tea service",
      "Office supply kit available upon request",
      "Free upgrade to larger cabin (subject to availability)",
    ],
    images: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1663850365903-2f6b8a6a29d3?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1585803114088-cd027272106a?w=400&h=300&fit=crop",
    ],
  },
  "kodiak-ultra": {
    id: "kodiak-ultra",
    title: "KODIAK ULTRA MARATHON",
    subtitle: "September Event",
    code: "KODIAK2025",
    discount: "Runner Special",
    icon: Dumbbell,
    heroImage: "https://images.unsplash.com/photo-1613953294671-977cfceec099?w=1200&h=600&fit=crop",
    description:
      "Push your limits in the mountains! Book your recovery cabin for the ultimate ultra marathon experience. Rest and recharge after conquering the trails.",
    longDescription:
      "Prepare for the ultimate test of endurance with the Kodiak Ultra Marathon, set against Big Bear's stunning mountain backdrop. This challenging course takes runners through pristine alpine terrain, offering breathtaking views and serious elevation challenges. Book your cabin as your pre-race headquarters and post-race recovery sanctuary. We understand what athletes need—comfortable beds, hot tubs for recovery, and kitchens to fuel your performance.",
    dates: "September 13-15, 2025",
    location: "Big Bear Lake Trail System",
    features: [
      "50K, 50-mile, and 100-mile race options",
      "Scenic alpine trail courses",
      "Multiple aid stations throughout course",
      "Professional timing and medals",
      "Post-race celebration and awards",
      "Trained medical staff on course",
      "Spectacular mountain views",
      "Challenging elevation profile for serious runners",
    ],
    inclusions: [
      "Special runner's rate on cabin bookings",
      "Early check-in for pre-race prep",
      "Late checkout for recovery",
      "Complimentary race registration discount",
      "In-cabin recovery kit (foam roller, ice packs)",
      "Healthy meal delivery options available",
    ],
    images: [
      "https://images.unsplash.com/photo-1613953294671-977cfceec099?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1585803114088-cd027272106a?w=400&h=300&fit=crop",
    ],
  },
  "run-revel": {
    id: "run-revel",
    title: "RUN REVEL BIG BEAR",
    subtitle: "11/8",
    code: "REVEL2025",
    discount: "Race Package",
    icon: Waves,
    heroImage: "https://images.unsplash.com/photo-1617428436811-055267a14013?w=1200&h=600&fit=crop",
    description:
      "Run the scenic downhill course through Big Bear! Secure your cabin for race weekend and enjoy the perfect mountain running experience.",
    longDescription:
      "Experience one of California's most scenic and fastest marathon courses with Run Revel Big Bear. This Boston-qualifying downhill marathon takes you through stunning mountain landscapes with over 4,500 feet of elevation loss. It's a runner's dream—breathtaking scenery, excellent organization, and the opportunity to achieve a PR. Book your cabin early for race weekend and make this event truly memorable.",
    dates: "November 8, 2025",
    location: "Big Bear to San Bernardino (point-to-point)",
    features: [
      "Boston-qualifying downhill marathon course",
      "Over 4,500 feet elevation loss",
      "Stunning mountain-to-valley scenery",
      "Half marathon option available",
      "Chip-timed with live tracking",
      "Finisher medals and awards",
      "Post-race party and food",
      "Free race photos for participants",
    ],
    inclusions: [
      "Race weekend cabin package discount",
      "Complimentary shuttle to race start",
      "Pre-race pasta dinner option",
      "Post-race recovery amenities in cabin",
      "$10 race registration discount code",
      "Runner's welcome basket",
    ],
    images: [
      "https://images.unsplash.com/photo-1617428436811-055267a14013?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1613953294671-977cfceec099?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    ],
  },
};

export function SpecialOfferDetailPage() {
  const { offerId } = useParams<{ offerId: string }>();
  const router = useRouter();

  const offer = offerId ? offerDetails[offerId as keyof typeof offerDetails] : null;

  if (!offer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl mb-4">Offer Not Found</h1>
          <Button onClick={() => router.push("/special-offers")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Special Offers
          </Button>
        </div>
      </div>
    );
  }

  const Icon = offer.icon;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden mb-12">
        <img src={offer.heroImage} alt={offer.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 rounded-xl bg-white/90 backdrop-blur-sm">
                <Icon className="h-8 w-8 text-gray-800" />
              </div>
              <Badge className="bg-red-600 text-white px-4 py-2 text-base">{offer.discount}</Badge>
            </div>
            <h1 className="text-5xl md:text-6xl text-white mb-3">{offer.title}</h1>
            <p className="text-2xl text-white/90">{offer.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-3xl mb-6">Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {offer.images.map((image, index) => (
                    <div key={index} className="aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
                      <img
                        src={image}
                        alt={`${offer.title} ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-3xl mb-4">About This Offer</h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-4">{offer.description}</p>
                <p className="text-gray-700 leading-relaxed">{offer.longDescription}</p>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-3xl mb-6">Event Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {offer.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="text-4xl text-gray-900 mb-2">{offer.discount}</div>
                  <p className="text-gray-600">Special Offer</p>
                </div>

                {/* Promo Code */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border-2 border-blue-200 mb-6">
                  <div className="text-center">
                    <span className="text-sm text-gray-600 font-medium block mb-2">Use Promo Code:</span>
                    <code className="text-2xl font-mono font-bold text-gray-900 block mb-3">{offer.code}</code>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(offer.code);
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Copy Code
                    </Button>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-600">Dates</div>
                      <div className="font-medium text-gray-900">{offer.dates}</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-600">Location</div>
                      <div className="font-medium text-gray-900">{offer.location}</div>
                    </div>
                  </div>
                </div>

                {/* Package Includes */}
                <div className="mb-6">
                  <h3 className="text-lg mb-3">Package Includes:</h3>
                  <div className="space-y-2">
                    {offer.inclusions.map((item, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

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
