"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getHomeHero() {
    const data = await prisma.homeHero.findFirst();
    return data;
}

export async function updateHomeHero(data: any) {
    // Check auth here if needed, but layout will also protect it.
    // Ideally use verifySession() or similar.
    // For now assuming unprotected action (protected by route).

    const existing = await prisma.homeHero.findFirst();

    if (existing) {
        await prisma.homeHero.update({
            where: { id: existing.id },
            data: {
                heading: data.heading,
                images: data.images, // Expecting array of objects { url }
                links: data.links,   // Expecting array of objects { url, text, icon }
            }
        });
    } else {
        await prisma.homeHero.create({
            data: {
                heading: data.heading,
                images: data.images,
                links: data.links,
            }
        });
    }

    revalidatePath("/");
    return { success: true };
}

export async function getCoupons() {
    const data = await prisma.couponSection.findFirst();
    return data;
}

export async function updateCoupons(data: any) {
    const existing = await prisma.couponSection.findFirst();

    if (existing) {
        await prisma.couponSection.update({
            where: { id: existing.id },
            data: {
                carouselTitle: data.carouselTitle,
                offers: data.offers,
                viewAllBtnLabel: data.viewAllBtnLabel,
                viewAllBtnUrl: data.viewAllBtnUrl,
            }
        });
    } else {
        await prisma.couponSection.create({
            data: {
                carouselTitle: data.carouselTitle,
                offers: data.offers,
                viewAllBtnLabel: data.viewAllBtnLabel,
                viewAllBtnUrl: data.viewAllBtnUrl,
            }
        });
    }

    revalidatePath("/");
    return { success: true };
}
