"use client";

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Calendar } from 'lucide-react';
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
    const checkIn = checkInDate ? checkInDate.toISOString().split('T')[0] : '';
    const checkOut = checkOutDate ? checkOutDate.toISOString().split('T')[0] : '';

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
    const [phone, setPhone] = useState('');
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
                couponCode: couponCode || undefined
            });
        }
    }, [checkIn, checkOut, totalOccupants, propertyId, couponCode, calculatePrice]);

    const handleCheckAvailability = async () => {
        if (!checkIn || !checkOut) {
            alert('Please select check-in and check-out dates');
            return;
        }
        await verifyAvailability();
    };

    const handleBookNow = () => {
        if (!checkIn || !checkOut) {
            alert('Please select check-in and check-out dates');
            return;
        }
        setShowBookingForm(true);
    };

    const handleSubmitReservation = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!firstName || !lastName || !email || !zip) {
            alert('Please fill in all required fields');
            return;
        }

        const result = await createReservation({
            unitId: propertyId,
            startDate: checkIn,
            endDate: checkOut,
            email,
            occupants: totalOccupants,
            firstName,
            lastName,
            zip,
            phone: phone || undefined,
            couponCode: couponCode || undefined
        });

        if (result) {
            setShowBookingForm(false);
            alert(`Reservation confirmed! Confirmation ID: ${result.confirmation_id}`);
        }
    };

    // Calculate nights
    const nights = checkIn && checkOut
        ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
        : 0;

    if (currentReservation) {
        return (
            <Card className="p-6 shadow-lg border border-gray-200">
                <CardContent className="p-0 space-y-4">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Booking Confirmed!</h3>
                        <p className="text-gray-600">Confirmation ID: {currentReservation.confirmation_id}</p>
                    </div>
                    <Separator />
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Property</span>
                            <span className="font-medium">{propertyName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Check-in</span>
                            <span>{currentReservation.startdate}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Check-out</span>
                            <span>{currentReservation.enddate}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (showBookingForm) {
        return (
            <Card className="p-6 shadow-lg border border-gray-200">
                <CardContent className="p-0 space-y-4">
                    <h3 className="text-lg font-semibold">Complete Your Booking</h3>

                    <form onSubmit={handleSubmitReservation} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label htmlFor="firstName">First Name *</Label>
                                <Input
                                    id="firstName"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="lastName">Last Name *</Label>
                                <Input
                                    id="lastName"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="zip">ZIP Code *</Label>
                                <Input
                                    id="zip"
                                    value={zip}
                                    onChange={(e) => setZip(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">{nights} night{nights > 1 ? 's' : ''}</span>
                                <span>${price?.total || (basePrice * nights)}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-lg">
                                <span>Total</span>
                                <span>${price?.total || (basePrice * nights)}</span>
                            </div>
                        </div>

                        {reservationError && (
                            <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
                                {reservationError}
                            </div>
                        )}

                        <div className="flex space-x-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={() => setShowBookingForm(false)}
                            >
                                Back
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 text-white"
                                style={{ backgroundColor: '#477023' }}
                                disabled={reservationLoading}
                            >
                                {reservationLoading ? 'Booking...' : 'Confirm Booking'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="sticky top-6">
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
                            <div className="p-3 border-r border-gray-300">
                                <div className="text-xs font-medium text-gray-700 uppercase">Check-in</div>
                                <Input
                                    type="date"
                                    value={checkIn}
                                    onChange={(e) => {
                                        const newDate = e.target.value ? new Date(e.target.value) : undefined;
                                        onDateChange?.({ from: newDate, to: checkOutDate });
                                    }}
                                    className="border-0 p-0 h-auto text-sm focus:ring-0"
                                    min={new Date().toISOString().split('T')[0]}
                                    onClick={onDateClick}
                                />
                            </div>
                            <div className="p-3">
                                <div className="text-xs font-medium text-gray-700 uppercase">Checkout</div>
                                <Input
                                    type="date"
                                    value={checkOut}
                                    onChange={(e) => {
                                        const newDate = e.target.value ? new Date(e.target.value) : undefined;
                                        onDateChange?.({ from: checkInDate, to: newDate });
                                    }}
                                    className="border-0 p-0 h-auto text-sm focus:ring-0"
                                    min={checkIn || new Date().toISOString().split('T')[0]}
                                    onClick={onDateClick}
                                />
                            </div>
                        </div>
                        <div className="p-3 border-t border-gray-300">
                            <GuestSelector
                                initialCounts={guestCounts}
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
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">${price.average_nightly_rate} × {price.nights} nights</span>
                                        <span>${price.subtotal}</span>
                                    </div>
                                    {price.fees.map((fee, index) => (
                                        <div key={index} className="flex justify-between">
                                            <span className="text-gray-600">{fee.name}</span>
                                            <span>${fee.amount}</span>
                                        </div>
                                    ))}
                                    <Separator />
                                    <div className="flex justify-between font-semibold">
                                        <span>Total before taxes</span>
                                        <span>${price.total - price.taxes}</span>
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
