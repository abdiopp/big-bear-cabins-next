import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";

// Public: fetch published experiences page data
export async function GET() {
    try {
        const page = await prisma.experiencesPage.findFirst();
        return NextResponse.json(
            page || {
                heroTitle: "",
                heroSubtitle: "",
                heroTagline: "",
                heroDescription: "",
                heroImage: "",
                heroCtaText: "",
                heroCtaLink: "",
                heroIsActive: true,
                formCards: [],
                isPublished: false,
            }
        );
    } catch (error) {
        console.error("Failed to fetch experiences page:", error);
        return NextResponse.json(
            { error: "Failed to fetch experiences page" },
            { status: 500 }
        );
    }
}

// Admin: save experiences page data
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();

        // Validate hero title
        if (!data.heroTitle || data.heroTitle.length > 120) {
            return NextResponse.json(
                { error: "Hero title is required (max 120 chars)" },
                { status: 400 }
            );
        }

        // Validate hero subtitle length
        if (data.heroSubtitle && data.heroSubtitle.length > 200) {
            return NextResponse.json(
                { error: "Hero subtitle max 200 chars" },
                { status: 400 }
            );
        }

        // Validate CTA link format
        if (
            data.heroCtaLink &&
            !/^(\/|https?:\/\/)/.test(data.heroCtaLink)
        ) {
            return NextResponse.json(
                { error: "CTA link must be a valid URL or internal path" },
                { status: 400 }
            );
        }

        // Validate form card field names are unique within each card
        if (data.formCards) {
            for (const card of data.formCards) {
                if (card.fields && card.fields.length > 0) {
                    const names = card.fields.map((f: { name: string }) => f.name);
                    const uniqueNames = new Set(names);
                    if (names.length !== uniqueNames.size) {
                        return NextResponse.json(
                            {
                                error: `Duplicate field names in card "${card.title}"`,
                            },
                            { status: 400 }
                        );
                    }
                }
            }
        }

        const existing = await prisma.experiencesPage.findFirst();

        let saved;
        if (existing) {
            saved = await prisma.experiencesPage.update({
                where: { id: existing.id },
                data: {
                    heroTitle: data.heroTitle,
                    heroSubtitle: data.heroSubtitle || null,
                    heroTagline: data.heroTagline || null,
                    heroDescription: data.heroDescription || null,
                    heroImage: data.heroImage,
                    heroCtaText: data.heroCtaText || null,
                    heroCtaLink: data.heroCtaLink || null,
                    heroIsActive: data.heroIsActive ?? true,
                    formCards: data.formCards || [],
                    isPublished: data.isPublished ?? false,
                },
            });
        } else {
            saved = await prisma.experiencesPage.create({
                data: {
                    heroTitle: data.heroTitle,
                    heroSubtitle: data.heroSubtitle || null,
                    heroTagline: data.heroTagline || null,
                    heroDescription: data.heroDescription || null,
                    heroImage: data.heroImage,
                    heroCtaText: data.heroCtaText || null,
                    heroCtaLink: data.heroCtaLink || null,
                    heroIsActive: data.heroIsActive ?? true,
                    formCards: data.formCards || [],
                    isPublished: data.isPublished ?? false,
                },
            });
        }

        return NextResponse.json(saved);
    } catch (error) {
        console.error("Failed to save experiences page:", error);
        return NextResponse.json(
            { error: "Failed to save experiences page" },
            { status: 500 }
        );
    }
}
