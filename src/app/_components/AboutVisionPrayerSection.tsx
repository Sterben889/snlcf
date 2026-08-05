type AboutVisionPrayerSectionProps = {
  sectionTitle: string;
  prayerTitle: string;
  transformation: string;
  disciplesTitle: string;
  disciplesSubtitle: string;
};

export function AboutVisionPrayerSection({
  sectionTitle,
  prayerTitle,
  transformation,
  disciplesTitle,
  disciplesSubtitle,
}: AboutVisionPrayerSectionProps) {
  return (
    <section className="bg-blue-950 px-4 py-16 text-white sm:px-6 lg:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          {sectionTitle}
        </h2>

        <div className="mt-10 rounded-2xl border border-white/10 bg-blue-900 px-6 py-10 text-center shadow-2xl sm:px-10 lg:px-16 lg:py-12">
          <h3 className="text-xl leading-relaxed font-bold whitespace-pre-line sm:text-2xl">
            {prayerTitle}
          </h3>

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-relaxed whitespace-pre-line text-blue-100 sm:text-xl">
            {transformation}
          </p>

          <div className="mt-8">
            <p className="text-xl font-bold uppercase sm:text-2xl">
              {disciplesTitle}
            </p>

            <p className="mt-1 text-lg tracking-wide text-blue-100 uppercase sm:text-xl">
              {disciplesSubtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
