"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "./ui/utils";

interface DatePickerProps {
  label: string;
  placeholder: string;
  value?: Date;
  onSelect: (date: Date | undefined) => void;
  className?: string;
  disabled?: (date: Date) => boolean;
}

export function DatePicker({ 
  label, 
  placeholder, 
  value, 
  onSelect, 
  className,
  disabled 
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const nextMonth = new Date(currentMonth);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const handleDateSelect = (date: Date | undefined) => {
    onSelect(date);
    setIsOpen(false);
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
        <div className={cn("flex-1 px-4 py-2 border-r border-border cursor-pointer hover:bg-gray-50 transition-colors", className)}>
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <label className="block text-xs font-medium text-foreground mb-0.5">
                {label}
              </label>
              <div className="text-sm text-muted-foreground w-full text-left">
                {value ? format(value, "MMM d") : placeholder}
              </div>
            </div>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 bg-white shadow-lg rounded-3xl border border-gray-200" 
        align="start"
        sideOffset={8}
      >
        <div className="p-6">
          {/* Header with tabs */}
          <div className="flex justify-center mb-6">
            <div className="flex bg-gray-100 rounded-full p-1">
              <Button 
                variant="ghost" 
                size="sm"
                className="bg-black text-white rounded-full px-4 py-1 text-sm font-medium"
              >
                Dates
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-600 hover:text-black rounded-full px-4 py-1 text-sm font-medium"
              >
                Months
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-600 hover:text-black rounded-full px-4 py-1 text-sm font-medium"
              >
                Flexible
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
            
            <div className="flex space-x-8">
              <h3 className="font-semibold text-lg">
                {format(currentMonth, "MMMM yyyy")}
              </h3>
              <h3 className="font-semibold text-lg">
                {format(nextMonth, "MMMM yyyy")}
              </h3>
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

          {/* Double Calendar */}
          <div className="flex space-x-8">
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleDateSelect}
              disabled={disabled}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="border-0"
              classNames={{
                months: "flex",
                month: "space-y-4",
                caption: "hidden",
                head_row: "flex",
                head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] text-center py-2",
                row: "flex w-full mt-2",
                cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 rounded-full transition-colors",
                day_selected: "bg-black text-white hover:bg-black hover:text-white focus:bg-black focus:text-white rounded-full",
                day_today: "bg-gray-100 text-black font-semibold",
                day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
            />
            
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleDateSelect}
              disabled={disabled}
              month={nextMonth}
              className="border-0"
              classNames={{
                months: "flex",
                month: "space-y-4",
                caption: "hidden",
                head_row: "flex",
                head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] text-center py-2",
                row: "flex w-full mt-2",
                cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 rounded-full transition-colors",
                day_selected: "bg-black text-white hover:bg-black hover:text-white focus:bg-black focus:text-white rounded-full",
                day_today: "bg-gray-100 text-black font-semibold",
                day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}