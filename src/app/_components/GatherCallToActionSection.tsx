import Link from "next/link";

type GatherCallToActionSectionProps = {
  title: string;
  body: string;
  eventsButtonText: string;
  aboutButtonText: string;
};

export function GatherCallToActionSection({
  title,
  body,
  eventsButtonText,
  aboutButtonText,
}: GatherCallToActionSectionProps) {
  return (
    <section className="bg-blue-950 px-4 py-16 text-white sm:px-6 lg:py-20">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h2>

        <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 whitespace-pre-line text-blue-100 sm:text-xl">
          {body}
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/events"
            className="inline-flex min-w-56 items-center justify-center rounded-md bg-white px-7 py-3 font-semibold text-blue-950 shadow transition hover:-translate-y-0.5 hover:bg-blue-50"
          >
            {eventsButtonText}
          </Link>

          <Link
            href="/about"
            className="inline-flex min-w-56 items-center justify-center rounded-md border border-white px-7 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white hover:text-blue-950"
          >
            {aboutButtonText}
          </Link>
        </div>
      </div>
    </section>
  );
}
