import { Globe } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

const footerSections = [
  {
    title: "Support",
    links: [
      "Help Center",
      "Anti-discrimination",
      "Disability support",
      "Cancellation options",
      "Report neighborhood concern",
    ],
  },
  {
    title: "Hosting",
    links: [
      "List your cabin",
      "Hosting resources",
      "Community forum",
      "Hosting responsibly",
    ],
  },
  {
    title: "BigBear Cabins",
    links: [
      "New features",
      "Careers",
      "Emergency stays",
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-medium mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="mb-6" />

        {/* Bottom footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>© 2024 BigBear Cabins</span>
            <button className="hover:text-foreground">Terms</button>
            <button className="hover:text-foreground">Sitemap</button>
            <button className="hover:text-foreground">Privacy</button>
            <button className="hover:text-foreground">Your Privacy Choices</button>
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