/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ServeHeroSection } from "~/app/_components/ServeHeroSection";
import { getSiteContent } from "~/server/site-content";
import { ServeIntroSection } from "../_components/ServeIntroSection";
import { ServeMinistriesSection } from "../_components/ServeMinistriesSection";
import { ServeCallToActionSection } from "../_components/ServeCallToActionSection";
import { CopyrightFooter } from "../_components/CopyrightFooter";

export const dynamic = "force-dynamic";

export default async function ServePage() {
  const content = await getSiteContent();

  return (
    <main className="min-h-screen bg-gray-50 pt-40">
      <ServeHeroSection
        title={content.serveHeroTitle}
        subtitle={content.serveHeroSubtitle}
      />

      <ServeIntroSection
        title={content.serveIntroTitle}
        body={content.serveIntroBody}
      />

      <ServeMinistriesSection title={content.serveMinistriesTitle} />

      <ServeCallToActionSection
        eyebrow={content.serveCtaEyebrow}
        title={content.serveCtaTitle}
        body={content.serveCtaBody}
        buttonText={content.serveCtaButtonText}
        buttonUrl={content.serveCtaButtonUrl}
        imageUrl={content.serveCtaImageUrl}
      />

      <CopyrightFooter />
    </main>
  );
}
