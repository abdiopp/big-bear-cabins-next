"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";

type CategoryLink = {
  url: string;
  text?: string | null;
  icon?: string | null;
};

type CategoriesProps = { data: CategoryLink[] };

export function Categories({ data }: CategoriesProps) {
  const searchParams = useSearchParams();
  const existingFilters = searchParams.get("filters");
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 1500, stopOnInteraction: false })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback((index: number) => {
    emblaApi?.scrollTo(index);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const renderItem = (category: CategoryLink, i: number) => {
    if (!category.url || !category.text) return null;

    const filterName = category.text
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z]/g, "");

    let newFilters = filterName;

    if (existingFilters) {
      const filtersArray = existingFilters.split(",");

      if (!filtersArray.includes(filterName)) {
        filtersArray.push(filterName);
      }

      newFilters = filtersArray.join(",");
    }

    const href = `/search?filters=${newFilters}`;

    return (
      <Link key={i} href={href}>
        <Button className="group flex flex-col items-center space-y-2 w-full px-3 py-2 h-auto text-white bg-white/10 rounded-lg backdrop-blur-md shadow-md hover:bg-white/20 transition">
          <div className="invert">
            {category.icon && (
              <img
                src={category.icon}
                alt={category.text}
                className="size-6"
              />
            )}
          </div>
          <span className="text-xs whitespace-nowrap">
            {category.text}
          </span>
        </Button>
      </Link>
    );
  };

  return (
    <div className="absolute bottom-8 left-0 right-0 z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* ✅ Mobile Slider */}
        <div className="max-sm:block sm:hidden">
          <div className="relative">
            {/* Viewport */}
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {data.map((category, i) => (
                  <div key={i} className="flex-[0_0_auto] me-4!">
                    {renderItem(category, i)}
                  </div>
                ))}
              </div>
            </div>

            {/* ✅ Dots */}
            <div className="flex justify-center mt-3 gap-2">
              {data.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`w-2.5 h-2.5 rounded-full transition ${selectedIndex === index
                    ? "bg-white"
                    : "bg-white/40"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ✅ Desktop Layout */}
        <div className="max-sm:hidden sm:flex items-center justify-center space-x-6 py-4 overflow-x-auto scrollbar-hide">
          {data.map((category, i) => renderItem(category, i))}
        </div>

      </div>
    </div>
  );
}