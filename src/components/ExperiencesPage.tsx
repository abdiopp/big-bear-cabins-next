"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */

interface Experience {
    title: string;
    image: string;
    subtitle?: string;
    cost?: string;
    date?: string;
    time?: string;
    includes?: string[];
    description?: string;
}

/* ──────────────────────────────────────────────
   Data
   ────────────────────────────────────────────── */

const POPULAR_EXPERIENCES: Experience[] = [
    {
        title: "Alpine Tour",
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=400&fit=crop",
        subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental",
        cost: "$95.00",
        date: "June 15, 2026",
        time: "9:00 am – 2:00 pm",
        includes: [
            "Guided alpine trail tour",
            "Professional photography session",
            "Picnic lunch at scenic overlook",
            "Transportation to/from cabin",
            "Souvenir trail map",
        ],
        description:
            "Explore the stunning alpine trails of Big Bear with our expert guides! This full-day adventure takes you through breathtaking mountain scenery, past hidden waterfalls, and to panoramic viewpoints. Perfect for nature lovers and photography enthusiasts alike. Our guides share fascinating stories about local wildlife and geology along the way.",
    },
    {
        title: "Off-road Tours",
        image: "https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?w=600&h=400&fit=crop",
        subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental",
        cost: "$120.00",
        date: "June 20, 2026",
        time: "10:00 am – 3:00 pm",
        includes: [
            "4x4 Jeep off-road adventure",
            "Professional trail guide",
            "Snacks & refreshments",
            "Photo opportunities at scenic stops",
            "Safety equipment provided",
        ],
        description:
            "Buckle up for an adrenaline-pumping off-road adventure through the rugged terrain of Big Bear! Navigate steep trails, rocky paths, and forest roads in our top-of-the-line 4x4 vehicles. This tour is designed for thrill-seekers who want to explore the wild side of the mountains while enjoying breathtaking views.",
    },
    {
        title: "Kayaking Tour",
        image: "https://images.unsplash.com/photo-1472745942893-4b9f730c7668?w=600&h=400&fit=crop",
        subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental",
        cost: "$75.00",
        date: "June 22, 2026",
        time: "8:00 am – 12:00 pm",
        includes: [
            "Kayak & paddle rental",
            "Life jacket & safety briefing",
            "Guided lake tour",
            "Waterproof camera bag",
            "Post-tour hot cocoa",
        ],
        description:
            "Glide across the crystal-clear waters of Big Bear Lake on this guided kayaking tour! Whether you're a beginner or experienced paddler, our guides will take you to the most scenic spots on the lake. Watch for bald eagles soaring overhead and enjoy the peaceful serenity of the morning waters.",
    },
];

