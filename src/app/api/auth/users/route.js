import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export const GET = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        console.log("Fetched users:", users);
        return NextResponse.json(users, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: 'Error fetching users', err }, { status: 500 });
    }
};


export const PATCH = async (req, res) => {
    const { id, role } = await req.json();
    try {
        const updatedUser = await prisma.user.update({
            where: { id: id },
            data: { role },
        });
        return NextResponse.json(updatedUser, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: 'Error updating user role', err }, { status: 500 });
    }
};
