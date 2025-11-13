"use client"
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { Heart } from 'lucide-react';
import { useState } from 'react';

export default function ActivitiesPage() {
  const [savedActivities, setSavedActivities] = useState<Set<number>>(new Set());

  const activities = [
    {
      title: "Romantic Big Bear Hot Spots",
      image: "https://images.unsplash.com/photo-1682459337036-e7bbc3986d53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGNvdXBsZSUyMG1vdW50YWlufGVufDF8fHx8MTc2MTU4MDYyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "Guide To Big Bear Things To Do In Winter",
      image: "https://images.unsplash.com/photo-1706668698344-c054449bab18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW50ZXIlMjBzbm93JTIwc2tpaW5nfGVufDF8fHx8MTc2MTU4MDYyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "Big Bear Things To Do In Summer",
      image: "https://images.unsplash.com/photo-1652553426325-0e83de1fbc6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW1tZXIlMjBsYWtlJTIwYWN0aXZpdGllc3xlbnwxfHx8fDE3NjE1ODA2Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "Spring Guide to Big Bear Outdoor Activities",
      image: "https://images.unsplash.com/photo-1683726391651-1f48ab244780?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcHJpbmclMjBmbG93ZXJzJTIwaGlraW5nfGVufDF8fHx8MTc2MTU4MDYyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "Fall Guide to Big Bear Mountain Activities",
      image: "https://images.unsplash.com/photo-1665323576083-33df498c8ccd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWxsJTIwYXV0dW1uJTIwbW91bnRhaW5zfGVufDF8fHx8MTc2MTU4MDYyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "Yarn Designers Boutique",
      image: "https://images.unsplash.com/photo-1694099614674-48c3bd799c8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5YXJuJTIwY3JhZnQlMjBib3V0aXF1ZXxlbnwxfHx8fDE3NjE1ODA2MzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "Scavenger Hunt: Riddle Routes",
      image: "https://images.unsplash.com/photo-1645563113686-d05ddb732d9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVhc3VyZSUyMGh1bnQlMjBhZHZlbnR1cmV8ZW58MXx8fHwxNzYxNTc5Mzg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "Big Bear Watersports School",
      image: "https://images.unsplash.com/photo-1569718290260-430344d11b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMHNwb3J0cyUyMGxha2V8ZW58MXx8fHwxNzYxNTgwNjMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "Stand-Up Paddleboarding in Big Bear",
      image: "https://images.unsplash.com/photo-1704402386517-1ad5d22382a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWRkbGVib2FyZGluZyUyMHN1bnNldHxlbnwxfHx8fDE3NjE1ODA2MzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "Action Tours Big Bear",
      image: "https://images.unsplash.com/photo-1577993964091-5b0062ea4876?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx6aXBsaW5lJTIwYWR2ZW50dXJlJTIwdG91cnxlbnwxfHx8fDE3NjE1ODA2MzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "Big Bear Things to Do: Geocaching",
      image: "https://images.unsplash.com/photo-1593115590389-076721aa1607?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZW9jYWNoaW5nJTIwb3V0ZG9vcnxlbnwxfHx8fDE3NjE1ODA2MzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "Big Bear Fall Activities",
      image: "https://images.unsplash.com/photo-1727189966012-54e6973f82a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWxsJTIwaGlraW5nJTIwYWN0aXZpdGllc3xlbnwxfHx8fDE3NjE1ODA2MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  ];

  const toggleSave = (index: number) => {
    setSavedActivities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1625456824758-eb1a77735fc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwYWN0aXZpdGllcyUyMGhpa2luZ3xlbnwxfHx8fDE3NjE1NDMzNTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Big Bear Activities"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-6xl font-bold text-center px-4">
            Activities in Big Bear
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction Paragraph */}
        <div className="mb-12">
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            There&apos;s plenty to do here in Big Bear, year-round. Here are just a few Big Bear things to do as you plan your Big Bear vacation. Bike or hike along the Alpine Pedal Path, the Pacific Crest Trail, or one of the many area trails, keeping an eye out for area wildlife as you go. Head to Bluff Lake, Cedar Lake, or stay at Big Bear Lake for kayaking, fishing, boating, kayaking, water skiing, parasailing, and more water fun. And of course, there&apos;s plenty of skiing, snowboarding, and snowshoeing too. Not to mention, rock climbing, laser tag, and zip lines. Tour Big Bear Lake by kayak, paddlewheel, or helicopter. Try your hand at geocaching and scavenger hunts, or explore abandoned mines, break a few geodes and pan for gemstones and fossils.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Big Bear Cabins – With over 300 Big Bear cabins and Big Bear rentals, including eleven individual, fully equipped Big Bear lakefront cabins at Shore Acres Lodge Big Bear Cabins is your one stop for Big Bear Lake cabin rental.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            High in the San Bernardino Mountains, California&apos;s best kept secret awaits. Centrally located to Southern California, Big Bear Lake, your four season Paradise is only a couple hours away. Big Bear offers families the prime opportunity to take advantage of all that our beautiful mountains have to offer.
          </p>
        </div>

        {/* Activity Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {activities.map((activity, index) => (
            <div 
              key={index} 
              className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Heart Icon */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSave(index);
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
                  aria-label={savedActivities.has(index) ? "Remove from saved" : "Save for later"}
                >
                  <Heart 
                    className={`h-5 w-5 transition-colors ${
                      savedActivities.has(index) 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-gray-700 hover:text-red-500'
                    }`}
                  />
                </button>
              </div>
              <div className="p-4">
                <h3 className="text-gray-900 group-hover:text-primary transition-colors">
                  {activity.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Plan Your Adventure Section */}
        <div className="mt-16 p-6 bg-blue-50 rounded-lg border border-blue-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Plan Your Adventure
          </h2>
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>Seasonal Considerations:</strong> Some activities are seasonal. Check availability and weather conditions before planning your activities.
            </p>
            <p>
              <strong>Equipment Rentals:</strong> Most activities offer equipment rentals on-site or at nearby locations in the village.
            </p>
            <p>
              <strong>Reservations:</strong> During peak seasons (summer and winter holidays), we recommend booking activities in advance.
            </p>
            <p>
              <strong>Passes & Permits:</strong> Some trails and areas require Adventure Passes. These can be purchased at local retailers and visitor centers.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Need help planning your activities? Contact our concierge team for personalized recommendations and booking assistance.
          </p>
        </div>
      </div>
    </div>
  );
}


