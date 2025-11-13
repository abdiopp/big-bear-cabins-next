import Hero from "./Hero";
import { FeaturedRentals } from "./FeaturedRentals";
import { LongTermRentals } from "./LongTermRentals";
import { ThingsToDo } from "./ThingsToDo";
import { PropertyManagement } from "./PropertyManagement";
import SpecialOffers from "./SpecialOffers";

export function HomePage() {
  return (
    <>
      <Hero />
      <main className="flex-1">
        <FeaturedRentals />
        <LongTermRentals />
        <ThingsToDo />
        <SpecialOffers />
        <PropertyManagement />
      </main>
    </>
  );
}
