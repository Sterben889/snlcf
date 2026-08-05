/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AboutHeroSection } from "~/app/_components/AboutHeroSection";
import { AboutMissionSection } from "~/app/_components/AboutMissionSection";
import { AboutWhoSection } from "~/app/_components/AboutWhoSection";
import { getSiteContent } from "~/server/site-content";
import { CopyrightFooter } from "../_components/CopyrightFooter";
import { AboutVisionPrayerSection } from "../_components/AboutVisionPrayerSection";
import { StatementOfFaithSection } from "~/app/_components/StatementOfFaithSection";
import { LeadershipTeamSection } from "../_components/LeadershipTeamSection";
import { AboutCallToActionSection } from "../_components/AboutCallToActionSection";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const content = await getSiteContent();

  return (
    <main className="min-h-screen bg-gray-50 pt-40">
      <AboutHeroSection
        title={content.aboutHeroTitle}
        subtitle={content.aboutHeroSubtitle}
      />

      <AboutWhoSection
        title={content.aboutWhoTitle}
        paragraph1={content.aboutWhoParagraph1}
        paragraph2={content.aboutWhoParagraph2}
        paragraph3={content.aboutWhoParagraph3}
      />

      <AboutMissionSection
        title={content.aboutMissionTitle}
        statement={content.missionStatement}
      />

      <AboutVisionPrayerSection
        sectionTitle={content.aboutVisionTitle}
        prayerTitle={content.missionTitle}
        transformation={content.missionTransformation}
        disciplesTitle={content.missionDisciplesTitle}
        disciplesSubtitle={content.missionDisciplesSubtitle}
      />

      <StatementOfFaithSection />

      <LeadershipTeamSection />

      <AboutCallToActionSection
        title={content.aboutCtaTitle}
        body={content.aboutCtaBody}
        visitButtonText={content.aboutCtaVisitText}
        visitButtonUrl={content.aboutCtaVisitUrl}
        eventsButtonText={content.aboutCtaEventsText}
        eventsButtonUrl={content.aboutCtaEventsUrl}
      />

      <CopyrightFooter />
    </main>
  );
}
