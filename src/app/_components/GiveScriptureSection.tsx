type GiveScriptureSectionProps = {
  reference: string;
  verse: string;
};

export function GiveScriptureSection({
  reference,
  verse,
}: GiveScriptureSectionProps) {
  return (
    <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-xl border border-gray-100 bg-white px-6 py-12 text-center shadow-lg sm:px-10 lg:px-16">
          <p className="text-lg font-semibold text-blue-800 sm:text-xl">
            {reference}
          </p>

          <blockquote className="mx-auto mt-7 max-w-3xl">
            <p className="text-xl leading-9 font-medium whitespace-pre-line text-slate-800 italic sm:text-2xl sm:leading-10">
              {verse}
            </p>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
