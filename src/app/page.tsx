/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { DescSection } from "~/app/_components/DescSection";
import { HeroSection } from "~/app/_components/herosection";
import { MissionSection } from "~/app/_components/MissionSection";
import { LatestSermonSection } from "~/app/_components/LatestSermonSection";
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

      <MissionSection
        title={content.missionTitle}
        transformation={content.missionTransformation}
        disciplesTitle={content.missionDisciplesTitle}
        disciplesSubtitle={content.missionDisciplesSubtitle}
        statement={content.missionStatement}
      />

      <LatestSermonSection />
    </main>
  );
}
