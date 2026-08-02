type HeroSectionProps = {
  title: string;
  subtitle: string;
  backgroundImageUrl: string;
};

export function HeroSection({
  title,
  subtitle,
  backgroundImageUrl,
}: HeroSectionProps) {
  const backgroundImage = `linear-gradient(
    rgba(0, 0, 0, 0.45),
    rgba(0, 0, 0, 0.45)
  ), url(${JSON.stringify(backgroundImageUrl)})`;

  return (
    <section
      className="flex min-h-screen w-full items-center justify-center bg-black bg-cover bg-center px-6"
      style={{
        backgroundImage,
      }}
    >
      <div className="text-center text-white">
        <h1 className="text-5xl font-bold md:text-7xl lg:text-8xl">{title}</h1>

        <p className="mt-6 text-xl font-bold md:text-2xl">{subtitle}</p>
      </div>
    </section>
  );
}
