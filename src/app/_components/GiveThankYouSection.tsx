type GiveThankYouSectionProps = {
  title: string;
  body: string;
};

export function GiveThankYouSection({ title, body }: GiveThankYouSectionProps) {
  return (
    <section className="bg-blue-950 px-4 py-16 text-white sm:px-6 lg:py-20">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h2>

        <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 whitespace-pre-line text-blue-100 sm:text-xl">
          {body}
        </p>
      </div>
    </section>
  );
}
