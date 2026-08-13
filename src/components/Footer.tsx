import { Globe } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { FooterNavigationLinks } from "./FooterNavigationLinks";
import { Suspense } from "react";

// Fallback hardcoded sections if database is empty
const fallbackSections = [
  {
    title: "Support",
    links: [
      { id: "1", label: "Help Center", url: "#", isExternal: false, newTab: false },
      { id: "2", label: "Cancellation options", url: "#", isExternal: false, newTab: false },
    ],
  },
  {
    title: "Hosting",
    links: [
      { id: "3", label: "List your cabin", url: "#", isExternal: false, newTab: false },
      { id: "4", label: "Hosting resources", url: "#", isExternal: false, newTab: false },
    ],
  },
];

export async function Footer() {
  let footerData: Awaited<ReturnType<typeof prisma.footer.findFirst>> | null = null;
  try {
    footerData = await prisma.footer.findFirst();
  } catch (error) {
    console.error("Footer query failed, using fallback footer data:", error);
  }

  const sections = footerData?.sections?.length ? footerData.sections : fallbackSections;
  const socialLinks = footerData?.socialLinks || [];

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-4 pt-10 md:py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <Suspense fallback={null}>
            <FooterNavigationLinks sections={sections} />
          </Suspense>

          {/* Social Links column if they exist */}
          {socialLinks.length > 0 && (
            <div>
              <h3 className="font-medium mb-4">Follow Us</h3>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity"
                    title={social.platform || social.altText || "Social Link"}
                  >
                    <div className="relative w-6 h-6">
                      <Image
                        src={social.icon}
                        alt={social.altText || social.platform || "Social Icon"}
                        fill
                        className="object-cover size-12"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <Separator className="mb-6" />

        {/* Bottom footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-3 md:gap-6">

          {/* Left */}
          <div className="flex flex-wrap items-center justify-center md:justify-start! gap-x-4 gap-y-2 text-sm text-muted-foreground order-1">
            <span>© {new Date().getFullYear()} BigBear Cabins</span>

            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms
            </Link>

            <Link
              href="/privacy-policy"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>

            <Link
              href="/contact-us"
              className="hover:text-foreground transition-colors"
            >
              Contact Us
            </Link>
          </div>

          {/* Center - Desktop center, Mobile LAST */}
          <div className="flex justify-center order-3 md:order-2">
            <p className="text-gray-400 text-sm flex items-center gap-1.5">
              Powered by{" "}
              <a
                href="https://www.instagram.com/thedigitalweb.co?igsh=b2UyZjJ1OWhienVt&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#3d72e6] font-semibold underline hover:brightness-110 tracking-wider transition-colors"
              >
                Digital Web
              </a>
            </p>
          </div>

          {/* Right */}
          <div className="flex items-center justify-center md:justify-end! space-x-2 order-2 md:order-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-sm"
            >
              <Globe className="h-4 w-4 mr-2" />
              English (US)
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-sm"
            >
              $ USD
            </Button>
          </div>

        </div>
      </div>
    </footer>
  );
}
