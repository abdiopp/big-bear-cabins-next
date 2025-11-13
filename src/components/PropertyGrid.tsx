import { ReactNode } from "react";

interface PropertyGridProps {
  children: ReactNode;
}

export function PropertyGrid({ children }: PropertyGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {children}
    </div>
  );
}