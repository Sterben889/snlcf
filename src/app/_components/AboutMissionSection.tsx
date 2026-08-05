type AboutMissionSectionProps = {
  title: string;
  statement: string;
};

export function AboutMissionSection({
  title,
  statement,
}: AboutMissionSectionProps) {
  return (
    <section className="bg-gray-50 px-4 py-16 text-blue-950 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h2>

        <div className="mt-10 rounded-xl bg-white px-6 py-10 text-center shadow-lg sm:px-10">
          <p className="text-lg leading-8 whitespace-pre-line text-slate-800 sm:text-xl">
            {statement}
          </p>
        </div>
      </div>
    </section>
  );
}
