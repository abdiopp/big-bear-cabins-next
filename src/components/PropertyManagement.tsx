import { Shield, TrendingUp, Users, Calendar, Star, Award } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

const services = [
  {
    icon: Calendar,
    title: "Booking Management",
    description: "Full-service booking coordination and guest communication"
  },
  {
    icon: Users,
    title: "Guest Services",
    description: "24/7 guest support and concierge services for memorable stays"
  },
  {
    icon: Shield,
    title: "Property Protection",
    description: "Comprehensive insurance and security monitoring for your peace of mind"
  },
  {
    icon: TrendingUp,
    title: "Innovative Marketing",
    description: "Creative marketing strategies to attract more guests and boost bookings"
  }
];

const stats = [
  { number: "500+", label: "Properties Managed" },
  { number: "98%", label: "Owner Satisfaction" },
  { number: "$2.8M+", label: "Revenue Generated" },
  { number: "4.9★", label: "Average Rating" }
];

export function PropertyManagement() {
  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1633234346627-62c3f425b773?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWclMjBiZWFyJTIwZm9yZXN0JTIwbW91bnRhaW5zfGVufDF8fHx8MTc1NzAwMjc1Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Big Bear Forest Mountains"
          className="w-full h-full object-cover"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Award className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium text-primary">PROFESSIONAL PROPERTY MANAGEMENT</span>
              </div>
              
              <h2 className="text-4xl text-white leading-tight">
                Maximize Your Rental Income with Expert Management
              </h2>
              
              <p className="text-lg text-white/80">
                Let our experienced team handle every aspect of your Big Bear rental property. 
                From guest relations to maintenance, we ensure your investment thrives while you relax.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl text-white mb-1">{stat.number}</div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Button size="lg" className="flex-1 sm:flex-none">
                Get Started Today
              </Button>
              <Button variant="outline" size="lg" className="flex-1 sm:flex-none">
                Free Property Evaluation
              </Button>
            </div>
          </div>

          {/* Right Content - Services Grid */}
          <div className="space-y-6">
            <div className="grid gap-4">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <Card key={index} className="p-6 hover:shadow-md transition-shadow duration-200 bg-white/95 backdrop-blur-sm">
                    <CardContent className="p-0">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg text-black mb-2">{service.title}</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Trust Indicators */}
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 border border-border">
              <div className="flex items-center justify-center">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">Trusted by 500+ owners</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}