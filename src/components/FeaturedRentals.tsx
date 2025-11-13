import { ChevronRight } from "lucide-react";
import { PropertyCard } from "./PropertyCard";

const featuredProperties = [
  {
    id: 1,
    title: "Luxury Mountain Cabin",
    location: "Big Bear Lake, CA",
    price: 289,
    rating: 4.92,
    reviewCount: 127,
    imageUrl: "https://images.unsplash.com/photo-1736796310552-91125af39105?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtb3VudGFpbiUyMGNhYmluJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU2OTY4OTMxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    isSuperhost: true,
    dates: "Nov 1-6"
  },
  {
    id: 2,
    title: "Cozy Lakefront Retreat",
    location: "Big Bear Lake, CA",
    price: 225,
    rating: 4.89,
    reviewCount: 89,
    imageUrl: "https://images.unsplash.com/photo-1574790413799-c2a5a4ba4d02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwY2FiaW4lMjBiZWRyb29tfGVufDF8fHx8MTc1NzAwMjc1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    isSuperhost: false,
    dates: "Oct 28-Nov 2"
  },
  {
    id: 3,
    title: "Pine Forest Lodge",
    location: "Big Bear, CA",
    price: 195,
    rating: 4.85,
    reviewCount: 156,
    imageUrl: "https://images.unsplash.com/photo-1572830006132-93973be8f3f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxvZGdlJTIwa2l0Y2hlbnxlbnwxfHx8fDE3NTcwMDI3NTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    isSuperhost: true,
    dates: "Nov 5-10"
  },
  {
    id: 4,
    title: "Modern Alpine Escape",
    location: "Big Bear Lake, CA",
    price: 350,
    rating: 4.96,
    reviewCount: 73,
    imageUrl: "https://images.unsplash.com/photo-1727271173705-c9c6fad3acbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydXN0aWMlMjBjYWJpbiUyMGxpdmluZyUyMHJvb218ZW58MXx8fHwxNzU3MDAyNzU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    isSuperhost: true,
    dates: "Nov 3-8"
  }
];

export function FeaturedRentals() {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl text-black">Featured Big Bear Cabin Rentals</h2>
            <ChevronRight className="h-6 w-6 text-black" />
          </div>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
}