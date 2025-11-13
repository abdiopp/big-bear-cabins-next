import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface AreaCard {
  title: string;
  description: string;
  imageUrl: string;
  properties: number;
}

const areas: AreaCard[] = [
  {
    title: "Bear Mountain Rentals",
    description: "Ski-in, ski-out luxury cabins with breathtaking mountain views and easy access to Bear Mountain Resort.",
    imageUrl: "https://images.unsplash.com/photo-1633234345527-53438c1fa293?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWclMjBiZWFyJTIwbW91bnRhaW4lMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzU4NTY4MTY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    properties: 45
  },
  {
    title: "East Area Rentals",
    description: "Peaceful retreats with stunning lake views and hiking trails, perfect for nature lovers and families.",
    imageUrl: "https://images.unsplash.com/photo-1666008490793-338bc347ca2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWtlJTIwbW91bnRhaW4lMjBmb3Jlc3R8ZW58MXx8fHwxNzU4NTY4MTcwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    properties: 32
  },
  {
    title: "North Shore Rentals",
    description: "Lakefront properties with private docks and beaches, ideal for water activities and relaxation.",
    imageUrl: "https://images.unsplash.com/photo-1519552928909-67ca7aef9265?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHZpbGxhZ2UlMjBzbm93fGVufDF8fHx8MTc1ODU2ODE2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    properties: 28
  },
  {
    title: "Snow Summit Rentals",
    description: "Premium ski lodge accommodations with easy access to Snow Summit and world-class winter sports.",
    imageUrl: "https://images.unsplash.com/photo-1610479201125-a5c7f17370a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2klMjByZXNvcnQlMjBtb3VudGFpbnxlbnwxfHx8fDE3NTg1NjgxNzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    properties: 38
  },
  {
    title: "Village Area Rentals",
    description: "Charming cabins in the heart of Big Bear Village with walking access to shops, restaurants, and entertainment.",
    imageUrl: "https://images.unsplash.com/photo-1673864533532-748258d2acb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbHBpbmUlMjB2aWxsYWdlJTIwaG91c2VzfGVufDF8fHx8MTc1ODU2ODE3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    properties: 52
  },
  {
    title: "West Area Rentals",
    description: "Secluded forest retreats offering privacy and tranquility, surrounded by towering pine trees.",
    imageUrl: "https://images.unsplash.com/photo-1679155779025-852535ed4aa3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGZvcmVzdCUyMGNhYmlufGVufDF8fHx8MTc1ODU2ODE3NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    properties: 41
  }
];

export function OtherAreasPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Explore Big Bear Areas
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the perfect location for your Big Bear getaway. Each area offers unique 
              experiences and stunning natural beauty.
            </p>
          </div>
        </div>
      </div>

      {/* Areas Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {areas.map((area, index) => (
            <Card 
              key={index} 
              className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative h-64 overflow-hidden">
                <ImageWithFallback
                  src={area.imageUrl}
                  alt={area.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {area.title}
                  </h3>
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 inline-block">
                    <span className="text-sm font-medium text-gray-900">
                      {area.properties} Properties
                    </span>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-gray-600 leading-relaxed">
                  {area.description}
                </p>
                <button className="mt-4 w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
                  View Properties
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="bg-white border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Choose Different Areas?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏔️</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Ski Access</h3>
                <p className="text-gray-600">Choose areas close to Bear Mountain or Snow Summit for easy ski access.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏞️</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Lake Activities</h3>
                <p className="text-gray-600">North Shore and East areas offer the best lake access and water activities.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏘️</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Village Life</h3>
                <p className="text-gray-600">Stay in the Village area for walking access to dining and entertainment.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}