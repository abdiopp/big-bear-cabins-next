"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

type CategoryLink = {
  url: string;
  text?: string | null;
  icon?: string | null;
};

type CategoriesProps = { data: CategoryLink[] };

export function Categories({ data }: CategoriesProps) {
  const searchParams = useSearchParams();
  const scrollRef = useRef<HTMLDivElement>(null);

  const existingFilters = searchParams.get("filters");

  // Scroll Functions
  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <div className="absolute bottom-8 left-0 right-0 z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* LEFT BUTTON */}
        <button
          onClick={scrollLeft}
          className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-white text-black p-2 rounded-full cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>

        {/* RIGHT BUTTON */}
        <button
          onClick={scrollRight}
          className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-white text-black p-2 rounded-full cursor-pointer"
        >
          <ArrowRight size={18} />
        </button>

        {/* SCROLL CONTAINER */}
        <div
          ref={scrollRef}
          className="flex items-center md:justify-center space-x-3 sm:space-x-8 py-4 overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {data.map((category, i) => {
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
                <Button
                  variant="ghost"
                  className="group relative flex flex-col items-center space-y-2 min-w-fit px-4 py-2 h-auto text-white bg-transparent hover:bg-white/10 rounded-lg backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.15)] transition-all duration-300"
                >
                  <div className="invert">
                    {category.icon && (
                      <img
                        src={category.icon}
                        alt={category.text}
                        className="h-6 w-6"
                      />
                    )}
                  </div>

                  <span className="text-xs whitespace-nowrap">
                    {category.text}
                  </span>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}