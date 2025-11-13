"use client";

import {
  Search,
  Calendar,
  Users,
  Map,
  Menu,
  User,
  X,
  ChevronDown,
  Filter,
  LogOut,
  UserCircle,
  Settings,
} from "lucide-react";
import { Button } from "./ui/button";
import { LoginDialog } from "./LoginDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { DateRangePicker } from "./DateRangePicker";
import { GuestSelector } from "./GuestSelector";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
  const [guestCounts, setGuestCounts] = useState({
    adults: 0,
    children: 0,
    infants: 0,
    pets: 0,
  });

  const [filters, setFilters] = useState({
    mountainView: false,
    lakefront: false,
    boatDock: false,
    evCharger: false,
    hotTub: false,
  });

  const handleDateRangeSelect = (checkIn: Date | undefined, checkOut: Date | undefined) => {
    setCheckInDate(checkIn);
    setCheckOutDate(checkOut);
  };

  const handleGuestCountChange = (counts: { adults: number; children: number; infants: number; pets: number }) => {
    setGuestCounts(counts);
  };

  const handleFilterChange = (filterKey: keyof typeof filters) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: !prev[filterKey],
    }));
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.refresh();
  };

  const isOnCategoryPage = pathname?.startsWith("/category/");
  const isHomePage = pathname === "/";

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/assets/0a40be2265b596033e0b90d10230b7b99c63ff3c.png"
                alt="Big Bear Cabins"
                width={112}
                height={56}
                className="h-14 w-auto hover:opacity-80 transition-opacity"
              />
            </Link>
          </div>

          {/* Navigation removed as requested */}

          {/* Search Bar - Center (show on home, other areas, and special offers pages) */}
          {(pathname === "/" || pathname === "/other-areas" || pathname === "/special-offers") && (
            <div className="hidden md:flex flex-1 justify-center mx-8">
              <div className="bg-white rounded-full shadow-sm border border-border p-1 w-full max-w-2xl">
                <div className="flex">
                  {/* Date Range Picker */}
                  <DateRangePicker
                    checkInDate={checkInDate}
                    checkOutDate={checkOutDate}
                    onDateRangeSelect={handleDateRangeSelect}
                  />

                  {/* Guests */}
                  <GuestSelector onGuestCountChange={handleGuestCountChange} />

                  {/* Search Button */}
                  <div className="flex items-center px-1">
                    <Button size="sm" className="rounded-full h-8 w-8 p-0">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Category Page Search Bar */}
          {isOnCategoryPage && (
            <div className="hidden md:flex flex-1 justify-center mx-8">
              <div className="bg-white rounded-full shadow-sm border border-border p-1 w-full max-w-2xl">
                <div className="flex items-center">
                  {/* Date Range Picker */}
                  <DateRangePicker
                    checkInDate={checkInDate}
                    checkOutDate={checkOutDate}
                    onDateRangeSelect={handleDateRangeSelect}
                  />

                  {/* Guests */}
                  <GuestSelector onGuestCountChange={handleGuestCountChange} />

                  {/* Search Button */}
                  <div className="flex items-center px-1">
                    <Button size="sm" className="rounded-full h-8 w-8 p-0">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Filter Button */}
                  <div className="flex items-center px-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="rounded-full h-8 w-8 p-0 ml-2 border-gray-300">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-4" align="end">
                        <div className="space-y-4">
                          <h3 className="font-medium text-gray-900">Filters</h3>

                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="mountain-view"
                                checked={filters.mountainView}
                                onCheckedChange={() => handleFilterChange("mountainView")}
                              />
                              <Label htmlFor="mountain-view" className="text-sm">
                                Mountain view location
                              </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="lakefront"
                                checked={filters.lakefront}
                                onCheckedChange={() => handleFilterChange("lakefront")}
                              />
                              <Label htmlFor="lakefront" className="text-sm">
                                Lakefront location
                              </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="boat-dock"
                                checked={filters.boatDock}
                                onCheckedChange={() => handleFilterChange("boatDock")}
                              />
                              <Label htmlFor="boat-dock" className="text-sm">
                                Boat Dock
                              </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="ev-charger"
                                checked={filters.evCharger}
                                onCheckedChange={() => handleFilterChange("evCharger")}
                              />
                              <Label htmlFor="ev-charger" className="text-sm">
                                EV charger
                              </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="hot-tub"
                                checked={filters.hotTub}
                                onCheckedChange={() => handleFilterChange("hotTub")}
                              />
                              <Label htmlFor="hot-tub" className="text-sm">
                                Hot Tub
                              </Label>
                            </div>
                          </div>

                          <div className="flex space-x-2 pt-4 border-t">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() =>
                                setFilters({
                                  mountainView: false,
                                  lakefront: false,
                                  boatDock: false,
                                  evCharger: false,
                                  hotTub: false,
                                })
                              }
                            >
                              Clear all
                            </Button>
                            <Button size="sm" className="flex-1">
                              Apply filters
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Right side menu */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <button
              className="hidden lg:block text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-full px-3 py-2 transition-colors"
              onClick={() => router.push("/list-property")}
            >
              List your cabin
            </button>

            {/* Map/Other Areas Button */}
            <Button variant="ghost" size="sm" className="rounded-full p-2" onClick={() => router.push("/other-areas")}>
              <Map className="h-4 w-4" />
            </Button>

            <div className="flex items-center border border-border rounded-full p-1 hover:shadow-md transition-shadow">
              {/* Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-full p-2">
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {/* User Profile Section - Show when logged in */}
                  {session?.user && (
                    <>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{session.user.name}</p>
                          <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push("/profile")}>
                        <UserCircle className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/settings")}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}

                  {/* Special Offers - Always visible */}
                  <DropdownMenuItem
                    onClick={() => router.push("/special-offers")}
                    className="bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-b border-green-300 relative overflow-hidden special-offers-glow"
                  >
                    <span className="relative z-10 font-semibold text-[#477023]">✨ Special Offers</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/about")}>About</DropdownMenuItem>
                  <DropdownMenuItem>About Big Bear</DropdownMenuItem>
                  <DropdownMenuItem>Blog</DropdownMenuItem>
                  <DropdownMenuItem>Attractions</DropdownMenuItem>
                  <DropdownMenuItem>Directions</DropdownMenuItem>
                  <DropdownMenuItem>Events</DropdownMenuItem>
                  <DropdownMenuItem>Experiences</DropdownMenuItem>
                  <DropdownMenuItem>Holidays</DropdownMenuItem>
                  <DropdownMenuItem>Journeys</DropdownMenuItem>
                  <DropdownMenuItem>Restaurants</DropdownMenuItem>
                  <DropdownMenuItem>Ski Guide</DropdownMenuItem>

                  {/* Logout - Show when logged in */}
                  {session?.user && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Login Modal - Only show when not logged in */}
              {!session?.user && (
                <LoginDialog
                  isOpen={isLoginOpen}
                  onOpenChange={setIsLoginOpen}
                  trigger={
                    <Button variant="ghost" size="sm" className="rounded-full p-2">
                      <User className="h-4 w-4" />
                    </Button>
                  }
                />
              )}

              {/* User Avatar - Show when logged in */}
              {session?.user && (
                <Button variant="ghost" size="sm" className="rounded-full p-2">
                  <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-700">
                      {session.user.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
