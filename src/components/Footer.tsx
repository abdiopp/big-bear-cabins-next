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
  const footerData = await prisma.footer.findFirst();

  const sections = footerData?.sections?.length ? footerData.sections : fallbackSections;
  const socialLinks = footerData?.socialLinks || [];

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>© {new Date().getFullYear()} BigBear Cabins</span>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/privacy-policy" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="/contact-us" className="hover:text-foreground">Contact Us</Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-sm">
              <Globe className="h-4 w-4 mr-2" />
              English (US)
            </Button>
            <Button variant="ghost" size="sm" className="text-sm">
              $ USD
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}