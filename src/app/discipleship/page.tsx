/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { DiscipleshipHeroSection } from "~/app/_components/DiscipleshipHeroSection";
import { getSiteContent } from "~/server/site-content";
import { DiscipleshipTestimoniesSection } from "../_components/DiscipleshipTestimoniesSection";
import { CopyrightFooter } from "../_components/CopyrightFooter";
import { DiscipleshipNextStepsSection } from "../_components/DiscipleshipNextStepsSection";

export const dynamic = "force-dynamic";

export default async function DiscipleshipPage() {
  const content = await getSiteContent();

  return (
    <main className="min-h-screen bg-gray-50 pt-40">
      <DiscipleshipHeroSection
        eyebrow={content.discipleshipHeroEyebrow}
        title={content.discipleshipHeroTitle}
        subtitle={content.discipleshipHeroSubtitle}
      />

      <DiscipleshipTestimoniesSection
        eyebrow={content.discipleshipTestimoniesEyebrow}
        title={content.discipleshipTestimoniesTitle}
        intro={content.discipleshipTestimoniesIntro}
      />

      <DiscipleshipNextStepsSection
        eyebrow={content.discipleshipNextEyebrow}
        title={content.discipleshipNextTitle}
        cards={[
          {
            icon: "community",
            eyebrow: content.discipleshipCard1Eyebrow,
            title: content.discipleshipCard1Title,
            body: content.discipleshipCard1Body,
            contact: content.discipleshipCard1Contact,
            email: content.discipleshipCard1Email,
            phone: content.discipleshipCard1Phone,
          },
          {
            icon: "cross",
            eyebrow: content.discipleshipCard2Eyebrow,
            title: content.discipleshipCard2Title,
            body: content.discipleshipCard2Body,
            contact: content.discipleshipCard2Contact,
            email: content.discipleshipCard2Email,
            phone: content.discipleshipCard2Phone,
          },
          {
            icon: "missions",
            eyebrow: content.discipleshipCard3Eyebrow,
            title: content.discipleshipCard3Title,
            body: content.discipleshipCard3Body,
            contact: content.discipleshipCard3Contact,
            email: content.discipleshipCard3Email,
            phone: content.discipleshipCard3Phone,
          },
        ]}
      />

      <CopyrightFooter />
    </main>
  );
}
