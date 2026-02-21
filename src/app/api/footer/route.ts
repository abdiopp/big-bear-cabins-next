import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const footer = await prisma.footer.findFirst();
        return NextResponse.json(footer || { sections: [], socialLinks: [] });
    } catch (error) {
        console.error("Failed to fetch footer:", error);
        return NextResponse.json({ error: "Failed to fetch footer" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();

        // There should ideally only be one footer record.
        const existingFooter = await prisma.footer.findFirst();

        let savedFooter;
        if (existingFooter) {
            savedFooter = await prisma.footer.update({
                where: { id: existingFooter.id },
                data: {
                    sections: data.sections,
                    socialLinks: data.socialLinks,
                },
            });
        } else {
            savedFooter = await prisma.footer.create({
                data: {
                    sections: data.sections,
                    socialLinks: data.socialLinks,
                },
            });
        }

        return NextResponse.json(savedFooter);
    } catch (error) {
        console.error("Failed to save footer:", error);
        return NextResponse.json({ error: "Failed to save footer" }, { status: 500 });
    }
}
