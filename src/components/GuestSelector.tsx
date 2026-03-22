// "use client";

// import { useState } from "react";
// import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
// import { Button } from "./ui/button";
// import { Users, Minus, Plus } from "lucide-react";
// import { cn } from "./ui/utils";

// export interface GuestCounts {
//   adults: number;
//   children: number;
//   pets: boolean;
// }

// interface GuestSelectorProps {
//   className?: string;
//   onGuestCountChange?: (counts: GuestCounts) => void;
//   initialCounts?: GuestCounts;
//   counts?: GuestCounts;
// }

// export function GuestSelector({ className, onGuestCountChange, initialCounts, counts }: GuestSelectorProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [internalCounts, setInternalCounts] = useState<GuestCounts>(initialCounts || {
//     adults: 0,
//     children: 0,
//     pets: false
//   });

//   const effectiveCounts = counts || internalCounts;

//   const updateGuestCount = (type: keyof GuestCounts, operation?: 'add' | 'subtract') => {
//     const newCounts = { ...effectiveCounts };

//     if (type === "pets") {
//       newCounts.pets = !newCounts.pets;
//     } else {
//       if (operation === 'add') newCounts[type] += 1;
//       if (operation === 'subtract' && newCounts[type] > 0) newCounts[type] -= 1;
//     }

//     if (!counts) setInternalCounts(newCounts);
//     onGuestCountChange?.(newCounts);
//   };

//   const getTotalGuests = () => {
//     return effectiveCounts.adults + effectiveCounts.children;
//   };

//   const getDisplayText = () => {
//     const total = getTotalGuests();
//     const petText = effectiveCounts.pets ? ", pets" : "";

//     if (total === 0 && !effectiveCounts.pets) return "Add guests";
//     if (total === 1) return `1 guest${petText}`;
//     return `${total} guests${petText}`;
//   };

//   return (
//     <Popover open={isOpen} onOpenChange={setIsOpen}>
//       <PopoverTrigger asChild>
//         <div className={cn("flex-1 px-4 py-2 min-w-0 cursor-pointer hover:bg-gray-50 transition-colors rounded-r-full", className)}>
//           <div className="flex items-center space-x-2">
//             <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
//             <div className="flex-1 min-w-0">
//               <label className="block text-xs font-medium text-foreground mb-0.5 pointer-events-none">
//                 Who
//               </label>
//               <div className="text-sm text-muted-foreground w-full text-left truncate">
//                 {getDisplayText()}
//               </div>
//             </div>
//           </div>
//         </div>
//       </PopoverTrigger>

//       <PopoverContent
//         className="w-96 p-6 bg-white shadow-lg rounded-3xl border border-gray-200 z-[100]"
//         align="end"
//         sideOffset={8}
//       >
//         <div className="space-y-6">
//           {/* Adults */}
//           <div className="flex items-center justify-between">
//             <div className="flex-1">
//               <div className="font-semibold text-lg">Adults</div>
//               <div className="text-gray-500 text-sm">Ages 13 or above</div>
//             </div>
//             <div className="flex items-center space-x-4">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="rounded-full h-8 w-8 p-0 border-gray-300 hover:border-gray-400 disabled:opacity-30"
//                 onClick={() => updateGuestCount('adults', 'subtract')}
//                 disabled={effectiveCounts.adults === 0}
//               >
//                 <Minus className="h-3 w-3" />
//               </Button>
//               <span className="font-medium text-lg min-w-[2rem] text-center">
//                 {effectiveCounts.adults}
//               </span>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="rounded-full h-8 w-8 p-0 border-gray-300 hover:border-gray-400"
//                 onClick={() => updateGuestCount('adults', 'add')}
//               >
//                 <Plus className="h-3 w-3" />
//               </Button>
//             </div>
//           </div>

//           {/* Separator */}
//           <div className="border-t border-gray-200"></div>

//           {/* Children */}
//           <div className="flex items-center justify-between">
//             <div className="flex-1">
//               <div className="font-semibold text-lg">Children</div>
//               <div className="text-gray-500 text-sm">Ages 2 – 12</div>
//             </div>
//             <div className="flex items-center space-x-4">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="rounded-full h-8 w-8 p-0 border-gray-300 hover:border-gray-400 disabled:opacity-30"
//                 onClick={() => updateGuestCount('children', 'subtract')}
//                 disabled={effectiveCounts.children === 0}
//               >
//                 <Minus className="h-3 w-3" />
//               </Button>
//               <span className="font-medium text-lg min-w-[2rem] text-center">
//                 {effectiveCounts.children}
//               </span>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="rounded-full h-8 w-8 p-0 border-gray-300 hover:border-gray-400"
//                 onClick={() => updateGuestCount('children', 'add')}
//               >
//                 <Plus className="h-3 w-3" />
//               </Button>
//             </div>
//           </div>

//           {/* Separator */}
//           <div className="border-t border-gray-200"></div>

