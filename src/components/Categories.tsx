import { Button } from "./ui/button";
import { HomeHeroDocumentDataLinksItem, Simplify } from "../../prismicio-types";
import { GroupField } from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";

type CategoriesProps = { data: GroupField<Simplify<HomeHeroDocumentDataLinksItem>> };

export function Categories({ data }: CategoriesProps) {
  return (
    <div className="absolute bottom-8 left-0 right-0 z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-8 py-4 overflow-x-auto scrollbar-hide">
          {data.map((category, i) => {
            return (
              <PrismicNextLink key={i} field={category.link}>
                <Button
                  variant="ghost"
                  className="flex flex-col items-center space-y-2 min-w-fit px-4 py-2 h-auto text-white hover:text-white/80 hover:bg-white/10 rounded-lg backdrop-blur-sm transition-all duration-200"
                >
                  <div className="invert">
                    <PrismicNextImage field={category.icon} fallbackAlt="" className="h-6 w-6" />
                  </div>

                  <span className="text-xs whitespace-nowrap">{category.link.text}</span>
                </Button>
              </PrismicNextLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}
