"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Users, Minus, Plus } from "lucide-react";
import { cn } from "./ui/utils";

export interface GuestCounts {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

interface GuestSelectorProps {
  className?: string;
  onGuestCountChange?: (counts: GuestCounts) => void;
  initialCounts?: GuestCounts;
}

export function GuestSelector({ className, onGuestCountChange, initialCounts }: GuestSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [guestCounts, setGuestCounts] = useState<GuestCounts>(initialCounts || {
    adults: 0,
    children: 0,
    infants: 0,
    pets: 0
  });

  const updateGuestCount = (type: keyof GuestCounts, operation: 'add' | 'subtract') => {
    setGuestCounts(prev => {
      const newCounts = { ...prev };

      if (operation === 'add') {
        newCounts[type] += 1;
      } else if (operation === 'subtract' && newCounts[type] > 0) {
        newCounts[type] -= 1;
      }

      onGuestCountChange?.(newCounts);
      return newCounts;
    });
  };

  const getTotalGuests = () => {
    return guestCounts.adults + guestCounts.children + guestCounts.infants;
  };

  const getDisplayText = () => {
    const total = getTotalGuests();
    const petText = guestCounts.pets > 0 ? `, ${guestCounts.pets} pet${guestCounts.pets > 1 ? 's' : ''}` : '';

    if (total === 0 && guestCounts.pets === 0) {
      return "Add guests";
    }

    if (total === 1) {
      return `1 guest${petText}`;
    }

    return `${total} guests${petText}`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className={cn("flex-1 px-4 py-2 min-w-0 cursor-pointer hover:bg-gray-50 transition-colors rounded-r-full", className)}>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-xs font-medium text-foreground mb-0.5 pointer-events-none">
                Who
              </label>
              <div className="text-sm text-muted-foreground w-full text-left truncate">
                {getDisplayText()}
              </div>
            </div>
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent
        className="w-96 p-6 bg-white shadow-lg rounded-3xl border border-gray-200"
        align="end"
        sideOffset={8}
      >
        <div className="space-y-6">
          {/* Adults */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="font-semibold text-lg">Adults</div>
              <div className="text-gray-500 text-sm">Ages 13 or above</div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full h-8 w-8 p-0 border-gray-300 hover:border-gray-400 disabled:opacity-30"
                onClick={() => updateGuestCount('adults', 'subtract')}
                disabled={guestCounts.adults === 0}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="font-medium text-lg min-w-[2rem] text-center">
                {guestCounts.adults}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full h-8 w-8 p-0 border-gray-300 hover:border-gray-400"
                onClick={() => updateGuestCount('adults', 'add')}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-gray-200"></div>

          {/* Children */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="font-semibold text-lg">Children</div>
              <div className="text-gray-500 text-sm">Ages 2 – 12</div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full h-8 w-8 p-0 border-gray-300 hover:border-gray-400 disabled:opacity-30"
                onClick={() => updateGuestCount('children', 'subtract')}
                disabled={guestCounts.children === 0}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="font-medium text-lg min-w-[2rem] text-center">
                {guestCounts.children}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full h-8 w-8 p-0 border-gray-300 hover:border-gray-400"
                onClick={() => updateGuestCount('children', 'add')}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-gray-200"></div>

          {/* Infants */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="font-semibold text-lg">Infants</div>
              <div className="text-gray-500 text-sm">Under 2</div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full h-8 w-8 p-0 border-gray-300 hover:border-gray-400 disabled:opacity-30"
                onClick={() => updateGuestCount('infants', 'subtract')}
                disabled={guestCounts.infants === 0}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="font-medium text-lg min-w-[2rem] text-center">
                {guestCounts.infants}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full h-8 w-8 p-0 border-gray-300 hover:border-gray-400"
                onClick={() => updateGuestCount('infants', 'add')}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-gray-200"></div>

          {/* Pets */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="font-semibold text-lg">Pets</div>
              <div className="text-gray-500 text-sm hover:text-gray-700 transition-colors">
                <button className="underline hover:no-underline">
                  Bringing a service animal?
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full h-8 w-8 p-0 border-gray-300 hover:border-gray-400 disabled:opacity-30"
                onClick={() => updateGuestCount('pets', 'subtract')}
                disabled={guestCounts.pets === 0}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="font-medium text-lg min-w-[2rem] text-center">
                {guestCounts.pets}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full h-8 w-8 p-0 border-gray-300 hover:border-gray-400"
                onClick={() => updateGuestCount('pets', 'add')}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}