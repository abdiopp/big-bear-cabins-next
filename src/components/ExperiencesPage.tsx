"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */

interface FormField {
    id: string;
    label: string;
    name: string;
    type: string;
    placeholder?: string;
    required: boolean;
    options: string[];
    order: number;
}

interface ExperienceCard {
    id: string;
    title: string;
    image: string;
    subtitle?: string;
    cost?: string;
    date?: string;
    time?: string;
    includes: string[];
    description?: string;
    isPopular: boolean;
    isActive: boolean;
    order: number;
    fields: FormField[];
}

interface ExperiencesPageData {
    heroTitle: string;
    heroSubtitle?: string;
    heroTagline?: string;
    heroDescription?: string;
    heroImage: string;
    heroCtaText?: string;
    heroCtaLink?: string;
    heroIsActive: boolean;
    formCards: ExperienceCard[];
    isPublished: boolean;
}

/* ──────────────────────────────────────────────
   Loading Skeletons
   ────────────────────────────────────────────── */

function HeroSkeleton() {
    return (
        <section className="relative h-[380px] sm:h-[440px] lg:h-[500px] overflow-hidden bg-gray-200 animate-pulse">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6">
                <div className="h-10 w-3/4 max-w-lg bg-gray-300 rounded" />
                <div className="h-6 w-1/2 max-w-sm bg-gray-300 rounded" />
            </div>
        </section>
    );
}

function CardSkeleton() {
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="h-40 sm:h-44 bg-gray-200 animate-pulse" />
            <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse" />
                <div className="h-8 bg-gray-200 rounded animate-pulse" />
            </div>
        </div>
    );
}

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

