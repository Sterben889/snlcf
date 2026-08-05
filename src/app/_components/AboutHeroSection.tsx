type AboutHeroSectionProps = {
  title: string;
  subtitle: string;
};

export function AboutHeroSection({ title, subtitle }: AboutHeroSectionProps) {
  return (
    <section className="border-y border-white/10 bg-blue-900 px-4 py-20 text-white sm:px-6 lg:py-24">
      <div className="mx-auto max-w-5xl text-center">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          {title}
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed whitespace-pre-line text-blue-100 sm:text-2xl">
          {subtitle}
        </p>

        <div className="mx-auto mt-9 h-1 w-24 rounded-full bg-white/40" />
      </div>
    </section>
  );
}
