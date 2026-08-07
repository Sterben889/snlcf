/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { GatherHeroSection } from "~/app/_components/GatherHeroSection";
import { getSiteContent } from "~/server/site-content";
import { GatherWaysSection } from "../_components/GatherWaysSection";
import { CopyrightFooter } from "../_components/CopyrightFooter";
import { GatherCallToActionSection } from "../_components/GatherCallToActionSection";

export const dynamic = "force-dynamic";

export default async function GatherPage() {
  const content = await getSiteContent();

  return (
    <main className="min-h-screen bg-gray-50 pt-40">
      <GatherHeroSection
        title={content.gatherHeroTitle}
        subtitle={content.gatherHeroSubtitle}
      />

      <GatherWaysSection title={content.gatherWaysTitle} />

      <GatherCallToActionSection
        title={content.gatherCtaTitle}
        body={content.gatherCtaBody}
        eventsButtonText={content.gatherCtaEventsText}
        aboutButtonText={content.gatherCtaAboutText}
      />

      <CopyrightFooter />
    </main>
  );
}