function ExperienceCardComp({
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
   Dynamic Form Field Renderer
   ────────────────────────────────────────────── */

function DynamicFormField({
    field,
    value,
    onChange,
}: {
    field: FormField;
    value: string;
    onChange: (val: string) => void;
}) {
    const baseClass =
        "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a7c3f]/40 focus:border-[#4a7c3f] transition-colors";

    switch (field.type) {
        case "textarea":
            return (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required={field.required}
                    placeholder={field.placeholder || ""}
                    className={baseClass}
                    rows={3}
                    aria-label={field.label}
                />
            );
        case "select":
            return (
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required={field.required}
                    className={baseClass}
                    aria-label={field.label}
                >
                    <option value="">{field.placeholder || "Select..."}</option>
                    {field.options.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
            );
        case "radio":
            return (
                <div className="space-y-2" role="radiogroup" aria-label={field.label}>
                    {field.options.map((opt) => (
                        <label key={opt} className="flex items-center gap-2 text-sm">
                            <input
                                type="radio"
                                name={field.name}
                                value={opt}
                                checked={value === opt}
                                onChange={() => onChange(opt)}
                                required={field.required}
                                className="accent-[#4a7c3f]"
                            />
                            {opt}
                        </label>
                    ))}
                </div>
            );
        case "checkbox":
            return (
                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={value === "true"}
                        onChange={(e) => onChange(String(e.target.checked))}
                        className="accent-[#4a7c3f] w-4 h-4"
                        aria-label={field.label}
                    />
                    {field.placeholder || field.label}
                </label>
            );
        case "date":
            return (
                <input
                    type="date"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required={field.required}
                    className={baseClass}
                    aria-label={field.label}
                />
            );
        default:
            return (
                <input
                    type={field.type === "email" ? "email" : field.type === "phone" ? "tel" : "text"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required={field.required}
                    placeholder={field.placeholder || ""}
                    className={baseClass}
                    aria-label={field.label}
                />
            );
    }
}

/* ──────────────────────────────────────────────
   Experience Modal (CMS-driven)
   ────────────────────────────────────────────── */

function ExperienceModal({
    card,
    onClose,
}: {
    card: ExperienceCard;
    onClose: () => void;
}) {
    const { data: session } = useSession();
    const [formValues, setFormValues] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [honeypot, setHoneypot] = useState("");

    // Initialize form values from card fields
    useEffect(() => {
        const initial: Record<string, string> = {};
        (card.fields || [])
            .sort((a, b) => a.order - b.order)
            .forEach((f) => {
                initial[f.name] = "";
            });
        setFormValues(initial);
    }, [card.fields]);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!session?.user) {
            toast.error("Please log in to submit a booking request", {
                description: "Click the login button in the header to sign in.",
                duration: 5000,
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/experiences-page/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    formCardId: card.id,
                    responses: formValues,
                    honeypot,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to submit");
            }

            toast.success(
                "Thank you! Your booking request has been submitted. We will get back to you shortly."
            );
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Failed to submit form");
        } finally {
            setIsSubmitting(false);
        }
    };

    const sortedFields = (card.fields || []).sort((a, b) => a.order - b.order);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-[modalIn_0.25s_ease-out] max-h-[90vh] overflow-y-auto">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-700 transition-colors text-2xl leading-none font-light"
                    aria-label="Close"
                >
                    ×
                </button>

                {/* Title */}
                <div className="px-6 pt-6 pb-3">
                    <h2 className="text-xl font-bold text-gray-900 pr-8">
                        {card.title}
                    </h2>
                </div>

                {/* Image */}
                <div className="relative w-full h-48 mx-0">
                    <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 448px) 100vw, 448px"
                    />
                </div>

                {/* Content */}
                <div className="px-6 pt-4 pb-6">
                    {card.subtitle && (
                        <p className="text-[#4a7c3f] italic text-sm mb-2">
                            {card.subtitle}
                        </p>
                    )}

                    <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                        {card.title}
                    </h3>

                    {/* Cost / Date / Time */}
                    {(card.cost || card.date || card.time) && (
                        <div className="flex justify-between items-start text-center mb-6 border-b border-gray-100 pb-4">
                            {card.cost && (
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 mb-0.5">Cost:</p>
                                    <p className="font-bold text-gray-900 text-base">{card.cost}</p>
                                </div>
                            )}
                            {card.date && (
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 mb-0.5">Date:</p>
                                    <p className="font-bold text-gray-900 text-base">{card.date}</p>
                                </div>
                            )}
                            {card.time && (
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 mb-0.5">Time:</p>
                                    <p className="font-bold text-gray-900 text-base">{card.time}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Includes */}
                    {card.includes && card.includes.length > 0 && (
                        <div className="mb-5">
                            <h4 className="font-bold text-gray-900 text-base mb-3">
                                Includes:
                            </h4>
                            <ul className="space-y-2">
                                {card.includes.map((item, i) => (
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
                    {card.description && (
                        <p className="text-sm text-gray-600 leading-relaxed mb-6">
                            {card.description}
                        </p>
                    )}

                    <hr className="border-gray-200 mb-6" />

                    {/* Dynamic Form */}
                    <h4 className="font-bold text-gray-900 text-base mb-4">
                        Book This Experience
                    </h4>

                    {!session?.user && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm text-amber-800">
                            Please log in to submit a booking request.
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Honeypot (hidden from humans) */}
                        <div className="hidden" aria-hidden="true">
                            <input
                                type="text"
                                tabIndex={-1}
                                autoComplete="off"
                                value={honeypot}
                                onChange={(e) => setHoneypot(e.target.value)}
                            />
                        </div>

                        {sortedFields.map((field) => (
                            <div key={field.id}>
                                <label className="block text-sm font-semibold text-gray-800 mb-1">
                                    {field.label}{" "}
                                    {field.required && (
                                        <span className="text-red-500">*</span>
                                    )}
                                </label>
                                <DynamicFormField
                                    field={field}
                                    value={formValues[field.name] || ""}
                                    onChange={(val) =>
                                        setFormValues((prev) => ({
                                            ...prev,
                                            [field.name]: val,
                                        }))
                                    }
                                />
                            </div>
                        ))}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#4a7c3f] hover:bg-[#3d6834] text-white font-semibold py-3 rounded-lg transition-colors duration-200 mt-1 disabled:opacity-50"
                        >
                            {isSubmitting ? "Submitting..." : "Send"}
                        </button>
                    </form>
                </div>
            </div>

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
    const [pageData, setPageData] = useState<ExperiencesPageData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selectedCard, setSelectedCard] = useState<ExperienceCard | null>(null);
    const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "" });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/experiences-page");
                if (res.ok) {
                    const data = await res.json();
                    setPageData(data);
                } else {
                    setError(true);
                }
            } catch {
                setError(true);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Thank you! We will get back to you shortly.");
        setContactForm({ name: "", email: "", phone: "" });
    };

    // Filter active cards
    const activeCards = (pageData?.formCards || [])
        .filter((c) => c.isActive)
        .sort((a, b) => a.order - b.order);
    const popularCards = activeCards.filter((c) => c.isPopular);
    const allCards = activeCards.filter((c) => !c.isPopular);

    return (
        <div className="min-h-screen bg-white">
            {/* ───── Hero Section ───── */}
            {isLoading ? (
                <HeroSkeleton />
            ) : pageData?.heroIsActive && pageData?.heroImage ? (
                <section className="relative h-[380px] sm:h-[440px] lg:h-[500px] overflow-hidden">
                    <Image
                        src={pageData.heroImage}
                        alt="Big Bear Forest Experience"
                        fill
                        priority
                        className="object-cover"
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-black/45" />

                    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
                        <h1 className="text-white font-bold leading-tight max-w-3xl">
                            <span className="block text-[60px] leading-[1.1]">
                                {pageData.heroTitle || "We've got the"}
                            </span>
                            {pageData.heroSubtitle && (
                                <span className="block text-[48px] leading-[1.1]">
                                    {pageData.heroSubtitle}
                                </span>
                            )}
                            {pageData.heroTagline && (
                                <span className="block font-medium text-[35px] leading-[1.2]">
                                    {pageData.heroTagline}
                                </span>
                            )}
                        </h1>

                        {pageData.heroCtaText && pageData.heroCtaLink && (
                            <a
                                href={pageData.heroCtaLink}
                                className="mt-6 inline-block bg-[#4a7c3f] hover:bg-[#3d6834] text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
                            >
                                {pageData.heroCtaText}
                            </a>
                        )}
                    </div>
                </section>
            ) : (
                <section className="relative h-[380px] sm:h-[440px] lg:h-[500px] overflow-hidden bg-gradient-to-br from-green-800 to-green-950">
                    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
                        <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight max-w-3xl">
                            Experiences in Big Bear
                        </h1>
                    </div>
                </section>
            )}

            {/* ───── Most Popular ───── */}
            {(isLoading || popularCards.length > 0) && (
                <section className="py-12 sm:py-16 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                        <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
                            <span className="border-b-4 border-[#4a7c3f] pb-2">
                                Most Popular
                            </span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {isLoading
                                ? Array.from({ length: 3 }).map((_, i) => (
                                    <CardSkeleton key={i} />
                                ))
                                : popularCards.map((card) => (
                                    <PopularCard
                                        key={card.id}
                                        title={card.title}
                                        image={card.image}
                                        onOpen={() => setSelectedCard(card)}
                                    />
                                ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ───── Description ───── */}
            <section className="py-8 sm:py-12 bg-gray-50">
                <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-4xl">
                    {pageData?.heroDescription ? (
                        <div
                            className="prose prose-sm sm:prose-base max-w-none text-center text-gray-600"
                            dangerouslySetInnerHTML={{
                                __html: pageData.heroDescription,
                            }}
                        />
                    ) : (
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
                    )}
                </div>
            </section>

            {/* ───── Experiences Grid ───── */}
            <section className="py-12 sm:py-16 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                    <h2 className="text-center text-xl sm:text-2xl font-bold text-gray-900 mb-10">
                        Choose the experiences that you would like to book
                    </h2>

                    {isLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <CardSkeleton key={i} />
                            ))}
                        </div>
                    ) : allCards.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {allCards.map((card) => (
                                <ExperienceCardComp
                                    key={card.id}
                                    title={card.title}
                                    image={card.image}
                                    onOpen={() => setSelectedCard(card)}
                                />
                            ))}
                        </div>
                    ) : !error ? (
                        <p className="text-center text-gray-500">
                            No experiences available at this time.
                        </p>
                    ) : null}

                    {error && (
                        <p className="text-center text-red-500 mt-4">
                            Unable to load experiences. Please try again later.
                        </p>
                    )}
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

                        <form onSubmit={handleContactSubmit} className="space-y-5">
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
                                    value={contactForm.name}
                                    onChange={(e) =>
                                        setContactForm((p) => ({ ...p, name: e.target.value }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a7c3f]/40 focus:border-[#4a7c3f] transition-colors"
                                    placeholder="Your full name"
                                />
                            </div>

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
                                    value={contactForm.email}
                                    onChange={(e) =>
                                        setContactForm((p) => ({ ...p, email: e.target.value }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a7c3f]/40 focus:border-[#4a7c3f] transition-colors"
                                    placeholder="you@email.com"
                                />
                            </div>

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
                                    value={contactForm.phone}
                                    onChange={(e) =>
                                        setContactForm((p) => ({ ...p, phone: e.target.value }))
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
            {selectedCard && (
                <ExperienceModal
                    card={selectedCard}
                    onClose={() => setSelectedCard(null)}
                />
            )}
        </div>
    );
}
