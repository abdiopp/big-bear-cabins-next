"use client"
import { MapPin, Navigation, Phone, AlertTriangle, Mountain } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";

export default function DirectionsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image Section */}
      <div className="w-full h-[60vh] relative overflow-hidden">
        <ImageWithFallback 
          src="/assets/a8cae9b96bdbe4d2cffd1bf2028bf1b4ff05b40d.png" 
          alt="Big Bear Lake Area Map" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end">
          <div className="max-w-7xl mx-auto px-6 pb-12 w-full">
            <h1 className="text-white text-5xl mb-2">Directions to Big Bear Lake</h1>
            <p className="text-white/90">Find your way to our amazing Big Bear Vacation Home Rentals</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        
        {/* Important Notice */}
        <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-lg mb-12 flex gap-4">
          <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-amber-900 mb-2">Before You Go</h3>
            <p className="text-amber-800">
              We advise you to select a route in advance and check the current weather and road conditions before departing. 
              Please remember to <strong>always carry chains in your vehicle</strong> when traveling to Big Bear Lake and the 
              mountain region during the winter season.
            </p>
          </div>
        </div>

        {/* Routes Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Navigation className="w-7 h-7 text-[#477023]" />
            <h2 className="text-3xl">Three Routes to Big Bear Lake</h2>
          </div>
          
          <div className="grid gap-6">
            {/* Route 1 - Hwy 38 */}
            <div className="border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-[#477023] text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <span className="font-semibold">38</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl mb-3">Highway 38 through Redlands</h3>
                  <p className="text-gray-700 leading-relaxed">
                    A beautiful scenic highway and is typically the least congested. The road is also wider 
                    and less windy than the other routes.
                  </p>
                </div>
              </div>
            </div>

            {/* Route 2 - Hwy 18 Lucerne */}
            <div className="border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-[#477023] text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <span className="font-semibold">18</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl mb-3">Highway 18 through Lucerne Valley</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Receives less snowfall during winter storms and has the least amount of mountain driving 
                    coming through the desert areas.
                  </p>
                </div>
              </div>
            </div>

            {/* Route 3 - Hwy 18 Running Springs */}
            <div className="border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-[#477023] text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <span className="font-semibold">18</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl mb-3">Highway 18 through Running Springs</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Has reopened and is normally the fastest route to Big Bear, however this route is typically 
                    more congested on weekends and busy holidays.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Once on the Mountain Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Mountain className="w-7 h-7 text-[#477023]" />
            <h2 className="text-3xl">Once You&apos;re on the Mountain</h2>
          </div>

          <div className="space-y-8">
            {/* From Highway 330 */}
            <div className="bg-gray-50 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-[#477023]" />
                <h3 className="text-xl">From Highway 330 (San Bernardino)</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Once you see the dam stay on the right side of the lake and follow the road to Big Bear Lake. 
                Follow the main road onto Big Bear Boulevard. We are located on the right hand side in a large 
                log building just before Carl&apos;s Junior.
              </p>
            </div>

            {/* From Highway 38 */}
            <div className="bg-gray-50 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-[#477023]" />
                <h3 className="text-xl">From Highway 38 (Redlands)</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                The #38 will bring you automatically onto the Big Bear Boulevard. Look for us on the left hand 
                side just passed Carl&apos;s Junior in a large log building.
              </p>
            </div>

            {/* From Highway 18 */}
            <div className="bg-gray-50 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-[#477023]" />
                <h3 className="text-xl">From Highway 18 (Victorville)</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Once on top of the hill you will see the &quot;Dry Lake&quot;. Just follow the road and you will stay to 
                the right of it. Turn left onto Greenway. At the light turn right onto Big Bear Boulevard. Follow 
                this road through Big Bear City into Big Bear Lake. Once you are in Big Bear Lake, look for us 
                and our Big Bear home rentals on the left-hand side just past Carl&apos;s Junior in a large log building.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-br from-[#477023] to-[#5a8c2d] rounded-xl p-8 text-white">
          <div className="flex items-start gap-4">
            <Phone className="w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl mb-3">Need Help Finding Us?</h3>
              <p className="mb-4 leading-relaxed">
                Should you get lost at any time give us a call and we&apos;ll be happy to guide you to our office.
              </p>
              <div className="space-y-2">
                <p className="text-lg">
                  <strong>Toll Free:</strong> <a href="tel:8774735360" className="underline hover:no-underline">(877) 473-5360</a>
                </p>
                <p className="text-white/90">
                  Contact us today to find the best Big Bear rentals! If you&apos;re thinking about holding a corporate 
                  retreat in Big Bear, check out our corporate rentals and large group Big Bear rentals today!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

