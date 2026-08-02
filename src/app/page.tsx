/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { DescSection } from "~/app/_components/DescSection";
import { HeroSection } from "~/app/_components/herosection";
import { getSiteContent } from "~/server/site-content";

export default async function Home() {
  const content = await getSiteContent();

  return (
    <main>
      <HeroSection
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
        backgroundImageUrl={content.heroImageUrl}
      />

      <DescSection />
    </main>
  );
}
