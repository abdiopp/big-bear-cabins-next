import { Suspense } from "react";
import { SearchPage } from "@/components/SearchPage";

export const metadata = {
  title: "Search Cabins – Big Bear Cabins",
  description:
    "Browse and filter cabin rentals in Big Bear Lake. Find the perfect mountain getaway with our interactive map search.",
};

export default function Search() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[calc(100vh-96px)]">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-800 border-t-transparent" />
        </div>
      }
    >
      <SearchPage />
    </Suspense>
  );
}
