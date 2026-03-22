"use client";

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, Check, Calendar, CreditCard, Lock } from 'lucide-react';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { useProperty } from '@/hooks/useProperty';
import { useReservationPrice } from '@/hooks/useReservationPrice';
import { useReservations } from '@/hooks/useReservations';
import { toast } from 'sonner';

interface CheckoutFormData {
    // Step 1
    firstName: string;
    lastName: string;
    email: string;
    phone: string;

    // Step 2
    travelInsurance: 'basic' | 'premium' | 'declined' | '';
    petFee: boolean;

    // Step 3
    homeAddress: string;
    country: string;
    city: string;
    state: string;
    zip: string;
    paymentType: string;
    creditCard: string;
    cvv: string;
    expiration: string;
    promoCode: string;
    notes: string;
    acceptTerms: boolean;
    heardAboutUs: string;
}

const US_STATES = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
];

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const propertyId = searchParams.get('propertyId');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const adults = parseInt(searchParams.get('adults') || '1');
    const children = parseInt(searchParams.get('children') || '0');
    const petsParam = searchParams.get('pets') || '0';
    const pets = petsParam === 'true' ? 1 : petsParam === 'false' ? 0 : parseInt(petsParam) || 0;

    const { property, loading: propertyLoading } = useProperty(propertyId || '');
    const { price, calculatePrice, loading: priceLoading } = useReservationPrice();
    const { createReservation, loading: reservationLoading } = useReservations();

    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<CheckoutFormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        travelInsurance: '',
        petFee: pets > 0, // Auto-select if pets are present
        homeAddress: '',
        country: 'UNITED STATES',
        city: '',
        state: '',
        zip: '',
        paymentType: '',
        creditCard: '',
        cvv: '',
        expiration: '',
        promoCode: '',
        notes: '',
        acceptTerms: false,
        heardAboutUs: '',
    });

    // Get selected optional fee IDs based on insurance choice
    const getSelectedOptionalFeeIds = useCallback((): string[] => {
        if (!price?.optional_fees) return [];
        const ids: string[] = [];
        if (formData.travelInsurance === 'basic') {
            const travelIns = price.optional_fees.find((f: any) => f.type === 'travel_insurance');
            if (travelIns) ids.push(travelIns.id);
        } else if (formData.travelInsurance === 'premium') {
            const cfarIns = price.optional_fees.find((f: any) => f.type === 'cancel_any_reason');
            if (cfarIns) ids.push(cfarIns.id);
        }
        return ids;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.travelInsurance, price?.optional_fees]);

    // Compute the additional amount from selected optional fees (client-side, instant update)
    const selectedOptionalFeeTotal = React.useMemo(() => {
        if (!price?.optional_fees || price.optional_fees.length === 0) return 0;
        if (!formData.travelInsurance || formData.travelInsurance === 'declined') return 0;
        if (formData.travelInsurance === 'basic') {
            const fee = price.optional_fees.find((f: any) => f.type === 'travel_insurance');
            return fee ? fee.amount : 0;
        }
        if (formData.travelInsurance === 'premium') {
            const fee = price.optional_fees.find((f: any) => f.type === 'cancel_any_reason');
            return fee ? fee.amount : 0;
        }
        return 0;
    }, [formData.travelInsurance, price?.optional_fees]);

    // Display total: API total + any selected optional fees (updates instantly on insurance toggle)
    const displayTotal = React.useMemo(() => {
        if (!price) return 0;
        return price.total + selectedOptionalFeeTotal;
    }, [price, selectedOptionalFeeTotal]);

    // Effective pets count: from URL param OR petFee checkbox
    const effectivePets = formData.petFee ? Math.max(pets, 1) : pets;

    // Calculate price — when core booking params OR pet fee checkbox changes
    useEffect(() => {
        if (propertyId && checkIn && checkOut) {
            calculatePrice({
                unitId: parseInt(propertyId),
                startDate: checkIn,
                endDate: checkOut,
                occupants: adults + children,
                occupants_small: children,
                pets: effectivePets,
                couponCode: formData.promoCode || undefined
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [propertyId, checkIn, checkOut, adults, children, effectivePets, formData.promoCode]);

    const updateFormData = (field: keyof CheckoutFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateStep1 = () => {
        return (
            formData.firstName.trim() !== '' &&
            formData.lastName.trim() !== '' &&
            formData.email.trim() !== '' &&
            formData.phone.trim() !== ''
        );
    };

    const validateStep2 = () => {
        return formData.travelInsurance !== '';
    };

    const validateStep3 = () => {
        return (
            formData.homeAddress.trim() !== '' &&
            formData.city.trim() !== '' &&
            formData.state !== '' &&
            formData.zip.trim() !== '' &&
            formData.paymentType !== '' &&
            formData.creditCard.trim() !== '' &&
            formData.cvv.trim() !== '' &&
            formData.expiration.trim() !== '' &&
            formData.heardAboutUs.trim() !== '' &&
            formData.acceptTerms
        );
    };

    const handleNextStep = () => {
        if (currentStep === 1 && !validateStep1()) {
            toast.error('Please fill in all required fields');
            return;
        }
        if (currentStep === 2 && !validateStep2()) {
            toast.error('Please select a travel insurance option');
            return;
        }
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
            window.scrollTo(0, 0);
        }
    };

    const handlePreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            window.scrollTo(0, 0);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep3()) {
            toast.error('Please fill in all required fields and accept the Terms & Conditions');
            return;
        }

        if (!propertyId || !checkIn || !checkOut) {
            toast.error('Missing reservation details');
            return;
        }

        const selectedFeeIds = getSelectedOptionalFeeIds();

        const result = await createReservation({
            unitId: parseInt(propertyId),
            startDate: checkIn,
            endDate: checkOut,
            email: formData.email,
            occupants: adults + children,
            occupantsSmall: children,
            pets: pets,
            firstName: formData.firstName,
            lastName: formData.lastName,
            zip: formData.zip,
            address: formData.homeAddress,
            city: formData.city,
            state: formData.state,
            cellPhone: formData.phone,
            couponCode: formData.promoCode || undefined,
            creditCard: formData.creditCard,
            cvv: formData.cvv,
            expiration: formData.expiration,
            notes: formData.notes || undefined,
            optionalFeeIds: selectedFeeIds,
            heardAboutUs: formData.heardAboutUs
        });

        if (result && result.confirmation_id) {
            toast.success(`Booking Submitted! Confirmation ID: ${result.confirmation_id}`);
            
            // Redirect to success page with query params
            const successParams = new URLSearchParams({
                confirmation_id: result.confirmation_id.toString(),
                propertyId: propertyId.toString(),
                checkIn: checkIn,
                checkOut: checkOut,
                adults: adults.toString(),
                children: children.toString(),
                price: displayTotal.toString(),
                nights: nights.toString()
            });
            
            router.push(`/checkout/success?${successParams.toString()}`);
        }
    };

    if (!propertyId || !checkIn || !checkOut) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold mb-2">Invalid Booking Details</h1>
                    <p className="text-gray-600 mb-6">Please start your booking from a property page.</p>
                    <Button onClick={() => router.push('/')}>Return Home</Button>
                </div>
            </div>
        );
    }

    // Calculate nights
    const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="mb-4 flex items-center space-x-2"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back</span>
                    </Button>
                    <h1 className="text-3xl font-semibold text-gray-900">Complete Your Booking</h1>
                    <p className="text-gray-600 mt-2">{property?.title || 'Loading property...'}</p>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-center space-x-4">
                        {[1, 2, 3].map((step) => (
                            <React.Fragment key={step}>
                                <div className="flex items-center">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${currentStep > step
                                            ? 'bg-green-600 text-white'
                                            : currentStep === step
                                                ? 'bg-green-700 text-white'
                                                : 'bg-gray-200 text-gray-600'
                                            }`}
                                    >
                                        {currentStep > step ? <Check className="w-5 h-5" /> : step}
                                    </div>
                                    <span className="ml-2 text-sm font-medium text-gray-700">
                                        {step === 1 && 'Guest Info'}
                                        {step === 2 && 'Insurance'}
                                        {step === 3 && 'Payment'}
                                    </span>
                                </div>
                                {step < 3 && (
                                    <div
                                        className={`w-16 h-0.5 ${currentStep > step ? 'bg-green-600' : 'bg-gray-200'
                                            }`}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Form */}
                    <div className="lg:col-span-2">
                        <Card className="p-6 shadow-md">
                            <CardContent className="p-0">
                                <form onSubmit={handleSubmit}>
                                    {/* Step 1: Guest Information */}
                                    {currentStep === 1 && (
                                        <div className="space-y-6">
                                            <div>
                                                <h2 className="text-xl font-semibold mb-4">Guest Information</h2>
                                                <p className="text-gray-600 text-sm mb-6">
                                                    Please provide your contact details
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="firstName">
                                                        First Name <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        id="firstName"
                                                        placeholder="First Name"
                                                        value={formData.firstName}
                                                        onChange={(e) => updateFormData('firstName', e.target.value)}
                                                        required
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="lastName">
                                                        Last Name <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        id="lastName"
                                                        placeholder="Last Name"
                                                        value={formData.lastName}
                                                        onChange={(e) => updateFormData('lastName', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email">
                                                    Email <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="your.email@example.com"
                                                    value={formData.email}
                                                    onChange={(e) => updateFormData('email', e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="phone">
                                                    Phone <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    placeholder="(123) 456-7890"
                                                    value={formData.phone}
                                                    onChange={(e) => updateFormData('phone', e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <div className="flex justify-end mt-8">
                                                <Button
                                                    type="button"
                                                    onClick={handleNextStep}
                                                    className="text-white px-8 py-3"
                                                    style={{ backgroundColor: '#477023' }}
                                                >
                                                    Continue to Insurance
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 2: Travel Insurance */}
                                    {currentStep === 2 && (
                                        <div className="space-y-6">
                                            <div>
                                                <h2 className="text-xl font-semibold mb-4">Travel Insurance</h2>
                                                <p className="text-gray-600 text-sm mb-6">
                                                    Protect your travel investment
                                                </p>
                                            </div>

                                            <div className="space-y-4">
                                                {/* Basic Travel Insurance */}
                                                <div
                                                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${formData.travelInsurance === 'basic' ? 'border-green-700 bg-green-50' : 'border-gray-200 hover:border-green-700'}`}
                                                    onClick={() => updateFormData('travelInsurance', 'basic')}
                                                >
                                                    <div className="flex items-start space-x-3">
                                                        <div className={`mt-1 w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center ${formData.travelInsurance === 'basic' ? 'border-green-700 bg-green-700' : ''}`}>
                                                            {formData.travelInsurance === 'basic' && <Check className="w-3 h-3 text-white" />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <Label
                                                                className="text-base font-medium cursor-pointer"
                                                            >
                                                                Travel Insurance
                                                                {price?.optional_fees?.find((f: any) => f.type === 'travel_insurance') && (
                                                                    <span className="text-green-700 ml-2">
                                                                        — ${price.optional_fees.find((f: any) => f.type === 'travel_insurance')?.amount.toFixed(2)}
                                                                    </span>
                                                                )}
                                                            </Label>
                                                            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                                                                PROTECT my travel investment with Travel Insurance. Coverage protects
                                                                my vacation investment up to 100% for covered reasons like illness,
                                                                injury, natural disasters, travel delays and more.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Premium Travel Insurance */}
                                                <div
                                                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${formData.travelInsurance === 'premium' ? 'border-green-700 bg-green-50' : 'border-gray-200 hover:border-green-700'}`}
                                                    onClick={() => updateFormData('travelInsurance', 'premium')}
                                                >
                                                    <div className="flex items-start space-x-3">
                                                        <div className={`mt-1 w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center ${formData.travelInsurance === 'premium' ? 'border-green-700 bg-green-700' : ''}`}>
                                                            {formData.travelInsurance === 'premium' && <Check className="w-3 h-3 text-white" />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <Label
                                                                className="text-base font-medium cursor-pointer"
                                                            >
                                                                Cancel For Any Reason Travel Protection
                                                                {price?.optional_fees?.find((f: any) => f.type === 'cancel_any_reason') && (
                                                                    <span className="text-green-700 ml-2">
                                                                        — ${price.optional_fees.find((f: any) => f.type === 'cancel_any_reason')?.amount.toFixed(2)}
                                                                    </span>
                                                                )}
                                                            </Label>
                                                            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                                                                PROTECT my travel investment with Cancel For Any Reason Travel
                                                                Protection. Coverage protects my vacation investment up to 100% for
                                                                covered reasons like illness, natural disasters, travel delays and more.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Decline Insurance */}
                                                <div
                                                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${formData.travelInsurance === 'declined' ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-red-300'}`}
                                                    onClick={() => updateFormData('travelInsurance', 'declined')}
                                                >
                                                    <div className="flex items-start space-x-3">
                                                        <div className={`mt-1 w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center ${formData.travelInsurance === 'declined' ? 'border-red-500 bg-red-500' : ''}`}>
                                                            {formData.travelInsurance === 'declined' && <Check className="w-3 h-3 text-white" />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <Label
                                                                className="text-base font-medium cursor-pointer"
                                                            >
                                                                I DECLINE travel protection
                                                            </Label>
                                                            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                                                                I risk losing or forfeiting all or part of my paid and future investment
                                                                against this reservation.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <Separator className="my-6" />

                                                {/* Pet Fee */}
                                                <div className="border border-gray-200 rounded-lg p-4 hover:border-green-700 transition-colors">
                                                    <div className="flex items-start space-x-3">
                                                        <Checkbox
                                                            id="pet-fee"
                                                            checked={formData.petFee}
                                                            onCheckedChange={(checked) =>
                                                                updateFormData('petFee', checked as boolean)
                                                            }
                                                        />
                                                        <div className="flex-1">
                                                            <Label
                                                                htmlFor="pet-fee"
                                                                className="text-base font-medium cursor-pointer"
                                                            >
                                                                Pet Fee
                                                            </Label>
                                                            <p className="text-sm text-gray-600 mt-2">
                                                                Add a pet fee to your reservation (Required if bringing pets)
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between mt-8">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={handlePreviousStep}
                                                >
                                                    Back
                                                </Button>
                                                <Button
                                                    type="button"
                                                    onClick={handleNextStep}
                                                    className="text-white px-8 py-3"
                                                    style={{ backgroundColor: '#477023' }}
                                                >
                                                    Continue to Payment
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 3: Payment Information */}
                                    {currentStep === 3 && (
                                        <div className="space-y-6">
                                            <div>
                                                <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
                                                <p className="text-gray-600 text-sm mb-6">
                                                    Complete your booking details
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="homeAddress">
                                                    Home Address <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="homeAddress"
                                                    placeholder="Home Address"
                                                    value={formData.homeAddress}
                                                    onChange={(e) => updateFormData('homeAddress', e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="country">
                                                    Country <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="country"
                                                    value={formData.country}
                                                    disabled
                                                    className="bg-gray-100"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="city">
                                                        City <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        id="city"
                                                        placeholder="City Name"
                                                        value={formData.city}
                                                        onChange={(e) => updateFormData('city', e.target.value)}
                                                        required
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="state">
                                                        State <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Select
                                                        value={formData.state}
                                                        onValueChange={(value) => updateFormData('state', value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select State" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {US_STATES.map((state) => (
                                                                <SelectItem key={state} value={state}>
                                                                    {state}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="zip">
                                                    Zip <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="zip"
                                                    placeholder="Zip Code"
                                                    value={formData.zip}
                                                    onChange={(e) => updateFormData('zip', e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <Separator className="my-6" />

                                            <div className="space-y-2">
                                                <Label htmlFor="paymentType">
                                                    Payment Type <span className="text-red-500">*</span>
                                                </Label>
                                                <Select
                                                    value={formData.paymentType}
                                                    onValueChange={(value) => updateFormData('paymentType', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select payment type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="credit-card">Credit Card</SelectItem>
                                                        <SelectItem value="debit-card">Debit Card</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="md:col-span-3 space-y-2">
                                                    <Label htmlFor="creditCard">
                                                        Card Number <span className="text-red-500">*</span>
                                                    </Label>
                                                    <div className="relative">
                                                        <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                                        <Input
                                                            id="creditCard"
                                                            placeholder="0000 0000 0000 0000"
                                                            className="pl-10 font-mono bg-white"
                                                            maxLength={19}
                                                            value={formData.creditCard}
                                                            onChange={(e) => {
                                                                const value = e.target.value.replace(/\D/g, '');
                                                                const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
                                                                updateFormData('creditCard', formatted);
                                                            }}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="md:col-span-2 space-y-2">
                                                    <Label htmlFor="expiration">
                                                        Expiration <span className="text-red-500">*</span>
                                                    </Label>
                                                    <div className="relative">
                                                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                                        <Input
                                                            id="expiration"
                                                            placeholder="MM/YY"
                                                            className="pl-10 font-mono bg-white"
                                                            maxLength={5}
                                                            value={formData.expiration}
                                                            onChange={(e) => {
                                                                let value = e.target.value.replace(/\D/g, '');
                                                                if (value.length >= 2) {
                                                                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                                                                }
                                                                updateFormData('expiration', value);
                                                            }}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="md:col-span-1 space-y-2">
                                                    <Label htmlFor="cvv">
                                                        CVV <span className="text-red-500">*</span>
                                                    </Label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                                        <Input
                                                            id="cvv"
                                                            placeholder="123"
                                                            className="pl-10 font-mono bg-white"
                                                            maxLength={4}
                                                            value={formData.cvv}
                                                            onChange={(e) => updateFormData('cvv', e.target.value.replace(/\D/g, ''))}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="promoCode">Promo Code</Label>
                                                <Input
                                                    id="promoCode"
                                                    placeholder="Enter promo code"
                                                    value={formData.promoCode}
                                                    onChange={(e) => updateFormData('promoCode', e.target.value)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="notes">Notes / Booking Comments</Label>
                                                <Textarea
                                                    id="notes"
                                                    placeholder="Add any special requests or comments"
                                                    rows={4}
                                                    value={formData.notes}
                                                    onChange={(e) => updateFormData('notes', e.target.value)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="heardAboutUs">Where did you hear about us? <span className="text-red-500">*</span></Label>
                                                <Select
                                                    value={formData.heardAboutUs}
                                                    onValueChange={(value) => updateFormData('heardAboutUs', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select an option" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Social Media Ad (Facebook or Instagram)">Social Media Ad (Facebook or Instagram)</SelectItem>
                                                        <SelectItem value="Friend or Family Referral">Friend or Family Referral</SelectItem>
                                                        <SelectItem value="Email Newsletter">Email Newsletter</SelectItem>
                                                        <SelectItem value="Podcast">Podcast</SelectItem>
                                                        <SelectItem value="Google Search">Google Search</SelectItem>
                                                        <SelectItem value="Event or Conference">Event or Conference</SelectItem>
                                                        <SelectItem value="Other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="flex items-start space-x-3 pt-4">
                                                <Checkbox
                                                    id="terms"
                                                    checked={formData.acceptTerms}
                                                    onCheckedChange={(checked) =>
                                                        updateFormData('acceptTerms', checked as boolean)
                                                    }
                                                    required
                                                />
                                                <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                                                    I agree to the{' '}
                                                    <a href="#" className="text-green-700 underline hover:text-green-800">
                                                        Terms & Conditions
                                                    </a>{' '}
                                                    and{' '}
                                                    <a href="#" className="text-green-700 underline hover:text-green-800">
                                                        Privacy Policy
                                                    </a>{' '}
                                                    <span className="text-red-500">*</span>
                                                </Label>
                                            </div>

                                            <div className="flex justify-between mt-8">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={handlePreviousStep}
                                                >
                                                    Back
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    className="text-white px-8 py-3"
                                                    style={{ backgroundColor: '#477023' }}
                                                    disabled={!validateStep3() || reservationLoading}
                                                >
                                                    {reservationLoading ? 'Processing...' : 'Complete Booking'}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Booking Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6">
                            <Card className="p-6 shadow-md">
                                <CardContent className="p-0 space-y-4">
                                    {/* Cabin Image */}
                                    <div className="mb-4">
                                        {property?.images?.[0] && (
                                            <ImageWithFallback
                                                src={property.images[0]}
                                                alt={property.title}
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                        )}
                                    </div>

                                    <h3 className="text-lg font-semibold">Booking Summary</h3>

                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <p className="font-medium text-gray-900">{property?.title || 'Loading...'}</p>
                                        </div>

                                        {/* Arrival and Departure Dates */}
                                        <div className="space-y-2 py-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Arrival</span>
                                                <span className="font-medium text-gray-900">{checkIn}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Departure</span>
                                                <span className="font-medium text-gray-900">{checkOut}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Guests</span>
                                                <span className="font-medium text-gray-900">{adults + children} guests</span>
                                            </div>
                                        </div>

                                        <Separator />

                                        {price ? (
                                            <>
                                                {/* Nightly Rate */}
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">
                                                        ${(price.subtotal / nights).toFixed(2)} × {nights} nights
                                                    </span>
                                                    <span className="font-medium">
                                                        ${price.subtotal.toFixed(2)}
                                                    </span>
                                                </div>

                                                {/* Pet Fee (If applicable) */}
                                                {price.required_fees && price.required_fees.some((fee: any) => fee.name.toLowerCase().includes('pet')) && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Pet Fee</span>
                                                        <span className="font-medium">
                                                            ${price.required_fees.find((fee: any) => fee.name.toLowerCase().includes('pet'))?.amount.toFixed(2)}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Taxes and Fees */}
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Taxes and Fees</span>
                                                    <span className="font-medium">
                                                        ${(
                                                            displayTotal -
                                                            price.subtotal -
                                                            (price.required_fees?.find((fee: any) => fee.name.toLowerCase().includes('pet'))?.amount || 0)
                                                        ).toFixed(2)}
                                                    </span>
                                                </div>

                                                <Separator />

                                                {/* Total (includes selected optional fees) */}
                                                <div className="flex justify-between text-base font-semibold">
                                                    <span>Total</span>
                                                    <span>${displayTotal.toFixed(2)}</span>
                                                </div>

                                                {/* Guest Deposits */}
                                                {price.guest_deposits && price.guest_deposits.length > 0 && (
                                                    <>
                                                        <Separator />
                                                        <div className="text-xs text-gray-500 font-medium uppercase">Deposits</div>
                                                        {price.guest_deposits.map((dep: any, idx: number) => (
                                                            <div key={`dep-${idx}`} className="flex justify-between text-sm">
                                                                <span className="text-gray-600">{dep.name}</span>
                                                                <span className="font-medium">${dep.amount.toFixed(2)}</span>
                                                            </div>
                                                        ))}
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            <div className="text-center py-4 text-gray-500">Calculating price...</div>
                                        )}

                                        <Separator />

                                        {/* Required Payment Section */}
                                        {price && (
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-semibold text-gray-900">Required Payment</span>
                                                    <span className="text-base font-bold text-green-700">${displayTotal.toFixed(2)}</span>
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    Due by {checkIn}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading checkout...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}
