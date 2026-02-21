import { Globe } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

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
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="font-medium mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.url}
                      target={link.newTab ? "_blank" : "_self"}
                      rel={link.isExternal ? "noopener noreferrer" : undefined}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

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
                        className="object-contain"
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
            <Link href="#" className="hover:text-foreground">Terms</Link>
            <Link href="#" className="hover:text-foreground">Sitemap</Link>
            <Link href="#" className="hover:text-foreground">Privacy</Link>
            <Link href="#" className="hover:text-foreground">Your Privacy Choices</Link>
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