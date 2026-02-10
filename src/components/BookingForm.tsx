"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Calendar } from 'lucide-react';

import { format } from "date-fns";
import { toast } from "sonner";
import { useReservationPrice } from '@/hooks/useReservationPrice';
import { useAvailability } from '@/hooks/useAvailability';
import { useReservations } from '@/hooks/useReservations';
import { GuestSelector, GuestCounts } from './GuestSelector';

interface BookingFormProps {
    propertyId: number;
    propertyName: string;
    basePrice: number;
    maxGuests: number;
    checkInDate?: Date;
    checkOutDate?: Date;
    onDateChange?: (range: { from?: Date; to?: Date }) => void;
    onDateClick?: () => void;
}

export function BookingForm({
    propertyId,
    propertyName,
    basePrice,
    maxGuests,
    checkInDate,
    checkOutDate,
    onDateChange,
    onDateClick
}: BookingFormProps) {
    // Local state for formatted string dates (sync with props)
    // Use date-fns format to preserve local date instead of converting to UTC
    const checkIn = checkInDate ? format(checkInDate, 'yyyy-MM-dd') : '';
    const checkOut = checkOutDate ? format(checkOutDate, 'yyyy-MM-dd') : '';

    const [guestCounts, setGuestCounts] = useState<GuestCounts>({
        adults: 1,
        children: 0,
        infants: 0,
        pets: 0
    });

    // Derived total for API calls that only take 'occupants'
    const totalOccupants = guestCounts.adults + guestCounts.children;

    const [couponCode, setCouponCode] = useState('');
    const [showBookingForm, setShowBookingForm] = useState(false);


    // Guest info for reservation
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [cellPhone, setCellPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');

    const { price, loading: priceLoading, error: priceError, calculatePrice } = useReservationPrice();
    const { isAvailable, verifyAvailability, loading: availabilityLoading } = useAvailability({
        unitId: propertyId,
        startDate: checkIn,
        endDate: checkOut,
        occupants: totalOccupants,
        adults: guestCounts.adults,
        children: guestCounts.children,
        pets: guestCounts.pets,
        autoFetch: false
    });
    const { createReservation, loading: reservationLoading, error: reservationError, currentReservation } = useReservations();

    // Calculate price when dates change
    useEffect(() => {
        if (checkIn && checkOut && propertyId) {
            calculatePrice({
                unitId: propertyId,
                startDate: checkIn,
                endDate: checkOut,
                occupants: totalOccupants,
                occupants_small: guestCounts.children,
                pets: guestCounts.pets,
                couponCode: couponCode || undefined
            });
        }
    }, [checkIn, checkOut, totalOccupants, propertyId, couponCode, calculatePrice]);

    const handleCheckAvailability = async () => {
        if (!checkIn || !checkOut) {
            toast.error('Please select check-in and check-out dates');
            return;
        }
        await verifyAvailability();
    };

    const router = useRouter();
    const handleBookNow = () => {
        if (!checkIn || !checkOut) {
            toast.error('Please select check-in and check-out dates');
            return;
        }

        const params = new URLSearchParams({
            propertyId: propertyId.toString(),
            checkIn,
            checkOut,
            adults: guestCounts.adults.toString(),
            children: guestCounts.children.toString(),
            pets: guestCounts.pets.toString()
        });

        router.push(`/checkout?${params.toString()}`);
    };

    // Calculate nights
    const nights = checkIn && checkOut
        ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
        : 0;

    return (
        <div className="sticky top-28">
            {/* All Fees Included Badge */}
            <div className="flex justify-center mb-4">
                <Badge className="bg-black text-white px-6 py-3 text-sm font-medium">
                    All fees included
                </Badge>
            </div>

            <Card className="p-6 shadow-lg border border-gray-200">
                <CardContent className="p-0 space-y-4">
                    {/* Price */}
                    <div className="flex items-baseline space-x-1">
                        <span className="text-2xl font-semibold">${basePrice}</span>
                        <span className="text-gray-600">night</span>
                    </div>

                    {/* Dates and Guests */}
                    <div className="border border-gray-300 rounded-lg">
                        <div className="grid grid-cols-2">
                            <div
                                className="p-3 border-r border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={onDateClick}
                            >
                                <div className="text-xs font-medium text-gray-700 uppercase">CHECK-IN</div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className={checkIn ? "text-gray-900" : "text-gray-400"}>
                                        {checkIn ? new Date(checkIn + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "dd/mm/yyyy"}
                                    </span>
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                </div>
                            </div>
                            <div
                                className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={onDateClick}
                            >
                                <div className="text-xs font-medium text-gray-700 uppercase">CHECKOUT</div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className={checkOut ? "text-gray-900" : "text-gray-400"}>
                                        {checkOut ? new Date(checkOut + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "dd/mm/yyyy"}
                                    </span>
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                </div>
                            </div>
                        </div>
                        <div className="p-3 border-t border-gray-300">
                            <GuestSelector
                                counts={guestCounts}
                                onGuestCountChange={setGuestCounts}
                                className="p-0 hover:bg-transparent"
                            />
                        </div>
                    </div>

                    {/* Coupon Code */}
                    <div>
                        <Input
                            type="text"
                            placeholder="Coupon code (optional)"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="text-sm"
                        />
                    </div>

                    {/* Availability Status */}
                    {isAvailable !== null && (
                        <div className={`text-sm p-2 rounded ${isAvailable ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {isAvailable ? '✓ Dates are available!' : '✗ Dates not available'}
                        </div>
                    )}

                    {/* Check Availability Button */}
                    {checkIn && checkOut && isAvailable === null && (
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={handleCheckAvailability}
                            disabled={availabilityLoading}
                        >
                            {availabilityLoading ? 'Checking...' : 'Check Availability'}
                        </Button>
                    )}

                    {/* Book Button */}
                    <Button
                        className="w-full text-white py-3 font-medium"
                        style={{ backgroundColor: '#477023' }}
                        onClick={handleBookNow}
                        disabled={!checkIn || !checkOut || isAvailable === false}
                    >
                        Let's Book!
                    </Button>

                    {/* Fee Breakdown */}
                    {nights > 0 && (
                        <div className="space-y-2 text-sm">
                            {priceLoading ? (
                                <div className="animate-pulse space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                </div>
                            ) : priceError ? (
                                <>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">${basePrice} × {nights} nights</span>
                                        <span>${basePrice * nights}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Cleaning fee</span>
                                        <span>$50</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Service fee</span>
                                        <span>$75</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-semibold">
                                        <span>Total before taxes</span>
                                        <span>${basePrice * nights + 50 + 75}</span>
                                    </div>
                                </>
                            ) : price ? (
                                <>
                                    {/* Nightly Rate */}
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">${price.average_nightly_rate.toFixed(2)} × {price.nights} nights</span>
                                        <span>${price.subtotal.toFixed(2)}</span>
                                    </div>

                                    {/* Taxes and Fees (Calculated as Total - Subtotal) */}
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Taxes and Fees</span>
                                        <span>${(price.total - price.subtotal).toFixed(2)}</span>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between font-semibold">
                                        <span>Total Price</span>
                                        <span>${price.total.toFixed(2)}</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">${basePrice} × {nights} nights</span>
                                        <span>${basePrice * nights}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-semibold">
                                        <span>Estimate</span>
                                        <span>${basePrice * nights}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
