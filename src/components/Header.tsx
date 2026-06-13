"use client";

import {
  Search,
  Map,
  Menu,
  User,
  Filter,
  LogOut,
  UserCircle,
  Settings,
  LayoutDashboard,
  Calendar as CalendarIcon,
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
import { Label } from "./ui/label";
import { GuestSelector } from "./GuestSelector";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import SearchFilterDrawer from "./Hero/SearchFilterDrawer";

// ⚡ React Date Range Components & Styles Imports
import { DateRange, RangeKeyDict } from "react-date-range";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // ⚡ New Clean Calendar States & Refs
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [dateRangeState, setDateRangeState] = useState({
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    key: "selection",
  });

  const [guestCounts, setGuestCounts] = useState({
    adults: 0,
    children: 0,
    pets: false,
  });

  const [filters, setFilters] = useState({
    mountainView: false,
    lakefront: false,
    boatDock: false,
    evCharger: false,
    hotTub: false,
  });

  const [isSearchFilterDrawerOpen, setIsSearchFilterDrawerOpen] = useState<boolean>(false);

  const toggleSearchFilterDrawer = () => setIsSearchFilterDrawerOpen(!isSearchFilterDrawerOpen);

  // ⚡ Click outside logic to close calendar popover automatically
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleOpenLogin = () => setIsLoginOpen(true);
    window.addEventListener("open-login-modal", handleOpenLogin);
    return () => window.removeEventListener("open-login-modal", handleOpenLogin);
  }, []);

  // ⚡ Night Tracker Helpers
  const checkIn = dateRangeState.startDate;
  const checkOut = dateRangeState.endDate;
  const totalNights = checkIn && checkOut ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)) : 0;

  const formatDateToUiString = (date: Date) => {
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  const handleRangeChange = (item: RangeKeyDict) => {
    setDateRangeState({
      startDate: item.selection.startDate,
      endDate: item.selection.endDate,
      key: "selection",
    });
  };

  const handleGuestCountChange = (counts: { adults: number; children: number; pets: boolean }) => {
    setGuestCounts(counts);
  };

  const handleFilterChange = (filterKey: keyof typeof filters) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: !prev[filterKey],
    }));
  };

  // Format date to MM/DD/YYYY for API
  const formatDateForApi = (date: Date): string => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const handleSearch = () => {
    const searchParams = new URLSearchParams();

    // ⚡ Map react-date-range states to search params
    if (dateRangeState.startDate) {
      searchParams.set("checkIn", formatDateForApi(dateRangeState.startDate));
    }
    if (dateRangeState.endDate) {
      searchParams.set("checkOut", formatDateForApi(dateRangeState.endDate));
    }

    // API friendly payload
    if (guestCounts.adults > 0) {
      searchParams.set("occupants", String(guestCounts.adults));
    }

    if (guestCounts.children > 0) {
      searchParams.set("occupants_small", String(guestCounts.children));
    }

    // pets boolean filter
    if (guestCounts.pets) {
      searchParams.set("pets", "true");
    }

    // Include active filters
    const activeFilters = Object.entries(filters)
      .filter(([, value]) => value)
      .map(([key]) => key);
    if (activeFilters.length > 0) {
      searchParams.set("filters", activeFilters.join(","));
    }

    router.push(`/search?${searchParams.toString()}`);
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  const isOnCategoryPage = pathname?.startsWith("/category/");

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/assets/0a40be2265b596033e0b90d10230b7b99c63ff3c.png"
                alt="Big Bear Cabins"
                width={112}
                height={56}
                className="max-sm:h-14 sm:h-16 w-auto hover:opacity-80 transition-opacity"
              />
            </Link>
          </div>

          {/* Search Bar - Center (Home Page, etc.) */}
          {(pathname === "/" || pathname === "/other-areas" || pathname === "/special-offers") && (
            <div className="hidden md:flex flex-1 justify-center mx-8">
              <div className="bg-white rounded-full shadow-sm border border-border p-1 w-full max-w-2xl">
                <div className="flex items-center w-full">

                  {/* ⚡ React Date Range Integrated Container */}
                  <div ref={calendarRef} className="flex items-center flex-1 relative">
                    {/* Check In Panel Trigger */}
                    <button
                      type="button"
                      onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                      className="flex flex-1 items-center px-4 py-2 hover:bg-gray-50 rounded-l-full transition text-left cursor-pointer select-none"
                    >
                      <CalendarIcon className="w-4 h-4 text-gray-500 mr-3 flex-shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase shrink-0">Check In</span>
                        <span className="text-sm font-semibold text-gray-900 truncate">
                          {checkIn ? formatDateToUiString(checkIn) : "Add dates"}
                        </span>
                      </div>
                    </button>

                    {/* Vertical Divider */}
                    <div className="h-8 w-[1px] bg-gray-200 flex-shrink-0" />

                    {/* Check Out Panel Trigger */}
                    <button
                      type="button"
                      onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                      className="flex flex-1 items-center px-4 py-2 hover:bg-gray-50 transition text-left cursor-pointer select-none"
                    >
                      <div className="flex flex-col min-w-0 w-full">
                        <div className="flex items-center justify-between w-full pr-2">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase shrink-0">Check Out</span>
                            <span className="text-sm font-semibold text-gray-900 truncate">
                              {checkOut ? formatDateToUiString(checkOut) : "Add dates"}
                            </span>
                          </div>

                          {/* Live Dynamic Nights Badge */}
                          {totalNights > 0 && (
                            <span className="bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full text-[10px] whitespace-nowrap ml-2">
                              {totalNights} {totalNights === 1 ? "night" : "nights"}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Popover Layout Panel */}
                    {isCalendarOpen && (
                      <div className="absolute top-full mt-3 left-0 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden p-2 antialiased">
                        <DateRange
                          ranges={[{
                            startDate: dateRangeState.startDate || new Date(),
                            endDate: dateRangeState.endDate || new Date(),
                            key: 'selection'
                          }]}
                          onChange={handleRangeChange}
                          minDate={new Date()}
                          rangeColors={["#000"]}
                          showDateDisplay={false}
                          direction="horizontal"
                          months={2}
                        />
                      </div>
                    )}
                  </div>

                  {/* Guests Selector Input */}
                  <div className="w-full max-w-[240px] border-s border-gray-200">
                    <GuestSelector counts={guestCounts} onGuestCountChange={handleGuestCountChange} />
                  </div>

                  {/* Search CTA Trigger */}
                  <div className="flex items-center px-1 flex-shrink-0">
                    <button type="button" className="rounded-full size-10 p-0 bg-red-600 text-white flex items-center justify-center cursor-pointer hover:bg-red-700 transition" onClick={handleSearch}>
                      <Search className="size-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Category & Cabins Layout Search Bar */}
          {(isOnCategoryPage || pathname === "/cabins") && (
            <div className="hidden md:flex flex-1 justify-center mx-8">
              <div className="bg-white rounded-full shadow-sm border border-border p-1 w-full max-w-2xl">
                <div className="flex items-center w-full">

                  {/* ⚡ Same React Date Range logic mapped for Category Layout */}
                  <div ref={calendarRef} className="flex items-center flex-1 relative">
                    <button
                      type="button"
                      onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                      className="flex flex-1 items-center px-4 py-2 hover:bg-gray-50 rounded-l-full transition text-left cursor-pointer select-none"
                    >
                      <CalendarIcon className="w-4 h-4 text-gray-500 mr-3 flex-shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Check In</span>
                        <span className="text-sm font-semibold text-gray-900 truncate">
                          {checkIn ? formatDateToUiString(checkIn) : "Add dates"}
                        </span>
                      </div>
                    </button>

                    <div className="h-8 w-[1px] bg-gray-200 flex-shrink-0" />

                    <button
                      type="button"
                      onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                      className="flex flex-1 items-center px-4 py-2 hover:bg-gray-50 transition text-left cursor-pointer select-none"
                    >
                      <div className="flex flex-col min-w-0 w-full">
                        <div className="flex items-center justify-between w-full pr-2">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Check Out</span>
                            <span className="text-sm font-semibold text-gray-900 truncate">
                              {checkOut ? formatDateToUiString(checkOut) : "Add dates"}
                            </span>
                          </div>
                          {totalNights > 0 && (
                            <span className="bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full text-[10px] whitespace-nowrap ml-2">
                              {totalNights} {totalNights === 1 ? "night" : "nights"}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>

                    {isCalendarOpen && (
                      <div className="absolute top-full mt-3 left-0 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden p-2 antialiased">
                        <DateRange
                          ranges={[{
                            startDate: dateRangeState.startDate || new Date(),
                            endDate: dateRangeState.endDate || new Date(),
                            key: 'selection'
                          }]}
                          onChange={handleRangeChange}
                          minDate={new Date()}
                          rangeColors={["#dc2626"]}
                          showDateDisplay={false}
                          direction="horizontal"
                          months={2}
                        />
                      </div>
                    )}
                  </div>

                  <div className="w-full max-w-[200px] border-s border-gray-200">
                    <GuestSelector counts={guestCounts} onGuestCountChange={handleGuestCountChange} />
                  </div>

                  <div className="flex items-center px-1 flex-shrink-0">
                    <Button size="sm" className="rounded-full size-8 p-0 bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition" onClick={handleSearch}>
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center px-1 flex-shrink-0">
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
                            <div className="flex items-center space-x-2 gap-2">
                              <Checkbox
                                id="mountain-view"
                                checked={filters.mountainView}
                                onCheckedChange={() => handleFilterChange("mountainView")}
                              />
                              <Label htmlFor="mountain-view" className="text-sm">Mountain view location</Label>
                            </div>
                            <div className="flex items-center space-x-2 gap-2">
                              <Checkbox
                                id="lakefront"
                                checked={filters.lakefront}
                                onCheckedChange={() => handleFilterChange("lakefront")}
                              />
                              <Label htmlFor="lakefront" className="text-sm">Lakefront location</Label>
                            </div>
                            <div className="flex items-center space-x-2 gap-2">
                              <Checkbox
                                id="boat-dock"
                                checked={filters.boatDock}
                                onCheckedChange={() => handleFilterChange("boatDock")}
                              />
                              <Label htmlFor="boat-dock" className="text-sm">Boat Dock</Label>
                            </div>
                            <div className="flex items-center space-x-2 gap-2">
                              <Checkbox
                                id="ev-charger"
                                checked={filters.evCharger}
                                onCheckedChange={() => handleFilterChange("evCharger")}
                              />
                              <Label htmlFor="ev-charger" className="text-sm">EV charger</Label>
                            </div>
                            <div className="flex items-center space-x-2 gap-2">
                              <Checkbox
                                id="hot-tub"
                                checked={filters.hotTub}
                                onCheckedChange={() => handleFilterChange("hotTub")}
                              />
                              <Label htmlFor="hot-tub" className="text-sm">Hot Tub</Label>
                            </div>
                          </div>
                          <div className="flex space-x-2 gap-2 pt-4 border-t">
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
                            <Button size="sm" className="flex-1" onClick={handleSearch}>
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
            {(pathname === "/" || pathname === "/other-areas" || pathname === "/special-offers") && (
              <button onClick={toggleSearchFilterDrawer} type="button" className="rounded-full size-8 p-0 bg-red-600 text-white max-md:flex md:hidden items-center justify-center mx-2!">
                <Search size={16} />
              </button>
            )}
            {session?.user?.role === "admin" && (
              <Button variant="ghost" size="sm" onClick={() => router.push("/admin")}>
                <LayoutDashboard className="h-4 w-4" />
                <span className="max-sm:hidden">CMS</span>
              </Button>
            )}
            <button
              className="hidden lg:block text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-full px-3 py-2 transition-colors"
              onClick={() => router.push("/list-property")}
            >
              List your cabin
            </button>
            <Button variant="ghost" size="sm" className="rounded-full p-2 max-sm:hidden! sm:flex" onClick={() => router.push("/other-areas")}>
              <Map className="h-4 w-4" />
            </Button>
            <div className="flex items-center border border-border rounded-full p-1 hover:shadow-md transition-shadow">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-full p-2">
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 max-h-[80vh] overflow-y-auto">
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
                  <DropdownMenuItem
                    onClick={() => router.push("/special-offers")}
                    className="bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-b border-green-300 relative overflow-hidden special-offers-glow"
                  >
                    <span className="relative z-10 font-semibold text-[#477023]">✨ Special Offers</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/cabins")}>All Cabins</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/activities")}>Activities</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/attractions")}>Attractions</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/other-areas")} className="max-sm:flex! sm:hidden!">Other Areas</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/directions")}>Directions</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/events")}>Events</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/experiences")}>Experiences</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/holidays")}>Holidays</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/journeys")}>Journeys</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/restaurants")}>Restaurants</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/ski-guide")}>Ski Guide</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/blog")}>Blog</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/about")}>About Big Bear</DropdownMenuItem>
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
              {session?.user && (
                <Button variant="ghost" size="sm" className="rounded-full p-2" onClick={() => router.push("/profile")}>
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
      <SearchFilterDrawer isOpen={isSearchFilterDrawerOpen} onClose={toggleSearchFilterDrawer} />
    </header>
  );
}