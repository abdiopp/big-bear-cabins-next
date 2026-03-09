import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// CREATE CONTACT MESSAGE
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, subject, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Required fields missing" },
                { status: 400 }
            );
        }

        const contact = await prisma.contactMessage.create({
            data: {
                name,
                email,
                subject,
                message,
            },
        });

        return NextResponse.json(contact);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create message" },
            { status: 500 }
        );
    }
}

// GET ALL CONTACT MESSAGES
export async function GET() {
    try {
        const contacts = await prisma.contactMessage.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(contacts);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch messages" },
            { status: 500 }
        );
    }
}