const ALL_EXPERIENCES: Experience[] = [
    {
        title: "Jeep Off-Road Tours",
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=300&fit=crop",
        subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental",
        cost: "$120.00",
        date: "Available Daily",
        time: "10:00 am – 3:00 pm",
        includes: ["4x4 Jeep adventure", "Professional guide", "Snacks & drinks", "Safety gear provided"],
        description: "Navigate rugged mountain trails in our top-of-the-line 4x4 vehicles with expert guides leading the way through Big Bear's most scenic off-road routes.",
    },
    {
        title: "Indoor Skydiving",
        image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=300&fit=crop",
        subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental",
        cost: "$89.00",
        date: "Available Daily",
        time: "11:00 am – 5:00 pm",
        includes: ["Flight suit & gear", "Training session", "2 flight sessions", "Certificate of completion"],
        description: "Feel the rush of freefall without jumping from a plane! Our state-of-the-art indoor skydiving facility offers a safe and thrilling experience for all ages.",
    },
    {
        title: "Horseback Riding",
        image: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&h=300&fit=crop",
        subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental",
        cost: "$95.00",
        date: "Available Daily",
        time: "9:00 am – 1:00 pm",
        includes: ["Gentle trail horse", "Experienced guide", "Scenic mountain trail", "Photo opportunities"],
        description: "Saddle up and explore Big Bear's beautiful mountain trails on horseback. Our gentle horses and experienced guides ensure a memorable ride through pine forests and meadows.",
    },
    {
        title: "Kayaking",
        image: "https://images.unsplash.com/photo-1472745942893-4b9f730c7668?w=400&h=300&fit=crop",
        subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental",
        cost: "$65.00",
        date: "Available Daily",
        time: "8:00 am – 6:00 pm",
        includes: ["Kayak & paddle", "Life jacket", "Safety briefing", "Lake access"],
        description: "Paddle across the crystal-clear waters of Big Bear Lake. Perfect for beginners and experienced kayakers alike, with calm morning waters and stunning mountain views.",
    },
    {
        title: "Jet Ski Rental",
        image: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=400&h=300&fit=crop",
        subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental",
        cost: "$110.00",
        date: "Available Daily",
        time: "9:00 am – 5:00 pm",
        includes: ["Jet ski rental – 1 hr", "Safety briefing", "Life jacket", "Fuel included"],
        description: "Feel the thrill of speeding across Big Bear Lake on a jet ski! Our powerful, well-maintained watercraft provide an exhilarating way to enjoy the lake.",
    },
    {
        title: "Zipline Tours",
        image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop",
        subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental",
        cost: "$85.00",
        date: "Available Daily",
        time: "10:00 am – 4:00 pm",
        includes: ["Multiple zipline runs", "Safety harness & helmet", "Trained guide", "Treetop views"],
        description: "Soar through the treetops on our exciting zipline course! Multiple lines take you through the forest canopy with breathtaking views of the mountains and lake below.",
    },
    {
        title: "Sailing / Boat Rentals",
        image: "https://images.unsplash.com/photo-1500514966906-fe245eea9344?w=400&h=300&fit=crop",
        subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental",
        cost: "$150.00",
        date: "Available Daily",
        time: "8:00 am – 6:00 pm",
        includes: ["Boat rental – half day", "Safety equipment", "Lake map", "Fishing rod (optional)"],
        description: "Set sail on Big Bear Lake! Choose from sailboats, pontoons, or fishing boats for a relaxing day on the water with family and friends.",
    },
    {
        title: "Nature Walks",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
        subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental",
        cost: "$45.00",
        date: "Available Daily",
        time: "7:00 am – 11:00 am",
        includes: ["Guided walk", "Wildlife spotting", "Plant identification", "Trail snacks"],
        description: "Join our naturalist guides for a peaceful walk through Big Bear's diverse ecosystems. Learn about local flora, fauna, and the fascinating history of the mountains.",
    },
    {
        title: "Fly Fishing",
        image: "https://images.unsplash.com/photo-1504309092620-4d0ec726efa4?w=400&h=300&fit=crop",
        subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental",
        cost: "$100.00",
        date: "Available Daily",
        time: "6:00 am – 12:00 pm",
        includes: ["Rod & tackle provided", "Expert fishing guide", "Waders & boots", "Catch & release gear"],
        description: "Cast your line in Big Bear's pristine streams and rivers with an expert fly fishing guide. Perfect for beginners learning the art or experienced anglers seeking trophy trout.",
    },
    {
        title: "Mountain Biking",
        image: "https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=400&h=300&fit=crop",
        subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental",
        cost: "$80.00",
        date: "Available Daily",
        time: "8:00 am – 4:00 pm",
        includes: ["Mountain bike rental", "Helmet & gloves", "Trail map", "Repair kit"],
        description: "Hit the trails on two wheels! Big Bear's mountain biking trails range from beginner-friendly paths to expert-level singletrack through stunning alpine terrain.",
    },
    {
        title: "Alpine Slide",
        image: "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=400&h=300&fit=crop",
        subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental",
        cost: "$35.00",
        date: "Available Daily",
        time: "10:00 am – 6:00 pm",
        includes: ["Unlimited slides – 2 hrs", "Scenic chairlift ride", "Safety briefing", "Fun for all ages"],
        description: "Race down the mountain on Big Bear's famous alpine slide! Ride the chairlift to the top and then swoosh down the winding track with control of your own speed.",
    },
    {
        title: "Rock Climbing",
        image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400&h=300&fit=crop",
        subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental",
        cost: "$90.00",
        date: "Available Daily",
        time: "9:00 am – 3:00 pm",
        includes: ["Climbing gear rental", "Certified instructor", "Multiple routes", "Belay support"],
        description: "Scale the granite faces of Big Bear's stunning rock formations with our certified climbing instructors. Routes for all skill levels from beginner to advanced.",
    },
    {
        title: "Paintball",
        image: "https://images.unsplash.com/photo-1565711561500-49678a10a63f?w=400&h=300&fit=crop",
        subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental",
        cost: "$55.00",
        date: "Available Daily",
        time: "10:00 am – 5:00 pm",
        includes: ["Marker & mask rental", "200 paintballs", "Chest protector", "Forest battlefield access"],
        description: "Battle it out in Big Bear's outdoor paintball arena set in a real forest! Perfect for groups, team building, and anyone looking for some competitive fun.",
    },
    {
        title: "Yoga Retreats",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop",
        subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental",
        cost: "$70.00",
        date: "Weekends",
        time: "7:00 am – 10:00 am",
        includes: ["Yoga mat provided", "Certified instructor", "Mountain-view session", "Herbal tea"],
        description: "Find your inner peace with a yoga session surrounded by Big Bear's magnificent mountain scenery. Our certified instructors offer classes for all levels in a serene outdoor setting.",
    },
    {
        title: "Snowshoeing",
        image: "https://images.unsplash.com/photo-1491555103944-7c647fd857e6?w=400&h=300&fit=crop",
        subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental",
        cost: "$60.00",
        date: "Winter Season",
        time: "9:00 am – 1:00 pm",
        includes: ["Snowshoe rental", "Guided trail tour", "Hot chocolate stop", "Winter wildlife spotting"],
        description: "Trek through Big Bear's winter wonderland on snowshoes! Our guided tours take you through snow-covered forests and meadows, perfect for experiencing the magic of a mountain winter.",
    },
    {
        title: "Wildlife Safaris",
        image: "https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=400&h=300&fit=crop",
        subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental",
        cost: "$85.00",
        date: "Available Daily",
        time: "6:00 am – 10:00 am",
        includes: ["Expert naturalist guide", "Binoculars provided", "Wildlife identification book", "Light breakfast"],
        description: "Discover Big Bear's amazing wildlife on a guided safari! Spot bald eagles, deer, bears, and more with our expert naturalist guides who know exactly where to find them.",
    },
    {
        title: "Para Gliding",
        image: "https://images.unsplash.com/photo-1503416997304-7f8bf166c121?w=400&h=300&fit=crop",
        subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental",
        cost: "$175.00",
        date: "Weather Permitting",
        time: "10:00 am – 4:00 pm",
        includes: ["Tandem flight with instructor", "All safety equipment", "GoPro video recording", "Certificate"],
        description: "Soar like an eagle over Big Bear! Our tandem paragliding flights give you a bird's-eye view of the mountains and lake with an experienced instructor keeping you safe the entire time.",
    },
    {
        title: "Star Gazing",
        image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=300&fit=crop",
        subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental",
        cost: "$50.00",
        date: "Clear Nights",
        time: "8:00 pm – 11:00 pm",
        includes: ["Professional telescope access", "Astronomy guide", "Star chart", "Hot beverages"],
        description: "Big Bear's high altitude and clear skies make it perfect for stargazing. Join our astronomy guide for an unforgettable night identifying constellations, planets, and deep sky objects.",
    },
    {
        title: "Scenic Helicopter Rides",
        image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=300&fit=crop",
        subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental",
        cost: "$250.00",
        date: "Available Daily",
        time: "9:00 am – 5:00 pm",
        includes: ["20-minute scenic flight", "Pilot narration", "Window seat guaranteed", "Photo opportunities"],
        description: "See Big Bear from the sky on a breathtaking helicopter tour! Fly over the lake, mountains, and forests while your pilot points out landmarks and shares the area's rich history.",
    },
    {
        title: "Photography Tours",
        image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop",
        subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental",
        cost: "$95.00",
        date: "Available Daily",
        time: "6:00 am – 10:00 am",
        includes: ["Professional photographer guide", "Best scenic locations", "Tips & techniques", "Digital photo sharing"],
        description: "Capture Big Bear's stunning beauty with a professional photographer as your guide! Visit the most photogenic spots at the best times of day for golden-hour lighting and dramatic compositions.",
    },
];

