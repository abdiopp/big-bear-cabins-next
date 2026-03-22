
import {
    Search,
} from "lucide-react";
import { DateRangePicker } from "../DateRangePicker";
import { GuestSelector } from "../GuestSelector";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchFilterDrawer({ isOpen, onClose }: DrawerProps) {
    const router = useRouter();
    const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
    const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
    const [guestCounts, setGuestCounts] = useState({
        adults: 0,
        children: 0,
        pets: false,
    });

    // Background Scroll Lock
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const handleDateRangeSelect = (checkIn: Date | undefined, checkOut: Date | undefined) => {
        setCheckInDate(checkIn);
        setCheckOutDate(checkOut);
    };

    const handleGuestCountChange = (counts: { adults: number; children: number; pets: boolean }) => {
        setGuestCounts(counts);
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

        if (checkInDate) {
            searchParams.set("checkIn", formatDateForApi(checkInDate));
        }
        if (checkOutDate) {
            searchParams.set("checkOut", formatDateForApi(checkOutDate));
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

        router.push(`/search?${searchParams.toString()}`);
    };


    return (
        <>
            {/* 1. Backdrop - Smooth Fade */}
            <div
                className={`fixed inset-0 bg-black/60 z-[60] transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                onClick={onClose}
            />

            {/* 2. Main Drawer Panel - Right Side Slide */}
            <div
                className={`fixed top-0 right-0 h-full bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out
                w-full max-w-[340px] 
                /* Animation: Slide from right (100% to 0) */
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                {/* Drawer Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-bold text-gray-800 tracking-tight">Filters</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-all active:scale-90"
                    >
                        <svg
                            className="w-6 h-6 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Drawer Content */}
                <div className="p-6 overflow-y-auto h-[calc(100%-140px)] space-y-3">
                    <div className="bg-white rounded-lg shadow-sm border p-1">
                        {/* Date Range Picker */}
                        <DateRangePicker
                            checkInDate={checkInDate}
                            checkOutDate={checkOutDate}
                            onDateRangeSelect={handleDateRangeSelect}
                        />
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border">
                        <GuestSelector counts={guestCounts} onGuestCountChange={handleGuestCountChange} />
                    </div>
                </div>

                {/* Drawer Footer */}
                <div className="absolute bottom-0 right-0 w-full p-6 bg-white border-t border-gray-100">
                    <button
                        onClick={handleSearch}
                        className="bg-black text-white py-2.5 w-full rounded-lg font-semibold shadow-lg hover:bg-gray-800 active:scale-[0.97] transition-all"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </>
    );
}