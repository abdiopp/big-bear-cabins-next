"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";;
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Copy, BookOpen, Calendar, Gift, Percent, Mountain, Waves, Dumbbell, Beer, Star, Tag } from "lucide-react";

const specialOffers = [
  {
    id: 1,
    slug: "oktoberfest",
    title: "BIG BEAR OKTOBERFEST",
    subtitle: "Traditional Celebration",
    description: "Prost! Experience authentic German festivities with live music, traditional foods, and craft brews. Your cozy cabin awaits!",
    code: "OKTOBERFEST",
    discount: "15% Off",
    icon: Beer,
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    slug: "yoga-festival",
    title: "YOGA FESTIVAL",
    subtitle: "10/4",
    description: "Find your zen in the mountains. Restore your mind, body, and soul with guided sessions surrounded by nature's beauty.",
    code: "YOGABLISS",
    discount: "Wellness Package",
    icon: Mountain,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    slug: "third-night-free",
    title: "3RD NIGHT FREE!",
    subtitle: "Extended Stay Special",
    description: "Stay 2 nights, get the 3rd absolutely FREE! Perfect for long weekends and extra relaxation time in your mountain retreat.",
    code: "STAY3FREE",
    discount: "33% Savings",
    icon: Gift,
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop"
  },
  {
    id: 4,
    slug: "midweek-discount",
    title: "25% OFF MIDWEEK",
    subtitle: "Monday - Thursday",
    description: "Escape the crowds and enjoy peaceful mountain serenity. Midweek stays offer the perfect work-from-cabin experience.",
    code: "MIDWEEK25",
    discount: "25% Off",
    icon: Percent,
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop"
  },
  {
    id: 5,
    slug: "kodiak-ultra",
    title: "KODIAK ULTRA MARATHON",
    subtitle: "September Event",
    description: "Push your limits in the mountains! Book your recovery cabin for the ultimate ultra marathon experience. Rest and recharge after conquering the trails.",
    code: "KODIAK2025",
    discount: "Runner Special",
    icon: Dumbbell,
    image: "https://images.unsplash.com/photo-1613953294671-977cfceec099?w=400&h=300&fit=crop"
  },
  {
    id: 6,
    slug: "run-revel",
    title: "RUN REVEL BIG BEAR",
    subtitle: "11/8",
    description: "Run the scenic downhill course through Big Bear! Secure your cabin for race weekend and enjoy the perfect mountain running experience.",
    code: "REVEL2025",
    discount: "Race Package",
    icon: Waves,
    image: "https://images.unsplash.com/photo-1617428436811-055267a14013?w=400&h=300&fit=crop"
  }
];

function OfferCard({ offer }: { offer: typeof specialOffers[0] }) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const router = useRouter();
  const Icon = offer.icon;

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden bg-gray-200">
        <img
          src={offer.image}
          alt={offer.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Icon overlay on image */}
        <div className="absolute top-4 left-4">
          <div className="p-2 rounded-lg bg-white/90 backdrop-blur-sm shadow-md">
            <Icon className="h-5 w-5 text-gray-700" />
          </div>
        </div>

        {/* Discount badge */}
        <div className="absolute bottom-4 right-4">
          <div className="bg-red-600 text-white px-3 py-1.5 rounded-lg font-medium shadow-lg flex items-center space-x-1">
            <Tag className="h-4 w-4" />
            <span className="text-sm">{offer.discount}</span>
          </div>
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg mb-2 text-gray-800 leading-tight">
          {offer.title}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <CardDescription className="text-sm text-gray-600">
            {offer.subtitle}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        <p className="text-gray-600 text-sm leading-relaxed">
          {offer.description}
        </p>

        {/* Code display */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-600 font-medium">Promo Code:</span>
              <code className="block mt-1 text-lg font-mono font-bold text-gray-900">
                {offer.code}
              </code>
            </div>
            <Button
              onClick={() => copyCode(offer.code)}
              size="sm"
              variant="outline"
              className={`font-medium transition-all duration-300 ${copiedCode === offer.code
                  ? 'bg-green-500 text-white border-green-500 hover:bg-green-600'
                  : 'border-blue-400 text-blue-700 hover:bg-blue-500 hover:text-white hover:border-blue-500'
                }`}
            >
              <Copy className="h-4 w-4 mr-1" />
              {copiedCode === offer.code ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* Action button */}
        <Button
          onClick={() => router.push(`/special-offers/${offer.slug}`)}
          className="w-full bg-black hover:bg-gray-800 text-white font-medium hover:scale-105 transition-all duration-300"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Read More
        </Button>
      </CardContent>
    </Card>
  );
}

export function SpecialOffersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Split Screen Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px] lg:min-h-[600px]">
          {/* Left Side - Image */}
          <div className="relative order-2 lg:order-1 h-[300px] lg:h-auto">
            <img
              src="https://images.unsplash.com/photo-1670177792931-5eb0193c4eea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGNhYmluJTIwd2ludGVyJTIwc25vd3xlbnwxfHx8fDE3NTk0Mjk1NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Big Bear Cabins"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent lg:hidden" />

            {/* Decorative floating badges on image */}
            <div className="absolute top-8 left-8 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg animate-fade-in">
              <div className="flex items-center space-x-2">
                <Tag className="h-5 w-5 text-red-600" />
                <span className="font-medium">6 Active Offers</span>
              </div>
            </div>

            <div className="absolute bottom-8 right-8 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg animate-fade-in-delayed">
              <div className="flex items-center space-x-2">
                <Gift className="h-5 w-5 text-green-600" />
                <span className="font-medium">Save Up to 33%</span>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="relative order-1 lg:order-2 bg-white flex items-center justify-center px-6 sm:px-12 py-16 lg:py-20">
            <div className="max-w-xl w-full scroll-fade-in animate">
              {/* Star decoration */}
              <div className="flex items-center mb-6">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                </div>
                <div className="ml-4 h-px flex-1 bg-gradient-to-r from-yellow-500/50 to-transparent" />
              </div>

              {/* Main heading */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl text-black mb-6">
                Special Offers
              </h1>

              {/* Subheading */}
              <p className="text-xl sm:text-2xl text-gray-700 mb-8 leading-relaxed">
                Exclusive deals and packages for your Big Bear cabin getaway
              </p>

              {/* Feature list */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3 text-gray-800">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-4 w-4 text-gray-800" />
                  </div>
                  <span>Limited-time seasonal promotions</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-800">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Percent className="h-4 w-4 text-gray-800" />
                  </div>
                  <span>Discounts on midweek and extended stays</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-800">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Gift className="h-4 w-4 text-gray-800" />
                  </div>
                  <span>Special event packages and experiences</span>
                </div>
              </div>

              {/* CTA */}
              <div className="flex items-center space-x-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-300" />
                <span className="text-gray-500 text-sm uppercase tracking-wider">Scroll to explore</span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offers Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {specialOffers.map((offer) => (
              <div key={offer.id}>
                <OfferCard offer={offer} key={offer.id} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-4xl mx-auto overflow-hidden">
            <div className="bg-gradient-to-r from-black to-gray-800 p-8 md:p-12 text-white text-center">
              <h2 className="text-3xl md:text-4xl mb-4">
                Need Help Choosing?
              </h2>
              <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
                Our team is here to help you find the perfect cabin and the best deals for your Big Bear adventure.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="outline" className="bg-white text-black hover:bg-gray-100 border-white">
                  Contact Us
                </Button>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white border-0">
                  Browse All Cabins
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
