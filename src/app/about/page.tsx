/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AboutHeroSection } from "~/app/_components/AboutHeroSection";
import { getSiteContent } from "~/server/site-content";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const content = await getSiteContent();

  return (
    <main className="min-h-screen bg-gray-50 pt-40">
      <AboutHeroSection
        title={content.aboutHeroTitle}
        subtitle={content.aboutHeroSubtitle}
      />

      {/* Additional About Us sections will go here. */}
    </main>
  );
}