/* ──────────────────────────────────────────────
   Sub-components
   ────────────────────────────────────────────── */

function PopularCard({
    title,
    image,
    onOpen,
}: {
    title: string;
    image: string;
    onOpen: () => void;
}) {
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group">
            <div className="relative h-48 sm:h-52 overflow-hidden bg-gray-100">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
            </div>
            <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-800 mb-3 text-base">{title}</h3>
                <button
                    onClick={onOpen}
                    className="w-full bg-[#4a7c3f] hover:bg-[#3d6834] text-white text-sm font-medium py-2.5 px-6 rounded-md transition-colors duration-200"
                >
                    View Details
                </button>
            </div>
        </div>
    );
}

function ExperienceCard({
    title,
    image,
    onOpen,
}: {
    title: string;
    image: string;
    onOpen: () => void;
}) {
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group">
            <div className="relative h-40 sm:h-44 overflow-hidden bg-gray-100">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
            </div>
            <div className="p-3 text-center">
                <h4 className="font-medium text-gray-800 text-sm mb-2 truncate">
                    {title}
                </h4>
                <button
                    onClick={onOpen}
                    className="w-full bg-[#4a7c3f] hover:bg-[#3d6834] text-white text-xs font-medium py-2 px-4 rounded-md transition-colors duration-200"
                >
                    Expand
                </button>
            </div>
        </div>
    );
}

