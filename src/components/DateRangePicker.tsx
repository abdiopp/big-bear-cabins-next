"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "./ui/utils";
import { DateRange } from "react-day-picker";

interface DateRangePickerProps {
  checkInDate?: Date;
  checkOutDate?: Date;
  onDateRangeSelect: (checkIn: Date | undefined, checkOut: Date | undefined) => void;
  className?: string;
}

export function DateRangePicker({
  checkInDate,
  checkOutDate,
  onDateRangeSelect,
  className
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [range, setRange] = useState<DateRange | undefined>({
    from: checkInDate,
    to: checkOutDate
  });

  const nextMonth = new Date(currentMonth);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const handleRangeSelect = (selectedRange: DateRange | undefined) => {
    setRange(selectedRange);

    if (selectedRange?.from && selectedRange?.to) {
      onDateRangeSelect(selectedRange.from, selectedRange.to);
      // Small delay before closing to show the selection
      setTimeout(() => setIsOpen(false), 200);
    } else if (selectedRange?.from) {
      onDateRangeSelect(selectedRange.from, undefined);
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className={cn("flex rounded-full cursor-pointer hover:shadow-md transition-shadow", className)}>
          {/* Check in section */}
          <div className="flex-1 px-4 py-2 border-r border-border hover:bg-gray-50 transition-colors rounded-l-full min-w-0 px-[35px] py-[8px]">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-medium text-foreground mb-0.5">
                  Check in
                </label>
                <div className="text-sm text-muted-foreground w-full text-left truncate">
                  {checkInDate ? format(checkInDate, "MMM d") : "Add dates"}
                </div>
              </div>
            </div>
          </div>

          {/* Check out section */}
          <div className="flex-1 px-4 py-2 border-r border-border hover:bg-gray-50 transition-colors min-w-0 px-[35px] py-[8px]">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-medium text-foreground mb-0.5">
                  Check out
                </label>
                <div className="text-sm text-muted-foreground w-full text-left truncate">
                  {checkOutDate ? format(checkOutDate, "MMM d") : "Add dates"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent
        className="w-auto p-0 bg-white shadow-lg rounded-3xl border border-gray-200 calendar-popup-enter"
        align="start"
        sideOffset={8}
      >
        <div className="px-[30px] py-[24px]">
          {/* Header with tabs */}
          <div className="flex justify-center mb-6">
            <div className="flex bg-gray-100 rounded-full p-1">
              <Button
                variant="ghost"
                size="sm"
                className="bg-black text-white rounded-full px-6 py-1 text-sm font-medium"
              >
                Dates
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-black rounded-full px-6 py-1 text-sm font-medium"
              >
                Months
              </Button>
            </div>
          </div>

          {/* Calendar Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex space-x-6">
              <div className="w-[252px] flex justify-center">
                <h3 className="font-semibold text-lg">
                  {format(currentMonth, "MMMM yyyy")}
                </h3>
              </div>
              <div className="w-[252px] flex justify-center">
                <h3 className="font-semibold text-lg">
                  {format(nextMonth, "MMMM yyyy")}
                </h3>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Double Calendar with Range Selection */}
          <div className="flex space-x-6">
            <Calendar
              mode="range"
              selected={range}
              onSelect={handleRangeSelect}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today;
              }}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="border-0"
              classNames={{
                months: "flex",
                month: "space-y-4",
                caption: "hidden",
                nav: "hidden",
                month_caption: "hidden",
                caption_label: "hidden",
                head_row: "flex justify-center",
                head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] text-center py-2 flex items-center justify-center",
                row: "flex w-full mt-2 justify-center",
                cell: "h-9 w-9 text-center text-sm p-0 relative flex items-center justify-center [&:has([aria-selected].day-range-end)]:rounded-r-full [&:has([aria-selected].day-range-start)]:rounded-l-full first:[&:has([aria-selected])]:rounded-l-full last:[&:has([aria-selected])]:rounded-r-full focus-within:relative focus-within:z-20",
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 rounded-full transition-all duration-300 ease-in-out flex items-center justify-center relative",
                day_range_start: "bg-black text-white hover:bg-black hover:text-white focus:bg-black focus:text-white rounded-full ring-2 ring-black ring-offset-2",
                day_range_end: "bg-black text-white hover:bg-black hover:text-white focus:bg-black focus:text-white rounded-full ring-2 ring-black ring-offset-2",
                day_selected: "bg-black text-white hover:bg-black hover:text-white focus:bg-black focus:text-white rounded-full ring-2 ring-black ring-offset-2",
                day_today: "bg-gray-100 text-black font-semibold flex items-center justify-center",
                day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle: "aria-selected:bg-gray-100 aria-selected:text-black hover:bg-gray-200",
                day_hidden: "invisible",
              }}
            />

            <Calendar
              mode="range"
              selected={range}
              onSelect={handleRangeSelect}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today;
              }}
              month={nextMonth}
              className="border-0"
              classNames={{
                months: "flex",
                month: "space-y-4",
                caption: "hidden",
                nav: "hidden",
                month_caption: "hidden",
                caption_label: "hidden",
                head_row: "flex justify-center",
                head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] text-center py-2 flex items-center justify-center",
                row: "flex w-full mt-2 justify-center",
                cell: "h-9 w-9 text-center text-sm p-0 relative flex items-center justify-center [&:has([aria-selected].day-range-end)]:rounded-r-full [&:has([aria-selected].day-range-start)]:rounded-l-full first:[&:has([aria-selected])]:rounded-l-full last:[&:has([aria-selected])]:rounded-r-full focus-within:relative focus-within:z-20",
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 rounded-full transition-all duration-300 ease-in-out flex items-center justify-center relative",
                day_range_start: "bg-black text-white hover:bg-black hover:text-white focus:bg-black focus:text-white rounded-full ring-2 ring-black ring-offset-2",
                day_range_end: "bg-black text-white hover:bg-black hover:text-white focus:bg-black focus:text-white rounded-full ring-2 ring-black ring-offset-2",
                day_selected: "bg-black text-white hover:bg-black hover:text-white focus:bg-black focus:text-white rounded-full ring-2 ring-black ring-offset-2",
                day_today: "bg-gray-100 text-black font-semibold flex items-center justify-center",
                day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle: "aria-selected:bg-gray-100 aria-selected:text-black hover:bg-gray-200",
                day_hidden: "invisible",
              }}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}