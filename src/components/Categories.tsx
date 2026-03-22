// "use client";
// import Link from "next/link";
// import { useSearchParams } from "next/navigation";
// import { Button } from "./ui/button";
// import { useRef } from "react";
// import { ArrowLeft, ArrowRight } from "lucide-react";

// type CategoryLink = {
//   url: string;
//   text?: string | null;
//   icon?: string | null;
// };

// type CategoriesProps = { data: CategoryLink[] };

// export function Categories({ data }: CategoriesProps) {
//   const searchParams = useSearchParams();
//   const scrollRef = useRef<HTMLDivElement>(null);

//   const existingFilters = searchParams.get("filters");

//   // Scroll Functions
//   const scrollLeft = () => {
//     scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
//   };

//   const scrollRight = () => {
//     scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
//   };

//   return (
//     <div className="absolute bottom-8 left-0 right-0 z-20">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">

//         {/* LEFT BUTTON */}
//         <button
//           onClick={scrollLeft}
//           className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-white text-black p-2 rounded-full cursor-pointer"
//         >
//           <ArrowLeft size={18} />
//         </button>

//         {/* RIGHT BUTTON */}
//         <button
//           onClick={scrollRight}
//           className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-white text-black p-2 rounded-full cursor-pointer"
//         >
//           <ArrowRight size={18} />
//         </button>

//         {/* SCROLL CONTAINER */}
//         <div
//           ref={scrollRef}
//           className="flex items-center md:justify-center space-x-3 sm:space-x-8 py-4 overflow-x-auto scrollbar-hide scroll-smooth"
//         >
//           {data.map((category, i) => {
//             if (!category.url || !category.text) return null;

//             const filterName = category.text
//               .toLowerCase()
//               .replace(/\s+/g, "")
//               .replace(/[^a-z]/g, "");

//             let newFilters = filterName;

//             if (existingFilters) {
//               const filtersArray = existingFilters.split(",");

//               if (!filtersArray.includes(filterName)) {
//                 filtersArray.push(filterName);
//               }

//               newFilters = filtersArray.join(",");
//             }

//             const href = `/search?filters=${newFilters}`;

//             return (
//               <Link key={i} href={href}>
//                 <Button
//                   variant="ghost"
//                   className="group relative flex flex-col items-center space-y-2 min-w-fit px-4 py-2 h-auto text-white bg-transparent hover:bg-white/10 rounded-lg backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.15)] transition-all duration-300"
//                 >
//                   <div className="invert">
//                     {category.icon && (
//                       <img
//                         src={category.icon}
//                         alt={category.text}
//                         className="h-6 w-6"
//                       />
//                     )}
//                   </div>

//                   <span className="text-xs whitespace-nowrap">
//                     {category.text}
//                   </span>
//                 </Button>
//               </Link>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";
// import Link from "next/link";
// import { useSearchParams } from "next/navigation";
// import { Button } from "./ui/button";
// import { useRef, useState, useEffect } from "react";
// import { cn } from "./ui/utils";

// type CategoryLink = {
//   url: string;
//   text?: string | null;
//   icon?: string | null;
// };

// type CategoriesProps = { data: CategoryLink[] };

// export function Categories({ data }: CategoriesProps) {
//   const searchParams = useSearchParams();
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const existingFilters = searchParams.get("filters");

//   // 1. Center logic for Active Dot
//   const handleScroll = () => {
//     if (scrollRef.current) {
//       const container = scrollRef.current;
//       const centerPoint = container.scrollLeft + container.offsetWidth / 2;

//       // Find which element is at the center
//       const children = Array.from(container.children) as HTMLElement[];
//       let closestIndex = 0;
//       let minDistance = Infinity;

//       children.forEach((child, index) => {
//         const childCenter = child.offsetLeft + child.offsetWidth / 2;
//         const distance = Math.abs(centerPoint - childCenter);
//         if (distance < minDistance) {
//           minDistance = distance;
//           closestIndex = index;
//         }
//       });

//       setActiveIndex(closestIndex);
//     }
//   };

//   // 2. Auto Play (Single item scroll)
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (scrollRef.current) {
//         const container = scrollRef.current;
//         const children = container.children;

//         if (activeIndex < data.length - 1) {
//           // Scroll to next item
//           const nextChild = children[activeIndex + 1] as HTMLElement;
//           container.scrollTo({
//             left: nextChild.offsetLeft - container.offsetWidth / 2 + nextChild.offsetWidth / 2,
//             behavior: "smooth"
//           });
//         } else {
//           // Reset to first item
//           container.scrollTo({ left: 0, behavior: "smooth" });
//         }
//       }
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [activeIndex, data.length]);

//   const scrollToCategory = (index: number) => {
//     if (scrollRef.current) {
//       const container = scrollRef.current;
//       const targetChild = container.children[index] as HTMLElement;
//       container.scrollTo({
//         left: targetChild.offsetLeft - container.offsetWidth / 2 + targetChild.offsetWidth / 2,
//         behavior: "smooth"
//       });
//     }
//   };

//   return (
//     <div className="absolute bottom-8 left-0 right-0 z-20">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative group">

//         {/* SCROLL CONTAINER */}
//         <div
//           ref={scrollRef}
//           onScroll={handleScroll}
//           className="flex items-center md:justify-center gap-3 sm:gap-8 py-4 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
//         >
//           {data.map((category, i) => {
//             if (!category.url || !category.text) return null;