/* ──────────────────────────────────────────────
   Experience Modal
   ────────────────────────────────────────────── */

function ExperienceModal({
    experience,
    onClose,
}: {
    experience: Experience;
    onClose: () => void;
}) {
    const [bookingForm, setBookingForm] = useState({
        name: "",
        email: "",
        reservation: "",
        specialRequest: "",
    });

    // Lock body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const handleBookingSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Thank you! Your booking request has been submitted. We will get back to you shortly.");
        setBookingForm({ name: "", email: "", reservation: "", specialRequest: "" });
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-[modalIn_0.25s_ease-out] max-h-[90vh] overflow-y-auto"
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-700 transition-colors text-2xl leading-none font-light"
                    aria-label="Close"
                >
                    ×
                </button>

                {/* Title at top */}
                <div className="px-6 pt-6 pb-3">
                    <h2 className="text-xl font-bold text-gray-900 pr-8">
                        {experience.title}
                    </h2>
                </div>

                {/* Image */}
                <div className="relative w-full h-48 mx-0">
                    <Image
                        src={experience.image}
                        alt={experience.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 448px) 100vw, 448px"
                    />
                </div>

                {/* Content */}
                <div className="px-6 pt-4 pb-6">
                    {/* Subtitle */}
                    {experience.subtitle && (
                        <p className="text-[#4a7c3f] italic text-sm mb-2">
                            {experience.subtitle}
                        </p>
                    )}

                    {/* Title repeated */}
                    <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                        {experience.title}
                    </h3>

                    {/* Cost / Date / Time row */}
                    {(experience.cost || experience.date || experience.time) && (
                        <div className="flex justify-between items-start text-center mb-6 border-b border-gray-100 pb-4">
                            {experience.cost && (
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 mb-0.5">Cost:</p>
                                    <p className="font-bold text-gray-900 text-base">
                                        {experience.cost}
                                    </p>
                                </div>
                            )}
                            {experience.date && (
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 mb-0.5">Date:</p>
                                    <p className="font-bold text-gray-900 text-base">
                                        {experience.date}
                                    </p>
                                </div>
                            )}
                            {experience.time && (
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 mb-0.5">Time:</p>
                                    <p className="font-bold text-gray-900 text-base">
                                        {experience.time}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Includes */}
                    {experience.includes && experience.includes.length > 0 && (
                        <div className="mb-5">
                            <h4 className="font-bold text-gray-900 text-base mb-3">
                                Includes:
                            </h4>
                            <ul className="space-y-2">
                                {experience.includes.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                        <svg
                                            className="w-4 h-4 text-[#4a7c3f] mt-0.5 flex-shrink-0"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2.5}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Description */}
                    {experience.description && (
                        <p className="text-sm text-gray-600 leading-relaxed mb-6">
                            {experience.description}
                        </p>
                    )}

                    {/* Divider */}
                    <hr className="border-gray-200 mb-6" />

                    {/* Book This Experience form */}
                    <h4 className="font-bold text-gray-900 text-base mb-4">
                        Book This Experience
                    </h4>

                    <form onSubmit={handleBookingSubmit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-1">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={bookingForm.name}
                                onChange={(e) =>
                                    setBookingForm((p) => ({ ...p, name: e.target.value }))
                                }
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a7c3f]/40 focus:border-[#4a7c3f] transition-colors"
                                placeholder="Your full name"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-1">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                required
                                value={bookingForm.email}
                                onChange={(e) =>
                                    setBookingForm((p) => ({ ...p, email: e.target.value }))
                                }
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a7c3f]/40 focus:border-[#4a7c3f] transition-colors"
                                placeholder="your.email@example.com"
                            />
                        </div>

                        {/* Reservation Number */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-1">
                                Reservation Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={bookingForm.reservation}
                                onChange={(e) =>
                                    setBookingForm((p) => ({
                                        ...p,
                                        reservation: e.target.value,
                                    }))
                                }
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a7c3f]/40 focus:border-[#4a7c3f] transition-colors"
                                placeholder="Your cabin reservation number"
                            />
                        </div>

                        {/* Special Request */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-1">
                                Special Request
                            </label>
                            <input
                                type="text"
                                value={bookingForm.specialRequest}
                                onChange={(e) =>
                                    setBookingForm((p) => ({
                                        ...p,
                                        specialRequest: e.target.value,
                                    }))
                                }
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a7c3f]/40 focus:border-[#4a7c3f] transition-colors"
                                placeholder="Any special requirements or requests"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#4a7c3f] hover:bg-[#3d6834] text-white font-semibold py-3 rounded-lg transition-colors duration-200 mt-1"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>

            {/* Keyframe animation */}
            <style jsx>{`
                @keyframes modalIn {
                    from {
                        opacity: 0;
                        transform: translateY(24px) scale(0.97);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            `}</style>
        </div>
    );
}

/* ──────────────────────────────────────────────
   Main page component
   ────────────────────────────────────────────── */

export function ExperiencesPage() {
    const [form, setForm] = useState({ name: "", email: "", phone: "" });
    const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Thank you! We will get back to you shortly.");
        setForm({ name: "", email: "", phone: "" });
    };

    return (
        <div className="min-h-screen bg-white">
            {/* ───── Hero Section ───── */}
            <section className="relative h-[380px] sm:h-[440px] lg:h-[500px] overflow-hidden">
                {/* Background image */}
                <Image
                    src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&h=700&fit=crop"
                    alt="Big Bear Forest Experience"
                    fill
                    priority
                    className="object-cover"
                    sizes="100vw"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/45" />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
                    <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight max-w-3xl">
                        We&apos;ve got the
                        <br />
                        <span className="text-white">
                            Custom Experiences in Big Bear
                        </span>
                        <br />
                        <span className="italic text-[#8bc34a] font-medium text-2xl sm:text-3xl lg:text-4xl">
                            you&apos;re looking for!
                        </span>
                    </h1>
                </div>
            </section>

            {/* ───── Most Popular ───── */}
            <section className="py-12 sm:py-16 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                    <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
                        <span className="border-b-4 border-[#4a7c3f] pb-2">
                            Most Popular
                        </span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {POPULAR_EXPERIENCES.map((exp) => (
                            <PopularCard
                                key={exp.title}
                                {...exp}
                                onOpen={() => setSelectedExperience(exp)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ───── Description ───── */}
            <section className="py-8 sm:py-12 bg-gray-50">
                <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-4xl">
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed text-center">
                        Whether you&apos;re looking for an adrenaline-pumping adventure or a
                        peaceful nature escape, Big Bear has it all. From off-road jeep
                        tours through rugged mountain trails to serene kayaking on the
                        crystal-clear lake, there&apos;s an experience for every explorer.
                        Horseback riding, zip-lining, mountain biking, and scenic
                        helicopter rides are just a few of the unforgettable activities
                        waiting for you. Let us help you plan the perfect Big Bear
                        adventure — book your custom experience today and create memories
                        that will last a lifetime.
                    </p>
                </div>
            </section>

            {/* ───── Experiences Grid ───── */}
            <section className="py-12 sm:py-16 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                    <h2 className="text-center text-xl sm:text-2xl font-bold text-gray-900 mb-10">
                        Choose the experiences that you would like to book
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {ALL_EXPERIENCES.map((exp) => (
                            <ExperienceCard
                                key={exp.title}
                                {...exp}
                                onOpen={() => setSelectedExperience(exp)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ───── We Can Help! Contact Form ───── */}
            <section className="py-12 sm:py-16 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-xl">
                    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">
                            We Can Help!
                        </h2>
                        <p className="text-gray-500 text-sm text-center mb-8">
                            Let us know! Contact Big Bear Cabins to customize a Big Bear
                            experience for you.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name */}
                            <div>
                                <label
                                    htmlFor="exp-name"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Name*
                                </label>
                                <input
                                    id="exp-name"
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm((p) => ({ ...p, name: e.target.value }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a7c3f]/40 focus:border-[#4a7c3f] transition-colors"
                                    placeholder="Your full name"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="exp-email"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Email*
                                </label>
                                <input
                                    id="exp-email"
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm((p) => ({ ...p, email: e.target.value }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a7c3f]/40 focus:border-[#4a7c3f] transition-colors"
                                    placeholder="you@email.com"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label
                                    htmlFor="exp-phone"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Phone
                                </label>
                                <input
                                    id="exp-phone"
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) =>
                                        setForm((p) => ({ ...p, phone: e.target.value }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a7c3f]/40 focus:border-[#4a7c3f] transition-colors"
                                    placeholder="(555) 123-4567"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#4a7c3f] hover:bg-[#3d6834] text-white font-semibold py-3 rounded-lg transition-colors duration-200 mt-2"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* ───── Experience Modal ───── */}
            {selectedExperience && (
                <ExperienceModal
                    experience={selectedExperience}
                    onClose={() => setSelectedExperience(null)}
                />
            )}
        </div>
    );
}
