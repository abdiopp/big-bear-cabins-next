"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

type LinkType = {
  id: string;
  label: string;
  url: string;
  isExternal: boolean;
  newTab: boolean;
};

type SectionType = {
  title: string;
  links: LinkType[];
};

export function FooterNavigationLinks({ sections }: { sections: SectionType[] }) {
  const searchParams = useSearchParams();

  // Get already active filters from URL (if any)
  const existingFilters = searchParams.get("filters");

  return (
    <>
      {sections.map((section) => {

        return (
          <div key={section.title}>
            <h3 className="font-medium mb-4">{section.title}</h3>

            <ul className="space-y-3">
              {section.links.map((link) => {
                let href = link.url;

                if (section.title == "BigBear Cabins") {
                  const filterName = link.label
                    .toLowerCase()
                    .replace(/\s+/g, "")
                    .replace(/[^a-z]/g, "");

                  let newFilters = filterName;
                  if (existingFilters) {
                    const filtersArray = existingFilters.split(",");

                    if (!filtersArray.includes(filterName)) {
                      filtersArray.push(filterName);
                    }

                    newFilters = filtersArray.join(",");
                  }

                  href = `/search?filters=${newFilters}`;
                }

                return (
                  <li key={link.id}>
                    <Link
                      href={href}
                      target={link.newTab ? "_blank" : "_self"}
                      rel={link.isExternal ? "noopener noreferrer" : undefined}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </>
  );
}