"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import {
  Copy,
  BookOpen,
  Star,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
type CouponOffer = {
  offerImage: string;
  badgeLabel?: string | null;
  icon?: string | null;
  offerTitle: string;
  offerSubtitle?: string | null;
  offerDescription: string;
  promoCode?: string | null;
  slug?: string | null;
};

type CouponsData = {
  carouselTitle: string;
  offers: CouponOffer[];
  viewAllBtnLabel?: string | null;
  viewAllBtnUrl?: string | null;
};

function OfferCard({ offer }: { offer: CouponOffer }) {
  const router = useRouter();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = useCallback((code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }, []);

  return (
    <div className={`book-page p-3 md:p-6`}>
      <Card className="h-full border-0 shadow-none bg-white">
        {/* Image Section */}
        <div className="relative h-40 overflow-hidden rounded-t-lg bg-gray-200">
          <img
            src={offer.offerImage}
            alt={offer.offerTitle}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop";
            }}
          />
          <div className="absolute inset-0 bg-black/10" />

          {/* Icon overlay on image */}
          {offer.icon && (
            <div className="absolute top-2 left-2">
              <div className="p-1.5 rounded-lg bg-white/90 backdrop-blur-sm shadow-md">
                <img src={offer.icon} alt="" className="h-4 w-4" />
              </div>
            </div>
          )}

          {/* Discount text on image */}
          {offer.badgeLabel && (
            <div className="absolute bottom-2 right-2">
              <div className="bg-black/70 text-white px-2 py-1 rounded text-xs">{offer.badgeLabel}</div>
            </div>
          )}
        </div>

        <CardHeader className="pb-2 px-2 md:px-3">
          <CardTitle className="text-xs md:text-sm mb-1 text-gray-800 leading-tight">
            {offer.offerTitle}
          </CardTitle>
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3 text-gray-500 flex-shrink-0" />
            <CardDescription className="text-xs text-gray-600 truncate">{offer.offerSubtitle}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-0 px-2 md:px-3 pb-3">
          <div className="text-gray-600 text-xs mb-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: offer.offerDescription }} />

          {/* Code display */}
          {offer.promoCode && (
            <div className="bg-gray-50 rounded p-2 mb-3 border border-dashed border-gray-300">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-gray-500 flex-shrink-0">Code:</span>
                <code className="bg-white px-1.5 py-0.5 rounded text-xs font-mono border truncate max-w-full">{offer.promoCode}</code>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2 sm:gap-0">
            {offer.promoCode && (
              <Button
                onClick={() => copyCode(offer.promoCode as string)}
                size="sm"
                variant="outline"
                className={`flex-1 text-xs px-2 md:px-3 py-2 h-8 font-medium border-2 hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md ${copiedCode === offer.promoCode
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white border-green-500 shadow-green-200"
                  : "border-blue-300 text-blue-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white hover:border-blue-500"
                  }`}
              >
                <Copy className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{copiedCode === offer.promoCode ? "Copied!" : "Copy"}</span>
              </Button>
            )}
            <Button
              size="sm"
              className="flex-1 text-xs px-2 md:px-3 py-2 h-8 font-medium bg-black hover:bg-gray-800 text-white border-0 hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md"
              onClick={() => router.push(`/special-offers/${offer.slug}`)}
            >
              <BookOpen className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">Read More</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

type SpecialOffersClientProps = { coupons: CouponsData | null };

export function SpecialOffersClient({ coupons }: SpecialOffersClientProps) {
  const [currentSpread, setCurrentSpread] = useState(0);

  const spreads = [];
  if (coupons && coupons.offers) {
    for (let i = 0; i < coupons.offers.length; i += 2) {
      spreads.push(coupons.offers.slice(i, i + 2));
    }
  }

  const nextSpread = useCallback(() => {
    if (currentSpread < spreads.length - 1) {
      setCurrentSpread((prev) => prev + 1);
    }
  }, [currentSpread, spreads.length]);

  const prevSpread = useCallback(() => {
    if (currentSpread > 0) {
      setCurrentSpread((prev) => prev - 1);
    }
  }, [currentSpread]);

  const goToSpread = useCallback((index: number) => {
    setCurrentSpread(index);
  }, []);

  if (!coupons) return null;

  return (
    <section className="py-8 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full overflow-hidden">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8 px-2">
          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 text-gray-800">
            {coupons.carouselTitle}
          </div>
        </div>

        {/* Book Container */}
        <div className="max-w-8xl mx-auto mb-12 relative px-8 md:px-0">
          {/* Left Navigation Arrow */}
          <Button
            onClick={prevSpread}
            disabled={currentSpread === 0}
            variant="outline"
            size="icon"
            className="absolute left-0 md:-left-16 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-20 md:h-20 rounded-full shadow-lg disabled:opacity-30 disabled:cursor-not-allowed bg-white hover:bg-gray-50 border-2"
          >
            <ChevronLeft className="h-6 w-6 md:h-12 md:w-12 text-black" />
          </Button>

          {/* Right Navigation Arrow */}
          <Button
            onClick={nextSpread}
            disabled={currentSpread === spreads.length - 1}
            variant="outline"
            size="icon"
            className="absolute right-0 md:-right-16 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-20 md:h-20 rounded-full shadow-lg disabled:opacity-30 disabled:cursor-not-allowed bg-white hover:bg-gray-50 border-2"
          >
            <ChevronRight className="h-6 w-6 md:h-12 md:w-12 text-black" />
          </Button>

          <div className="book-container">
            {/* Book Pages */}
            <div className="book-pages">
              <div className="book-spread">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 bg-transparent">
                  {spreads[currentSpread]?.map((offer, index) => (
                    <OfferCard key={index} offer={offer} />
                  ))}
                </div>
              </div>
            </div>

            {/* Page Indicators */}
            <div className="flex justify-center items-center space-x-3 mt-6">
              {spreads.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSpread(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 hover:scale-125 border ${index === currentSpread ? "bg-black border-black" : "bg-white border-black hover:bg-gray-200"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* View More Button */}
        {coupons.viewAllBtnUrl && (
          <div className="text-center">
            <Link href={coupons.viewAllBtnUrl}>
              <Button
                size="lg"
                className="bg-black hover:bg-gray-800 text-white px-10 py-4 rounded-xl font-medium hover:shadow-xl hover:scale-105 transition-all duration-300 border-0"
              >
                <Star className="h-5 w-5 mr-2 animate-pulse" />
                {coupons.viewAllBtnLabel || "View All Offers"}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
