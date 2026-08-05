type AboutWhoSectionProps = {
  title: string;
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
};

export function AboutWhoSection({
  title,
  paragraph1,
  paragraph2,
  paragraph3,
}: AboutWhoSectionProps) {
  const paragraphs = [paragraph1, paragraph2, paragraph3].filter(
    (paragraph) => paragraph.trim().length > 0,
  );

  return (
    <section className="bg-white px-4 py-16 text-blue-950 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h2>

        <div className="mt-10 space-y-7 text-lg leading-8 text-slate-800">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="whitespace-pre-line">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
