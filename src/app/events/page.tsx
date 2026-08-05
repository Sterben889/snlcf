/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { EventsHeroSection } from "~/app/_components/EventsHeroSection";
import { getSiteContent } from "~/server/site-content";
import { EventsCalendarSection } from "../_components/EventsCalendarSection";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const content = await getSiteContent();

  return (
    <main className="min-h-screen bg-gray-50 pt-40">
      <EventsHeroSection
        title={content.eventsHeroTitle}
        subtitle={content.eventsHeroSubtitle}
      />

      <EventsCalendarSection />
    </main>
  );
}
