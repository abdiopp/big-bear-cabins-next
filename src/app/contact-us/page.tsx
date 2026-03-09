"use client";

import { useEffect, useState } from "react";
import { ImageWithFallback } from "@/components/ImageWithFallback";

export default function Page() {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{
        type: "success" | "error" | null;
        message: string;
    }>({
        type: null,
        message: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        setLoading(true);
        setStatus({ type: null, message: "" });

        try {

            const res = await fetch("/api/contact-us", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            setStatus({
                type: "success",
                message: "Your message has been sent successfully!"
            });

            setFormData({
                name: "",
                email: "",
                subject: "",
                message: "",
            });

        } catch (error: any) {

            setStatus({
                type: "error",
                message: error.message || "Failed to send message"
            });

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status.type) {
            const timer = setTimeout(() => {
                setStatus({ type: null, message: "" });
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [status]);

    return (
        <main className="min-h-screen bg-white overflow-x-hidden">

            {/* Hero Section */}
            <section className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
                <ImageWithFallback
                    src="https://res.cloudinary.com/dtqdflngh/image/upload/v1770838073/lyn5ilsj28ma6zzouw2f.jpg"
                    alt="Contact us"
                    className="w-full h-full object-cover object-[center_25%]"
                />

                <div className="absolute inset-0 bg-black/30" />

                <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                    <h1 className="text-white text-4xl md:text-6xl font-bold">
                        Contact
                    </h1>
                </div>
            </section>

            {/* Content */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                <div className="grid md:grid-cols-2 gap-10">

                    {/* Left Side */}
                    <div className="space-y-8">

                        {/* Contact Info */}
                        <div className="bg-gray-50 rounded-xl p-6 shadow-sm">

                            <h2 className="text-2xl font-semibold mb-6">
                                Contact Information
                            </h2>

                            <div className="space-y-3 text-gray-700">

                                <div className="flex justify-between">
                                    <span className="font-semibold">Company</span>
                                    <span>Big Bear Vacations</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-semibold">Address</span>
                                    <span>41693 Big Bear Blvd</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-semibold">Address 2</span>
                                    <span>PO Box 110410</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-semibold">City</span>
                                    <span>Big Bear Lake, CA</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-semibold">Zip Code</span>
                                    <span>92315</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-semibold">Phone</span>
                                    <a
                                        href="tel:8774735360"
                                        className="text-blue-600 hover:underline"
                                    >
                                        (877) 473-5360
                                    </a>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-semibold">Email</span>
                                    <a
                                        href="mailto:reservations@bigbearvacations.com"
                                        className="text-blue-600 hover:underline"
                                    >
                                        reservations@bigbearvacations.com
                                    </a>
                                </div>

                            </div>
                        </div>

                        {/* Map */}
                        <div className="rounded-xl overflow-hidden shadow-md">

                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3298.144541980834!2d-116.8940248!3d34.2448552!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c4b3890b35f821%3A0xef67332c88fd5ac9!2sBig%20Bear%20Cabins!5e0!3m2!1sen!2srs!4v1657528932930!5m2!1sen!2srs"
                                width="100%"
                                height="350"
                                loading="lazy"
                                className="border-0"
                            ></iframe>

                        </div>

                    </div>

                    {/* Contact Form */}
                    <div className="bg-white border rounded-xl p-8 shadow-sm">

                        <h2 className="text-2xl font-semibold mb-6">
                            Send us a message
                        </h2>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Your Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Your Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Subject
                                </label>

                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Your Message
                                </label>

                                <textarea
                                    name="message"
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            {status.type && (
                                <div
                                    className={`p-3 rounded-md text-sm font-medium ${status.type === "success"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {status.message}
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-400"
                            >
                                {loading ? "Sending..." : "Send Message"}
                            </button>
                        </form>

                    </div>

                </div>

            </section>

        </main>
    );
}