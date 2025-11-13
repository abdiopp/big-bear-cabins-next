import { ImageWithFallback } from './figma/ImageWithFallback';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-96 bg-gray-900">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop"
          alt="Big Bear Mountain View"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl mb-4">About Big Bear Cabins</h1>
            <p className="text-xl max-w-2xl mx-auto px-6">
              Your gateway to unforgettable mountain experiences in Big Bear Lake, California
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Founded in 2015, Big Bear Cabins was born from a passion for the mountains and a desire to share the magic of Big Bear Lake with visitors from around the world. What started as a small family business with just three cabins has grown into the area's premier vacation rental service.
            </p>
            <p className="text-gray-600 mb-4">
              We believe that every stay should be more than just accommodation – it should be an experience that creates lasting memories. That's why we've carefully curated a collection of unique properties, each offering its own character and charm.
            </p>
            <p className="text-gray-600">
              From cozy lakefront cottages to luxurious mountain lodges, our properties are selected and maintained to provide the perfect backdrop for your Big Bear adventure.
            </p>
          </div>
          <div>
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop"
              alt="Big Bear Cabin Interior"
              className="w-full h-80 object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">🏠</span>
            </div>
            <h3 className="mb-3">Quality Properties</h3>
            <p className="text-gray-600">
              Every cabin is personally inspected and meets our high standards for cleanliness, comfort, and amenities.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">🎿</span>
            </div>
            <h3 className="mb-3">Local Expertise</h3>
            <p className="text-gray-600">
              Our team knows Big Bear inside and out. We're here to help you make the most of your mountain getaway.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">💎</span>
            </div>
            <h3 className="mb-3">24/7 Support</h3>
            <p className="text-gray-600">
              From booking to checkout, our dedicated support team is available around the clock for your peace of mind.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="mb-4">Ready to Experience Big Bear?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Whether you're planning a romantic retreat, family vacation, or adventure with friends, 
            we have the perfect cabin waiting for you in Big Bear.
          </p>
          <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg transition-colors">
            Browse Our Cabins
          </button>
        </div>
      </div>
    </div>
  );
}