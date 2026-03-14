"use client";

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Navigation } from 'lucide-react';

function SuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const confirmationId = searchParams.get('confirmation_id');
    const propertyId = searchParams.get('propertyId');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const adults = searchParams.get('adults');
    const children = searchParams.get('children');
    const price = searchParams.get('price');
    const nights = searchParams.get('nights');

    if (!confirmationId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold mb-2">Booking Not Found</h1>
                    <p className="text-gray-600 mb-6">We couldn't find your booking confirmation details.</p>
                    <Button onClick={() => router.push('/')}>Return Home</Button>
                </div>
            </div>
        );
    }

    const totalGuests = parseInt(adults || '0') + parseInt(children || '0');

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-700" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
                    <p className="text-lg text-gray-600">
                        Thank you for your reservation. A confirmation email has been sent to your inbox.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 border border-gray-100">
                    <div className="bg-[#477023] px-6 py-4 text-white">
                        <div className="text-sm font-medium opacity-90 mb-1">Booking Reference Number</div>
                        <div className="text-2xl font-bold tracking-wider">{confirmationId}</div>
                    </div>

                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Reservation Details</h2>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600 font-medium">Arrival</span>
                                <span className="text-gray-900 font-semibold">{checkIn}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600 font-medium">Departure</span>
                                <span className="text-gray-900 font-semibold">{checkOut}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600 font-medium">Duration</span>
                                <span className="text-gray-900">{nights} night{parseInt(nights || '0') !== 1 ? 's' : ''}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600 font-medium">Guests</span>
                                <span className="text-gray-900">{totalGuests} guest{totalGuests !== 1 ? 's' : ''}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600 font-medium">Total Paid</span>
                                <span className="text-gray-900 font-bold text-lg">${parseFloat(price || '0').toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button 
                        onClick={() => router.push('/profile?tab=past-bookings')}
                        className="w-full sm:w-auto px-8 py-6 text-base font-semibold text-white transition-transform hover:-translate-y-0.5 shadow-md"
                        style={{ backgroundColor: '#477023' }}
                    >
                        View My Bookings
                    </Button>
                    <Button 
                        onClick={() => router.push('/')}
                        variant="outline"
                        className="w-full sm:w-auto px-8 py-6 text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 border-gray-300 transition-transform hover:-translate-y-0.5 shadow-sm"
                    >
                        Return Home
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="text-gray-600">Loading your confirmation...</div></div>}>
            <SuccessContent />
        </Suspense>
    );
}
