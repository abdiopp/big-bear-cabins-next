import { ChevronRight } from "lucide-react";
import { PropertyCard } from "./PropertyCard";

const longTermProperties = [
  {
    id: 1,
    title: "Executive Mountain Home",
    location: "Big Bear Lake, CA",
    price: 4200,
    rating: 4.94,
    reviewCount: 45,
    imageUrl: "https://images.unsplash.com/photo-1650211803854-e7b2e0ce86f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleGVjdXRpdmUlMjBtb3VudGFpbiUyMGhvbWUlMjBleHRlcmlvcnxlbnwxfHx8fDE3NTcwMDI4MDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    isSuperhost: true,
    dates: "Monthly",
    priceLabel: "month"
  },
  {
    id: 2,
    title: "Forest View Cottage",
    location: "Big Bear, CA",
    price: 2800,
    rating: 4.88,
    reviewCount: 32,
    imageUrl: "https://images.unsplash.com/photo-1619563228104-5197b5fe7192?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjBjb3R0YWdlJTIwY2FiaW58ZW58MXx8fHwxNzU3MDAyODAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    isSuperhost: false,
    dates: "Monthly",
    priceLabel: "month"
  },
  {
    id: 3,
    title: "Lakeside Family Home",
    location: "Big Bear Lake, CA",
    price: 5500,
    rating: 4.91,
    reviewCount: 28,
    imageUrl: "https://images.unsplash.com/photo-1708659790808-8cd34b52ec78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWtlc2lkZSUyMGZhbWlseSUyMGhvbWV8ZW58MXx8fHwxNzU3MDAyODAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    isSuperhost: true,
    dates: "Monthly",
    priceLabel: "month"
  },
  {
    id: 4,
    title: "Ski Lodge Residence",
    location: "Big Bear Lake, CA",
    price: 3200,
    rating: 4.86,
    reviewCount: 19,
    imageUrl: "https://images.unsplash.com/photo-1577130215747-c1a51019ca95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2klMjBsb2RnZSUyMHJlc2lkZW5jZXxlbnwxfHx8fDE3NTcwMDI4MDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    isSuperhost: false,
    dates: "Monthly",
    priceLabel: "month"
  }
];

export function LongTermRentals() {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl text-black">Long Term Rentals</h2>
            <ChevronRight className="h-6 w-6 text-black" />
          </div>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {longTermProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
}