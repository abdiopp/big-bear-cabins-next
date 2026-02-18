"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "./ui/button";

type CategoryLink = {
  url: string;
  text?: string | null;
  icon?: string | null;
};

type CategoriesProps = { data: CategoryLink[] };

export function Categories({ data }: CategoriesProps) {
  const searchParams = useSearchParams();

  // Get already active filters from URL (if any)
  const existingFilters = searchParams.get("filters");

  return (
    <div className="absolute bottom-8 left-0 right-0 z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-8 py-4 overflow-x-auto scrollbar-hide">
          {data.map((category, i) => {
            if (!category.url || !category.text) return null;

            const filterName = category.text.toLowerCase().replace(/\s+/g, "").replace(/[^a-z]/g, "");

            // Merge existing filters with new one (avoid duplicates)
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
                  className="
group relative overflow-hidden
flex flex-col items-center space-y-2 min-w-fit px-4 py-2 h-auto
text-white hover:text-white
bg-transparent hover:bg-white/10
rounded-lg
backdrop-blur-md
shadow-[0_8px_32px_rgba(0,0,0,0.15)]
transition-all duration-300
"



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
