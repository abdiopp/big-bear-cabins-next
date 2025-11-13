"use client";

import { useState, useEffect } from "react";
import { Categories } from "../Categories";
import { HomeHeroDocument, HomeHeroDocumentData, Simplify } from "../../../prismicio-types";
import { PrismicNextImage } from "@prismicio/next";

type HeroProps = { data: Simplify<HomeHeroDocumentData> };

export function HeroClient({ data }: HeroProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex === data.images.length - 1 ? 0 : prevIndex + 1));
    }, 2000); // Change image every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {/* Hero Background Images */}
      <div className="absolute inset-0">
        {data.images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <PrismicNextImage field={image.image} fallbackAlt="" className="w-full h-full object-cover object-center" />
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
