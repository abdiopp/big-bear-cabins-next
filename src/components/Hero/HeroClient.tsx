"use client";

import { useState, useEffect, Suspense } from "react";
import { Categories } from "../Categories";
import {
  Search,
} from "lucide-react";
import { usePathname } from "next/navigation";
import SearchFilterDrawer from "./SearchFilterDrawer";

type HeroData = {
  heading: string;
  images: { url: string }[];
  links: { url: string; text: string | null; icon: string | null }[];
};

type HeroProps = { data: HeroData };

export function HeroClient({ data }: HeroProps) {
  const pathname = usePathname();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSearchFilterDrawerOpen, setIsSearchFilterDrawerOpen] = useState<boolean>(false);

  const toggleSearchFilterDrawer = () => setIsSearchFilterDrawerOpen(!isSearchFilterDrawerOpen);

  useEffect(() => {
    if (data.images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex === data.images.length - 1 ? 0 : prevIndex + 1));
    }, 2000); // Change image every 2 seconds

    return () => clearInterval(interval);
  }, [data.images.length]);

  return (
    <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {/* Hero Background Images */}
      <div className="absolute inset-0">
        {data.images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
          >
            {/* Using standard img for external URLs. Next/Image requires domain config. */}
            <img src={image.url} alt="" className="w-full h-full object-cover object-center" />
          </div>
        ))}
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 h-full flex flex-col justify-start items-center px-4 sm:px-6 lg:px-8 pt-20">
        {/* Hero Text */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white">{data.heading}</h1>
          {(pathname === "/" || pathname === "/other-areas" || pathname === "/special-offers") && (

            <div className="max-md:flex md:hidden items-center justify-center mt-4">
              <button onClick={toggleSearchFilterDrawer} type="button" className="bg-white mt-5 border border-gray-400 shadow-lg rounded-full flex items-center justify-center max-w-72 w-full px-4 py-2.5 gap-2 mx-auto">

                <Search />
                <span className="font-medium">
                  Start your search
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Categories overlay */}
      <Suspense fallback={null}>
        <Categories data={data.links} />
      </Suspense>

      <SearchFilterDrawer isOpen={isSearchFilterDrawerOpen} onClose={toggleSearchFilterDrawer} />
    </div>
  );
}
