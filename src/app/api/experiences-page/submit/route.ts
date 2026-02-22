import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        // Require authentication
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json(
                { error: "You must be logged in to submit a form" },
                { status: 401 }
            );
        }

        const data = await req.json();

        // Honeypot check – if filled, silently reject
        if (data.honeypot) {
            // Return success to not tip off bots
            return NextResponse.json({ success: true });
        }

        // Rate limiting: max 1 submission per user per 60 seconds
        const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
        const recentSubmission = await prisma.experienceFormResponse.findFirst({
            where: {
                userId: session.user.id,
                submittedAt: { gte: oneMinuteAgo },
            },
        });

        if (recentSubmission) {
            return NextResponse.json(
                { error: "Please wait before submitting another form" },
                { status: 429 }
            );
        }

        // Validate required fields
        if (!data.formCardId) {
            return NextResponse.json(
                { error: "Form card ID is required" },
                { status: 400 }
            );
        }

        if (!data.responses || typeof data.responses !== "object") {
            return NextResponse.json(
                { error: "Form responses are required" },
                { status: 400 }
            );
        }

        // Server-side validation: fetch the page to get field configs
        const page = await prisma.experiencesPage.findFirst();
        if (page) {
            const card = page.formCards.find(
                (c: { id: string }) => c.id === data.formCardId
            );
            if (card && card.fields) {
                for (const field of card.fields) {
                    const value = data.responses[field.name];
                    if (field.required && (!value || String(value).trim() === "")) {
                        return NextResponse.json(
                            { error: `${field.label} is required` },
                            { status: 400 }
                        );
                    }
                    // Type-based validation
                    if (value && field.type === "email") {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(String(value))) {
                            return NextResponse.json(
                                { error: `${field.label} must be a valid email` },
                                { status: 400 }
                            );
                        }
                    }
                    if (value && field.type === "phone") {
                        const phoneRegex = /^[+\d\s\-().]{7,20}$/;
                        if (!phoneRegex.test(String(value))) {
                            return NextResponse.json(
                                { error: `${field.label} must be a valid phone number` },
                                { status: 400 }
                            );
                        }
                    }
                }
            }
        }

        // Get request metadata
        const userAgent = req.headers.get("user-agent") || undefined;
        const ip =
            req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            req.headers.get("x-real-ip") ||
            undefined;

        const response = await prisma.experienceFormResponse.create({
            data: {
                userId: session.user.id,
                formCardId: data.formCardId,
                responses: data.responses,
                status: "new",
                userAgent,
                ip,
                honeypot: data.honeypot || null,
            },
        });

        return NextResponse.json({ success: true, id: response.id });
    } catch (error) {
        console.error("Failed to submit experience form:", error);
        return NextResponse.json(
            { error: "Failed to submit form" },
            { status: 500 }
        );
    }
}
