type MissionSectionProps = {
  title: string;
  transformation: string;
  disciplesTitle: string;
  disciplesSubtitle: string;
  statement: string;
};

export function MissionSection({
  title,
  transformation,
  disciplesTitle,
  disciplesSubtitle,
  statement,
}: MissionSectionProps) {
  return (
    <section className="bg-blue-950 px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-blue-900 px-6 py-12 text-center text-white shadow-2xl sm:px-12 lg:px-20">
        <h2 className="mx-auto max-w-3xl text-3xl leading-tight font-bold whitespace-pre-line uppercase sm:text-4xl">
          {title}
        </h2>

        <p className="mx-auto mt-7 max-w-3xl text-lg leading-relaxed whitespace-pre-line sm:text-xl">
          {transformation}
        </p>

        <div className="mt-9">
          <h3 className="text-2xl font-bold uppercase sm:text-3xl">
            {disciplesTitle}
          </h3>

          <p className="mt-1 text-xl tracking-wide uppercase sm:text-2xl">
            {disciplesSubtitle}
          </p>
        </div>

        <div className="my-9 border-t border-white/25" />

        <p className="mx-auto max-w-4xl text-lg leading-relaxed whitespace-pre-line sm:text-xl">
          {statement}
        </p>
      </div>
    </section>
  );
}