//           {/* Pets */}
//           <div className="flex items-center justify-between">
//             <div className="flex-1">
//               <div className="font-semibold text-lg">Pets</div>
//               <div className="text-gray-500 text-sm">
//                 Traveling with pets?
//               </div>
//             </div>

//             <input
//               type="checkbox"
//               checked={effectiveCounts.pets}
//               onChange={() => updateGuestCount("pets")}
//               className="size-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer accent-black"
//             />
//           </div>
//         </div>
//       </PopoverContent>
//     </Popover>
//   );
// }



"use client";

import { useState, useEffect } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover"; // Direct primitive use kar rahe hain for Portal
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Users, Minus, Plus } from "lucide-react";
import { cn } from "./ui/utils";

export interface GuestCounts {
  adults: number;
  children: number;
  pets: boolean;
}

interface GuestSelectorProps {
  className?: string;
  onGuestCountChange?: (counts: GuestCounts) => void;
  initialCounts?: GuestCounts;
  counts?: GuestCounts;
}

export function GuestSelector({ className, onGuestCountChange, initialCounts, counts }: GuestSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [internalCounts, setInternalCounts] = useState<GuestCounts>(initialCounts || {
    adults: 0,
    children: 0,
    pets: false
  });

  const effectiveCounts = counts || internalCounts;

  // Mobile check logic
  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 768);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const updateGuestCount = (type: keyof GuestCounts, operation?: 'add' | 'subtract') => {
    const newCounts = { ...effectiveCounts };
    if (type === "pets") {
      newCounts.pets = !newCounts.pets;
    } else {
      if (operation === 'add') newCounts[type] += 1;
      if (operation === 'subtract' && newCounts[type] > 0) newCounts[type] -= 1;
    }
    if (!counts) setInternalCounts(newCounts);
    onGuestCountChange?.(newCounts);
  };

  const getDisplayText = () => {
    const total = effectiveCounts.adults + effectiveCounts.children;
    const petText = effectiveCounts.pets ? ", pets" : "";
    if (total === 0 && !effectiveCounts.pets) return "Add guests";
    return `${total} guest${total !== 1 ? 's' : ''}${petText}`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className={cn(
          "flex-1 px-4 py-2 min-w-0 cursor-pointer hover:bg-gray-50 transition-colors rounded-xl border border-transparent",
          isOpen && "border-gray-200 bg-gray-50",
          className
        )}>
          <div className="flex items-center space-x-3">
            <Users className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">
                Who
              </label>
              <div className="text-sm font-medium text-gray-800 truncate">
                {getDisplayText()}
              </div>
            </div>
          </div>
        </div>
      </PopoverTrigger>

      {/* PORTAL FIX: Ye line popup ko drawer ke stacking context se bahar nikaal degi */}
      <PopoverPrimitive.Portal>
        <PopoverContent
          /* 1. z-[110] Drawer (z-70) ke upar dikhane ke liye 
             2. w-[calc(100vw-32px)] Mobile par screen se bahar nahi jayega
             3. sm:w-80 Desktop par fixed width
          */
          className="z-[110] w-[calc(100vw-32px)] sm:w-80 p-6 bg-white shadow-2xl rounded-3xl border border-gray-100"
          align={isMobile ? "center" : "end"}
          sideOffset={10}
        >
          <div className="space-y-6">
            {/* Adults Section */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-gray-800">Adults</div>
                <div className="text-gray-400 text-xs">Ages 13 or above</div>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full border-gray-200"
                  onClick={() => updateGuestCount('adults', 'subtract')}
                  disabled={effectiveCounts.adults === 0}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="font-bold w-4 text-center">{effectiveCounts.adults}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full border-gray-200"
                  onClick={() => updateGuestCount('adults', 'add')}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="h-[1px] bg-gray-100 w-full" />

            {/* Children Section */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-gray-800">Children</div>
                <div className="text-gray-400 text-xs">Ages 2 – 12</div>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full border-gray-200"
                  onClick={() => updateGuestCount('children', 'subtract')}
                  disabled={effectiveCounts.children === 0}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="font-bold w-4 text-center">{effectiveCounts.children}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full border-gray-200"
                  onClick={() => updateGuestCount('children', 'add')}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="h-[1px] bg-gray-100 w-full" />

            {/* Pets Section */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-gray-800">Pets</div>
                <div className="text-gray-400 text-xs">Service animals allowed</div>
              </div>
              <div
                onClick={() => updateGuestCount("pets")}
                className={cn(
                  "w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200",
                  effectiveCounts.pets ? "bg-black" : "bg-gray-200"
                )}
              >
                <div className={cn(
                  "w-4 h-4 bg-white rounded-full transition-transform duration-200",
                  effectiveCounts.pets ? "translate-x-6" : "translate-x-0"
                )} />
              </div>
            </div>
          </div>
        </PopoverContent>
      </PopoverPrimitive.Portal>
    </Popover>
  );
}