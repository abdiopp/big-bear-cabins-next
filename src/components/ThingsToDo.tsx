import { ChevronRight, MapPin } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

const activities = [
  {
    id: 1,
    title: "Snow Summit Ski Resort",
    description: "World-class skiing and snowboarding with breathtaking mountain views",
    category: "Winter Sports",
    distance: "2.5 miles",
    imageUrl: "https://images.unsplash.com/photo-1664809622507-c0f5aa28a0b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbm93JTIwdHViaW5nJTIwd2ludGVyJTIwZnVufGVufDF8fHx8MTc1NzAwNjU2M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.6
  },
  {
    id: 2,
    title: "Big Bear Lake",
    description: "Pristine mountain lake perfect for boating, fishing, and water sports",
    category: "Water Activities",
    distance: "1.2 miles",
    imageUrl: "https://images.unsplash.com/photo-1664214241569-cddd03a0fa63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWclMjBiZWFyJTIwbGFrZSUyMGJvYXRpbmd8ZW58MXx8fHwxNzU3MDA2NTU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.8
  },
  {
    id: 3,
    title: "Castle Rock Trail",
    description: "Scenic hiking trail offering panoramic views of the San Bernardino Mountains",
    category: "Hiking",
    distance: "3.1 miles",
    imageUrl: "https://images.unsplash.com/photo-1602382952682-1200ab74ebec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWtpbmclMjBzY2VuaWMlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzU3MDA2NTYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.7
  },
  {
    id: 4,
    title: "Big Bear Village",
    description: "Charming mountain town with shops, restaurants, and local artisan crafts",
    category: "Shopping & Dining",
    distance: "0.8 miles",
    imageUrl: "https://images.unsplash.com/photo-1492778297155-7be4c83960c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHZpbGxhZ2UlMjBzaG9wc3xlbnwxfHx8fDE3NTY3OTc2Njh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.5
  },
  {
    id: 5,
    title: "Alpine Slide at Magic Mountain",
    description: "Thrilling mountain slide adventure fun for the whole family",
    category: "Adventure",
    distance: "4.2 miles",
    imageUrl: "https://images.unsplash.com/photo-1568534571115-c6d71dd46ab8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbHBpbmUlMjBzbGlkZSUyMHN1bW1lcnxlbnwxfHx8fDE3NTcwMDY1NTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.4
  },
  {
    id: 6,
    title: "Big Bear Observatory",
    description: "Stargazing and astronomy experiences under pristine mountain skies",
    category: "Educational",
    distance: "5.1 miles",
    imageUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvYnNlcnZhdG9yeSUyMHN0YXJzfGVufDF8fHx8MTc1Njc5NzY2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.9
  }
];

export function ThingsToDo() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl text-black mb-4">Things To Do In Big Bear</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover amazing activities and attractions just minutes from your cabin
          </p>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {activities.map((activity) => (
            <Card key={activity.id} className="group cursor-pointer hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={activity.imageUrl}
                  alt={activity.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="bg-white/90 text-black">
                    {activity.category}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-medium text-black line-clamp-1">{activity.title}</h3>
                  <div className="flex items-center space-x-1 text-sm">
                    <span>⭐</span>
                    <span>{activity.rating}</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {activity.description}
                </p>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{activity.distance} away</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <button className="inline-flex items-center space-x-2 text-black hover:text-primary transition-colors">
            <span>View all activities</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}