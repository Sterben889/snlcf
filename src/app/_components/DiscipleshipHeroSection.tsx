type DiscipleshipHeroSectionProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
};

export function DiscipleshipHeroSection({
  eyebrow,
  title,
  subtitle,
}: DiscipleshipHeroSectionProps) {
  return (
    <section className="border-y border-white/10 bg-blue-900 px-4 py-20 text-white sm:px-6 lg:py-28">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-sm font-bold tracking-[0.3em] text-blue-200 sm:text-base">
          {eyebrow}
        </p>

        <h1 className="mx-auto mt-7 max-w-4xl text-5xl leading-tight font-bold tracking-tight sm:text-6xl lg:text-7xl">
          {title}
        </h1>

        <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 whitespace-pre-line text-blue-100 sm:text-xl">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
