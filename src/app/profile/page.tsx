"use client"
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Star, User, Calendar, Heart, Sparkles } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { PropertyCard } from '@/components/PropertyCard';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('about-me');
  const { wishlist, wishlistItems } = useWishlist();
  const [wishlistProperties, setWishlistProperties] = useState<any[]>([]);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);

  useEffect(() => {
    async function fetchWishlistProperties() {
      if (activeTab === 'cabins-wishlist' && wishlist.length > 0) {
        setIsLoadingWishlist(true);
        try {
          const res = await fetch('/api/properties/batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: wishlist })
          });
          const json = await res.json();
          if (json.data && json.data.property) {
            setWishlistProperties(json.data.property);
          }
        } catch (error) {
          console.error("Failed to fetch wishlist properties", error);
        } finally {
          setIsLoadingWishlist(false);
        }
      } else if (wishlist.length === 0) {
        setWishlistProperties([]);
      }
    }
    fetchWishlistProperties();
  }, [activeTab, wishlist]);

  // Show loading state while session is being checked
  // Middleware handles redirect for unauthenticated users
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // If no session after loading, show nothing (middleware should have redirected)
  // This is a safety check in case middleware didn't catch it
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Please log in to view your profile.</div>
      </div>
    );
  }

  // Mock user data - in production, this would come from the database
  const userData = {
    name: session.user.name || "User",
    location: "Los Angeles, California",
    profilePicture: "https://images.unsplash.com/photo-1570170609489-43197f518df0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NjE2NDkyODd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    bookings: 3,
    reviews: 2,
    yearsOnPlatform: 4,
    bio: "Mountain Enthusiast / Adventure Seeker",
    identityVerified: true
  };

  const pastReviews = [
    {
      id: 1,
      cabinName: "Cozy Mountain Cabin",
      cabinImage: "https://images.unsplash.com/photo-1627257363565-4bc682c69e8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYWJpbiUyMGV4dGVyaW9yfGVufDF8fHx8MTc2MTY3MTE3N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: 5,
      date: "November 2024"
    },
    {
      id: 2,
      cabinName: "Lakefront Retreat",
      cabinImage: "https://images.unsplash.com/photo-1628417232293-a0b4561b14e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGNhYmluJTIwd29vZHxlbnwxfHx8fDE3NjE2NzExNzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: 5,
      date: "August 2024"
    }
  ];

  const pastBookings = [
    {
      id: 1,
      cabinName: "Pine Valley Cabin",
      cabinImage: "https://images.unsplash.com/photo-1621771674545-849014cf91fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwY2FiaW4lMjBmb3Jlc3R8ZW58MXx8fHwxNzYxNjMwNjYyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      checkIn: "Dec 1, 2024",
      checkOut: "Dec 5, 2024",
      guests: 4,
      price: "$850"
    },
    {
      id: 2,
      cabinName: "Winter Wonderland Cabin",
      cabinImage: "https://images.unsplash.com/photo-1648841931372-676febc626aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW50ZXIlMjBjYWJpbiUyMHNub3d8ZW58MXx8fHwxNzYxNjcyMDcwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      checkIn: "Sep 15, 2024",
      checkOut: "Sep 20, 2024",
      guests: 2,
      price: "$950"
    },
    {
      id: 3,
      cabinName: "Lakeside Escape",
      cabinImage: "https://images.unsplash.com/photo-1592448981188-8bf53a3d7810?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWtlJTIwY2FiaW4lMjByZXRyZWF0fGVufDF8fHx8MTc2MTY3MjA3MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      checkIn: "Jun 10, 2024",
      checkOut: "Jun 17, 2024",
      guests: 6,
      price: "$1,450"
    }
  ];

  // The static wishlist data has been replaced by the dynamic 'wishlistProperties' state

  const favouriteActivities = [
    {
      id: 1,
      name: "Skiing & Snowboarding",
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2lpbmd8ZW58MXx8fHwxNzYxNjcyMDcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Hit the slopes at Snow Summit and Bear Mountain"
    },
    {
      id: 2,
      name: "Hiking Trails",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWtpbmd8ZW58MXx8fHwxNzYxNjcyMDcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Explore scenic mountain trails with stunning views"
    },
    {
      id: 3,
      name: "Lake Activities",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWtlJTIwa2F5YWt8ZW58MXx8fHwxNzYxNjcyMDcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Kayaking, paddleboarding, and fishing on Big Bear Lake"
    },
    {
      id: 4,
      name: "Mountain Biking",
      image: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGJpa2luZ3xlbnwxfHx8fDE3NjE2NzIwNzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Ride through forest trails and mountain paths"
    }
  ];

  const menuItems = [
    { id: 'about-me', label: 'About me', Icon: User },
    { id: 'past-bookings', label: 'Past bookings', Icon: Calendar },
    { id: 'cabins-wishlist', label: 'Cabins Wishlist', Icon: Heart },
    { id: 'favourite-activities', label: 'Favourite Activities', Icon: Sparkles }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* Left Sidebar - Profile (8/24 = 1/3) */}
          <div className="w-full lg:w-1/3 lg:max-w-[33.333%]">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">Profile</h2>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const IconComponent = item.Icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      <IconComponent className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Right Content - About Me (16/24 = 2/3) */}
          <div className="w-full lg:w-2/3 lg:flex-1">
            {activeTab === 'about-me' && (
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-semibold text-gray-900">About me</h2>
                  <Button variant="outline" className="rounded-lg px-6">
                    Edit
                  </Button>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-lg shadow-sm p-8">
                  <div className="flex flex-col items-center text-center">
                    {/* Profile Picture */}
                    <div className="relative mb-4">
                      <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                        <ImageWithFallback
                          src={userData.profilePicture}
                          alt={userData.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Verified Badge */}
                      <div className="absolute bottom-0 right-0 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center border-2 border-white">
                        <ShieldCheck className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    {/* User Info */}
                    <h3 className="text-2xl font-semibold text-gray-900 mb-1">
                      {userData.name}
                    </h3>
                    <p className="text-gray-600 mb-6">{userData.location}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 w-full max-w-md">
                      <div className="text-center">
                        <div className="text-2xl font-semibold text-gray-900">
                          {userData.bookings}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Bookings</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-semibold text-gray-900">
                          {userData.reviews}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Reviews</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-semibold text-gray-900">
                          {userData.yearsOnPlatform}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Years on Big Bear Cabins</div>
                      </div>
                    </div>
                  </div>

                  {/* Identity Verified */}
                  {userData.identityVerified && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="w-5 h-5 text-gray-900" />
                        <span className="font-medium text-gray-900 underline cursor-pointer">
                          Identity verified
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Bio */}
                  {userData.bio && (
                    <div className="mt-6">
                      <p className="text-gray-900">{userData.bio}</p>
                    </div>
                  )}
                </div>

                {/* My Reviews Section */}
                <div className="bg-white rounded-lg shadow-sm p-8 mt-6">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">My reviews</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {pastReviews.map((review) => (
                      <div
                        key={review.id}
                        className="flex items-start space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        {/* Cabin Image */}
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                            <ImageWithFallback
                              src={review.cabinImage}
                              alt={review.cabinName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        {/* Review Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-1 mb-1">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-3 h-3 fill-current text-gray-900"
                              />
                            ))}
                          </div>
                          <p className="font-medium text-gray-900">{review.cabinName}</p>
                          <p className="text-sm text-gray-600">{review.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'past-bookings' && (
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-semibold text-gray-900">Past bookings</h2>
                </div>

                {/* Bookings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pastBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="aspect-[4/3] overflow-hidden">
                        <ImageWithFallback
                          src={booking.cabinImage}
                          alt={booking.cabinName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-3">{booking.cabinName}</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center justify-between">
                            <span>Check-in:</span>
                            <span className="font-medium text-gray-900">{booking.checkIn}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Check-out:</span>
                            <span className="font-medium text-gray-900">{booking.checkOut}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Guests:</span>
                            <span className="font-medium text-gray-900">{booking.guests}</span>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                            <span>Total:</span>
                            <span className="font-semibold text-gray-900">{booking.price}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'cabins-wishlist' && (
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-semibold text-gray-900">Cabins Wishlist</h2>
                </div>

                {/* Wishlist Grid */}
                {isLoadingWishlist ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="text-gray-500">Loading your wishlist...</div>
                  </div>
                ) : wishlistProperties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistProperties.map((cabin) => (
                      <PropertyCard
                        key={cabin.unit_id || cabin.id}
                        property={{
                          id: cabin.unit_id || cabin.id,
                          imageUrl: wishlistItems?.find(i => i.propertyId === String(cabin.unit_id || cabin.id))?.imageUrl || cabin.default_image || cabin.images?.[0] || "",
                          images: cabin.images || (cabin.default_image ? [cabin.default_image] : []),
                          title: cabin.name || cabin.unit_name || "Unknown Property",
                          location: cabin.location_area_name || cabin.location_name || "Big Bear Lake, CA",
                          rating: cabin.rating || 5.0,
                          reviewCount: cabin.reviews_count || 0,
                          price: cabin.price_daily_low || 0,
                          dates: "Available",
                          isFavorite: true,
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg p-12 text-center shadow-sm">
                    <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-500 mb-6">Start exploring and save your favorite cabins for later.</p>
                    <Button onClick={() => window.location.href = '/cabins'}>
                      Explore Cabins
                    </Button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'favourite-activities' && (
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-semibold text-gray-900">Favourite Activities</h2>
                </div>

                {/* Activities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {favouriteActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer group relative"
                    >
                      {/* Heart Icon */}
                      <button className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                        <Heart className="w-5 h-5 fill-pink-500 text-pink-500" />
                      </button>

                      <div className="aspect-[16/9] overflow-hidden">
                        <ImageWithFallback
                          src={activity.image}
                          alt={activity.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="font-semibold text-gray-900 mb-2">{activity.name}</h3>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
