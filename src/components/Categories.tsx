import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";

type CategoryLink = {
  url: string;
  text?: string | null;
  icon?: string | null;
};

type CategoriesProps = { data: CategoryLink[] };

export function Categories({ data }: CategoriesProps) {
  return (
    <div className="absolute bottom-8 left-0 right-0 z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-8 py-4 overflow-x-auto scrollbar-hide">
          {data.map((category, i) => {
            if (!category.url) return null;

            return (
              <Link key={i} href={category.url} passHref>
                <Button
                  variant="ghost"
                  className="flex flex-col items-center space-y-2 min-w-fit px-4 py-2 h-auto text-white hover:text-white/80 hover:bg-white/10 rounded-lg backdrop-blur-sm transition-all duration-200"
                >
                  <div className="invert">
                    {category.icon && (
                      // Using img for simplicity if it's external, or Image if configured. Using img for now as configured Image domains unknown.
                      <img src={category.icon} alt="" className="h-6 w-6" />
                    )}
                  </div>

                  <span className="text-xs whitespace-nowrap">{category.text}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
