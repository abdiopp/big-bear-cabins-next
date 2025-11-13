"use client";

import { useState, useEffect } from "react";
import { Phone, PhoneCall, CheckCircle, Users, Target, Heart, TrendingUp, ChevronLeft, ChevronRight, Star, Quote, BookOpen, Search, Award } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

interface Service {
  title: string;
  description: string;
  image: string;
}

const services: Service[] = [
  {
    title: "Extensive Cleaning Services",
    description: "Professional deep cleaning between guests and regular maintenance cleaning to keep your property pristine and guest-ready at all times.",
    image: "https://images.unsplash.com/photo-1742483359033-13315b247c74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjbGVhbmluZyUyMHNlcnZpY2V8ZW58MXx8fHwxNzU4NTYyNDQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    title: "Property Maintenance Services",
    description: "Comprehensive maintenance and repair services to keep your property in excellent condition, from routine upkeep to emergency repairs.",
    image: "https://images.unsplash.com/photo-1607400201515-c2c41c07d307?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwbWFpbnRlbmFuY2UlMjByZXBhaXJ8ZW58MXx8fHwxNzU4NTY1Nzc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    title: "Repair Services",
    description: "Quick and professional repair services to address any issues that may arise, ensuring minimal downtime and maximum guest satisfaction.",
    image: "https://images.unsplash.com/photo-1607400201515-c2c41c07d307?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwbWFpbnRlbmFuY2UlMjByZXBhaXJ8ZW58MXx8fHwxNzU4NTY1Nzc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    title: "Interior Decorating",
    description: "Professional interior design services to enhance your property's appeal and create memorable experiences that guests will cherish.",
    image: "https://images.unsplash.com/photo-1758448755856-01d3add0177b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnRlcmlvciUyMGRlY29yYXRpbmclMjBsdXh1cnl8ZW58MXx8fHwxNzU4NjM2MjY0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    title: "Protecting Your Interests",
    description: "Comprehensive property protection services including security monitoring, insurance coordination, and legal compliance management.",
    image: "https://images.unsplash.com/photo-1723186508830-ef518623fa6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9wZXJ0eSUyMHByb3RlY3Rpb24lMjBzZWN1cml0eXxlbnwxfHx8fDE3NTg2MzYyNzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    title: "24/7 Guest Service",
    description: "Round-the-clock guest support to ensure exceptional guest experiences and immediate response to any guest concerns or requests.",
    image: "https://images.unsplash.com/photo-1580847097365-f61d0cece1ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxndWVzdCUyMHNlcnZpY2UlMjBzdXBwb3J0fGVufDF8fHx8MTc1ODYzODI0MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    title: "Home Care",
    description: "Continuous property monitoring and care services to maintain your investment and ensure everything is in perfect condition year-round.",
    image: "https://images.unsplash.com/photo-1722411983889-a3a6321ecf8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwY2FyZSUyMG1haW50ZW5hbmNlfGVufDF8fHx8MTc1ODYzODI0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  }
];

const testimonials = [
  {
    name: "Sarah Martinez",
    property: "Pine Ridge Cabin",
    content: "Big Bear Cabins transformed my property into a top-performing rental. Their attention to detail and guest service is exceptional. I've seen a 40% increase in bookings since partnering with them.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b4c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHRlc3RpbW9uaWFsJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzU4NTE4NTgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cabinImage: "https://images.unsplash.com/photo-1644555990060-4376e2631b05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5lJTIwcmlkZ2UlMjBjYWJpbiUyMGV4dGVyaW9yfGVufDF8fHx8MTc1ODYzOTkzN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    name: "Michael Thompson",
    property: "Mountain View Lodge",
    content: "The team's professionalism and dedication to maintaining my property is outstanding. They handle everything from cleaning to maintenance, and my guests consistently leave 5-star reviews.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHRlc3RpbW9uaWFsJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzU4NTE4NTgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cabinImage: "https://images.unsplash.com/photo-1756077338872-fd1c4c380a61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb3VudGFpbiUyMHZpZXclMjBsb2RnZSUyMGNhYmlufGVufDF8fHx8MTc1ODYzOTk0MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    name: "Jessica Chen",
    property: "Cozy Bear Retreat",
    content: "I was hesitant about vacation rental management, but Big Bear Cabins made the entire process seamless. Their marketing strategies and guest communication are top-notch.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1580813904113-d3ccb23b6a94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHRlc3RpbW9uaWFsJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzU4NTE4NTgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cabinImage: "https://images.unsplash.com/photo-1699580305385-3ad937a35e82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwYmVhciUyMHJldHJlYXQlMjBjYWJpbnxlbnwxfHx8fDE3NTg2Mzk5NDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  }
];

export function PropertyListingPage() {
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    propertyAddress: "",
    agreeToTerms: false
  });

  // Scroll animation hooks for each section
  const heroSection = useScrollAnimation({ threshold: 0.2 });
  const managementSection = useScrollAnimation({ threshold: 0.1 });
  const servicesSection = useScrollAnimation({ threshold: 0.1 });
  const formSection = useScrollAnimation({ threshold: 0.1 });
  const cardsSection = useScrollAnimation({ threshold: 0.1 });
  const testimonialsSection = useScrollAnimation({ threshold: 0.1 });

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentServiceIndex((prev) => (prev + 1) % services.length);
    }, 5000); // 5 seconds

    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission here
  };

  const nextService = () => {
    setCurrentServiceIndex((prev) => (prev + 1) % services.length);
  };

  const prevService = () => {
    setCurrentServiceIndex((prev) => (prev - 1 + services.length) % services.length);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Clean text on left, cabin image on right */}
      <section ref={heroSection.elementRef} className="min-h-screen flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
            <div className={`scroll-slide-in-left ${heroSection.isVisible ? 'animate' : ''}`}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-gray-900 leading-tight">
                It's Easy To Get Started on
                <br />
                <span className="font-medium">Big Bear Cabins</span>
              </h1>
            </div>
            <div className={`scroll-slide-in-right ${heroSection.isVisible ? 'animate' : ''}`}>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1711934376003-840dadcb46d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dGlmdWwlMjBjYWJpbiUyMGV4dGVyaW9yJTIwbW91bnRhaW58ZW58MXx8fHwxNzU4NjM4MjI4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Beautiful Big Bear Cabin"
                className="w-full h-96 lg:h-[600px] object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Management Team Process Timeline Section */}
      <section ref={managementSection.elementRef} className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className={`text-center scroll-stagger ${managementSection.isVisible ? 'animate' : ''}`}>
              <div className={`w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 scroll-fade-in-scale ${managementSection.isVisible ? 'animate' : ''}`}>
                <Users className="h-12 w-12 text-blue-600" />
              </div>
              <div className="flex items-center justify-center mb-3">
                <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                <h3 className="text-lg text-gray-900">New Homes Recruiter</h3>
              </div>
              <p className="text-gray-600">
                Dedicated specialist to onboard your property and understand your goals
              </p>
            </div>

            <div className={`text-center scroll-stagger ${managementSection.isVisible ? 'animate' : ''}`}>
              <div className={`w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 scroll-fade-in-scale ${managementSection.isVisible ? 'animate' : ''}`}>
                <Target className="h-12 w-12 text-green-600" />
              </div>
              <div className="flex items-center justify-center mb-3">
                <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                <h3 className="text-lg text-gray-900">Our Strategy</h3>
              </div>
              <p className="text-gray-600">
                Customized rental strategy based on your property's unique features and market analysis
              </p>
            </div>

            <div className={`text-center scroll-stagger ${managementSection.isVisible ? 'animate' : ''}`}>
              <div className={`w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 scroll-fade-in-scale ${managementSection.isVisible ? 'animate' : ''}`}>
                <Heart className="h-12 w-12 text-purple-600" />
              </div>
              <div className="flex items-center justify-center mb-3">
                <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                <h3 className="text-lg text-gray-900">A Personal Touch</h3>
              </div>
              <p className="text-gray-600">
                Personalized service that treats your property with the care it deserves
              </p>
            </div>

            <div className={`text-center scroll-stagger ${managementSection.isVisible ? 'animate' : ''}`}>
              <div className={`w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 scroll-fade-in-scale ${managementSection.isVisible ? 'animate' : ''}`}>
                <TrendingUp className="h-12 w-12 text-orange-600" />
              </div>
              <div className="flex items-center justify-center mb-3">
                <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                <h3 className="text-lg text-gray-900">Innovative Marketing</h3>
              </div>
              <p className="text-gray-600">
                Cutting-edge marketing strategies to maximize your property's visibility and bookings
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Slideshow Section with Auto-advance */}
      <section ref={servicesSection.elementRef} className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto">
          <div className={`text-center mb-16 scroll-fade-in-up ${servicesSection.isVisible ? 'animate' : ''}`}>
            <h2 className="text-4xl md:text-5xl text-black mb-6">
              Big Bear Cabins Property Management Services
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Trust your property to our caring and experienced team. We handle every detail so you can enjoy the rewards without the hassle.
            </p>
          </div>

          <div className={`relative max-w-6xl mx-auto scroll-fade-in ${servicesSection.isVisible ? 'animate' : ''}`}>
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <ImageWithFallback
                    src={services[currentServiceIndex].image}
                    alt={services[currentServiceIndex].title}
                    className="w-full h-80 md:h-[500px] object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
                  <h3 className="text-xl text-gray-900 mb-6">
                    {services[currentServiceIndex].title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-8">
                    {services[currentServiceIndex].description}
                  </p>
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">
                      {currentServiceIndex + 1} of {services.length}
                    </span>
                    <div className="flex space-x-1">
                      {Array.from({ length: 3 }, (_, i) => (
                        <div key={i} className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <Button
              variant="outline"
              size="lg"
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white rounded-full p-4 shadow-lg border-2"
              onClick={prevService}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white rounded-full p-4 shadow-lg border-2"
              onClick={nextService}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Enhanced Dots Indicator */}
            <div className="flex justify-center mt-12 space-x-3">
              {services.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentServiceIndex(index)}
                  className={`transition-all duration-300 ${
                    index === currentServiceIndex 
                      ? 'w-8 h-4 bg-blue-600 rounded-full' 
                      : 'w-4 h-4 bg-gray-300 rounded-full hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Evaluation Form Section - Background Image with Overlay Form */}
      <section ref={formSection.elementRef} className="relative py-24 overflow-hidden min-h-screen flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1711934376003-840dadcb46d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dGlmdWwlMjBjYWJpbiUyMGV4dGVyaW9yJTIwbW91bnRhaW4lMjB2aWV3fGVufDF8fHx8MTc1ODY0MjM0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Beautiful Big Bear cabin exterior with mountain views"
            className="w-full h-full object-cover"
          />
          {/* Enhanced overlay for better text readability */}
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className={`space-y-10 scroll-slide-in-left ${formSection.isVisible ? 'animate' : ''}`}>
              <div className="space-y-6">

                
                <h1 className="text-5xl lg:text-6xl text-white leading-tight drop-shadow-lg font-bold font-normal">
                  Discover Your Property's True Potential
                </h1>
                
                <h2 className="text-3xl lg:text-4xl text-white leading-tight font-light drop-shadow-lg">
                  Get Your <span className="font-semibold">FREE</span> Property Evaluation
                </h2>
                
                <p className="text-xl text-white drop-shadow-md">
                  Discover how much your Big Bear property could earn as a vacation rental. 
                  Our expert team will provide a comprehensive evaluation at no cost.
                </p>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4 p-6 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                  <Phone className="h-8 w-8 text-white flex-shrink-0" />
                  <div>
                    <p className="text-white/90 text-sm font-medium">Quick Call</p>
                    <p className="text-white font-bold text-lg">+1 (234) 457-6</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-6 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                  <PhoneCall className="h-8 w-8 text-white flex-shrink-0" />
                  <div>
                    <p className="text-white/90 text-sm font-medium">Specialist</p>
                    <p className="text-white font-bold text-lg">+1 (234) 567-8900</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Form */}
            <div className={`scroll-slide-in-right ${formSection.isVisible ? 'animate' : ''}`}>
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="fullName" className="text-base font-medium text-gray-700 mb-3 block">
                      Full Name *
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className="w-full p-4 text-base border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="text-base font-medium text-gray-700 mb-3 block">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="w-full p-4 text-base border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="(555) 123-4567"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-base font-medium text-gray-700 mb-3 block">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full p-4 text-base border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="propertyAddress" className="text-base font-medium text-gray-700 mb-3 block">
                      Property Address *
                    </Label>
                    <Input
                      id="propertyAddress"
                      type="text"
                      value={formData.propertyAddress}
                      onChange={(e) => handleInputChange("propertyAddress", e.target.value)}
                      className="w-full p-4 text-base border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="123 Main Street, Big Bear, CA 92315"
                      required
                    />
                  </div>

                  <div className="flex items-start space-x-3 pt-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                      className="mt-1 h-5 w-5"
                    />
                    <Label htmlFor="terms" className="text-gray-600 text-sm leading-relaxed">
                      I agree to be contacted by Big Bear Cabins regarding my property evaluation and potential management services. 
                      I understand this is a free consultation with no obligation.
                    </Label>
                  </div>

                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                      disabled={!formData.agreeToTerms}
                    >
                      <PhoneCall className="mr-3 h-5 w-5" />
                      Get My FREE Evaluation
                    </Button>
                    <p className="text-gray-500 mt-3 text-sm text-center">
                      Takes less than 2 minutes • No spam, ever
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - NOW SECOND TO LAST */}
      <section ref={testimonialsSection.elementRef} className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto">
          <div className={`text-center mb-16 scroll-fade-in-up ${testimonialsSection.isVisible ? 'animate' : ''}`}>
            <h2 className="text-4xl md:text-5xl text-black mb-6">
              What Our Property Owners Say
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Hear from property owners who have transformed their investments with Big Bear Cabins
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className={`bg-white shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden scroll-stagger ${testimonialsSection.isVisible ? 'animate' : ''}`}>
                <Quote className="absolute top-4 right-4 h-8 w-8 text-blue-200 z-10" />
                
                {/* Cabin Image */}
                <div className="h-48 relative">
                  <ImageWithFallback
                    src={testimonial.cabinImage}
                    alt={`${testimonial.property} exterior`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <ImageWithFallback
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover mr-4 border-4 border-white shadow-lg"
                    />
                    <div>
                      <h4 className="text-gray-900">{testimonial.name}</h4>
                      <p className="text-gray-600 font-medium">{testimonial.property}</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-4">
                    {Array.from({ length: testimonial.rating }, (_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-gray-700 italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Information Cards Section - NOW LAST */}
      <section ref={cardsSection.elementRef} className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
            <Card className={`hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 scroll-stagger ${cardsSection.isVisible ? 'animate' : ''}`}>
              <CardHeader className="text-center pb-4">
                <div className={`w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 scroll-fade-in-scale ${cardsSection.isVisible ? 'animate' : ''}`}>
                  <Search className="h-12 w-12 text-blue-600" />
                </div>
                <CardTitle className="text-lg mb-3">Choosing Your Property Management Company</CardTitle>
                <CardDescription className="">
                  Learn the key factors to consider when selecting a property management partner for your investment.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Making the right choice in property management can significantly impact your investment returns and peace of mind...
                </p>
                <Button variant="outline" className="w-full bg-black text-white hover:bg-gray-800 border-black py-3">
                  Read More
                </Button>
              </CardContent>
            </Card>

            <Card className={`hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 scroll-stagger ${cardsSection.isVisible ? 'animate' : ''}`}>
              <CardHeader className="text-center pb-4">
                <div className={`w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 scroll-fade-in-scale ${cardsSection.isVisible ? 'animate' : ''}`}>
                  <BookOpen className="h-12 w-12 text-green-600" />
                </div>
                <CardTitle className="text-lg mb-3">5 Things to Look for in Your Property Management Company</CardTitle>
                <CardDescription className="text-lg">
                  Essential criteria that distinguish exceptional property management companies from the rest.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  From communication excellence to maintenance responsiveness, discover what truly matters...
                </p>
                <Button variant="outline" className="w-full bg-black text-white hover:bg-gray-800 border-black py-3 text-lg">
                  Read More
                </Button>
              </CardContent>
            </Card>

            <Card className={`hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 scroll-stagger ${cardsSection.isVisible ? 'animate' : ''}`}>
              <CardHeader className="text-center pb-4">
                <div className={`w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 scroll-fade-in-scale ${cardsSection.isVisible ? 'animate' : ''}`}>
                  <Award className="h-12 w-12 text-orange-600" />
                </div>
                <CardTitle className="text-lg mb-3">What Makes Big Bear the Best Property Management Company</CardTitle>
                <CardDescription className="text-lg">
                  Discover the unique advantages and proven track record that sets us apart in Big Bear.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Our local expertise, advanced technology, and commitment to excellence create unmatched results...
                </p>
                <Button variant="outline" className="w-full bg-black text-white hover:bg-gray-800 border-black py-3 text-lg">
                  Read More
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}