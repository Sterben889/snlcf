type ServeIntroSectionProps = {
  title: string;
  body: string;
};

export function ServeIntroSection({ title, body }: ServeIntroSectionProps) {
  return (
    <section className="bg-gray-50 px-4 py-16 text-blue-950 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-xl border border-gray-100 bg-white px-6 py-12 text-center shadow-lg sm:px-10 lg:px-16">
          <h2 className="text-3xl font-bold tracking-tight text-blue-900 sm:text-4xl">
            {title}
          </h2>

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 whitespace-pre-line text-slate-700 sm:text-xl">
            {body}
          </p>
        </div>
      </div>
    </section>
  );
}
