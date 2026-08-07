/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { GiveHeroSection } from "~/app/_components/GiveHeroSection";
import { getSiteContent } from "~/server/site-content";
import { GiveScriptureSection } from "../_components/GiveScriptureSection";
import { GiveWaysSection } from "../_components/GiveWaysSection";
import { CopyrightFooter } from "../_components/CopyrightFooter";
import { GiveThankYouSection } from "../_components/GiveThankYouSection";

export const dynamic = "force-dynamic";

export default async function GivePage() {
  const content = await getSiteContent();

  return (
    <main className="min-h-screen bg-gray-50 pt-40">
      <GiveHeroSection
        title={content.giveHeroTitle}
        subtitle={content.giveHeroSubtitle}
      />

      <GiveScriptureSection
        reference={content.giveVerseReference}
        verse={content.giveVerseText}
      />

      <GiveWaysSection title={content.giveWaysTitle} />

      <GiveThankYouSection
        title={content.giveThanksTitle}
        body={content.giveThanksBody}
      />

      <CopyrightFooter />
    </main>
  );
}
