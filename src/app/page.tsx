/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { DescSection } from "~/app/_components/DescSection";
import { HeroSection } from "~/app/_components/herosection";
import { getSiteContent } from "~/server/site-content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getSiteContent();

  return (
    <main>
      <HeroSection
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
        backgroundImageUrl={content.heroImageUrl}
      />

      <DescSection
        title={content.descTitle}
        body={content.descBody}
        imageUrl={content.descImageUrl}
        serviceTime={content.descTime}
        serviceLocation={content.descLocation}
        buttonText={content.descButtonText}
        buttonUrl={content.descButtonUrl}
      />
    </main>
  );
}
