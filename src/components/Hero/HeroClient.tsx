"use client";

import { useState, useEffect } from "react";
import { Categories } from "../Categories";

type HeroData = {
  heading: string;
  images: { url: string }[];
  links: { url: string; text: string | null; icon: string | null }[];
};

type HeroProps = { data: HeroData };

export function HeroClient({ data }: HeroProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white">{data.heading}</h1>
        </div>
      </div>

      {/* Categories overlay */}
      <Categories data={data.links} />
    </div>
  );
}