//             const filterName = category.text.toLowerCase().replace(/\s+/g, "").replace(/[^a-z]/g, "");
//             let newFilters = filterName;
//             if (existingFilters) {
//               const filtersArray = existingFilters.split(",");
//               if (!filtersArray.includes(filterName)) filtersArray.push(filterName);
//               newFilters = filtersArray.join(",");
//             }

//             return (
//               <Link key={i} href={`/search?filters=${newFilters}`} className="snap-center shrink-0">
//                 <Button
//                   variant="ghost"
//                 className="group relative flex flex-col items-center space-y-2 min-w-[90px] px-4 py-2 h-auto text-white bg-transparent hover:bg-white/10 rounded-lg backdrop-blur-md transition-all duration-300"
//                 >
//                   <div className="invert">
//                     {category.icon && (
//                       <img src={category.icon} alt={category.text} className="size-6 shrink-0" />
//                     )}
//                   </div>
//                   <span className="text-[10px] sm:text-xs font-medium whitespace-nowrap">
//                     {category.text}
//                   </span>
//                 </Button>
//               </Link>
//             );
//           })}
//         </div>

//         {/* DOTS INDICATORS */}
//         <div className="flex justify-center gap-1.5 mt-2">
//           {data.map((_, i) => (
//             <button
//               key={i}
//               onClick={() => scrollToCategory(i)}
//               className={cn(
//                 "h-1.5 transition-all duration-500 rounded-full",
//                 activeIndex === i
//                   ? "w-8 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
//                   : "w-1.5 bg-white/30 hover:bg-white/50"
//               )}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }




"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { useRef, useState, useEffect } from "react";
import { cn } from "./ui/utils";

type CategoryLink = {
  url: string;
  text?: string | null;
  icon?: string | null;
};

type CategoriesProps = { data: CategoryLink[] };

export function Categories({ data }: CategoriesProps) {
  const searchParams = useSearchParams();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const existingFilters = searchParams.get("filters");

  // 1. Mobile check logic
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 2. Center logic for Active Dot
  const handleScroll = () => {
    if (scrollRef.current && isMobile) {
      const container = scrollRef.current;
      const centerPoint = container.scrollLeft + container.offsetWidth / 2;
      const children = Array.from(container.children) as HTMLElement[];

      let closestIndex = 0;
      let minDistance = Infinity;

      children.forEach((child, index) => {
        const childCenter = child.offsetLeft + child.offsetWidth / 2;
        const distance = Math.abs(centerPoint - childCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });
      setActiveIndex(closestIndex);
    }
  };

  // 3. Auto Play - Only for Mobile
  useEffect(() => {
    if (!isMobile) return; // Desktop par auto-play stop

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const container = scrollRef.current;
        const children = container.children;

        if (activeIndex < data.length - 1) {
          const nextChild = children[activeIndex + 1] as HTMLElement;
          container.scrollTo({
            left: nextChild.offsetLeft - container.offsetWidth / 2 + nextChild.offsetWidth / 2,
            behavior: "smooth"
          });
        } else {
          container.scrollTo({ left: 0, behavior: "smooth" });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex, data.length, isMobile]);

  const scrollToCategory = (index: number) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const targetChild = container.children[index] as HTMLElement;
      container.scrollTo({
        left: targetChild.offsetLeft - container.offsetWidth / 2 + targetChild.offsetWidth / 2,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="absolute bottom-8 left-0 right-0 z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative group">

        {/* SCROLL CONTAINER */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className={cn(
            "flex items-center gap-3 sm:gap-8 py-4 overflow-x-auto scrollbar-hide scroll-smooth",
            "md:justify-center md:overflow-x-visible", // Desktop par scroll khatam
            isMobile ? "snap-x snap-mandatory" : ""
          )}
        >
          {data.map((category, i) => {
            if (!category.url || !category.text) return null;

            const filterName = category.text.toLowerCase().replace(/\s+/g, "").replace(/[^a-z]/g, "");
            let newFilters = filterName;
            if (existingFilters) {
              const filtersArray = existingFilters.split(",");
              if (!filtersArray.includes(filterName)) filtersArray.push(filterName);
              newFilters = filtersArray.join(",");
            }

            return (
              <Link key={i} href={`/search?filters=${newFilters}`} className="snap-center shrink-0">
                <Button
                  variant="ghost"
                  className="group relative flex flex-col items-center space-y-2 min-w-[90px] px-4 py-2 h-auto text-white bg-transparent hover:bg-white/10 rounded-lg backdrop-blur-md transition-all duration-300"
                >
                  <div className="invert">
                    {category.icon && (
                      <img src={category.icon} alt={category.text} className="size-6 shrink-0" />
                    )}
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium whitespace-nowrap">
                    {category.text}
                  </span>
                </Button>
              </Link>
            );
          })}
        </div>

        {/* DOTS INDICATORS - Mobile Only */}
        <div className="max-md:flex justify-center gap-1.5 mt-2 md:hidden">
          {data.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToCategory(i)}
              className={cn(
                "h-1.5 transition-all duration-500 rounded-full",
                activeIndex === i
                  ? "w-8 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                  : "w-1.5 bg-white/30"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}