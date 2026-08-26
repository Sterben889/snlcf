type ServeCallToActionSectionProps = {
  eyebrow: string;
  title: string;
  body: string;
  buttonText: string;
  buttonUrl: string;
  imageUrl: string;
};

export function ServeCallToActionSection({
  eyebrow,
  title,
  body,
  buttonText,
  buttonUrl,
  imageUrl,
}: ServeCallToActionSectionProps) {
  return (
    <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-2xl bg-blue-950 shadow-xl lg:grid lg:grid-cols-2">
          {/* Text side */}
          <div className="flex flex-col justify-center px-8 py-12 text-white sm:px-10 lg:px-14 lg:py-16">
            <p className="text-xs font-bold tracking-[0.25em] text-blue-200">
              {eyebrow}
            </p>

            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              {title}
            </h2>

            <p className="mt-6 text-lg leading-8 whitespace-pre-line text-blue-100">
              {body}
            </p>

            <div className="mt-8">
              <a
                href={buttonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-white px-7 py-3 font-semibold text-blue-950 shadow transition hover:-translate-y-0.5 hover:bg-blue-50"
              >
                {buttonText}
              </a>
            </div>
          </div>

          {/* Image side */}
          {imageUrl ? (
            <div
              role="img"
              aria-label="Serve with us"
              className="min-h-[320px] bg-cover bg-center lg:min-h-[440px]"
              style={{
                backgroundImage: `url(${JSON.stringify(imageUrl)})`,
              }}
            />
          ) : (
            <div className="flex min-h-[320px] items-center justify-center bg-blue-900 text-blue-200 lg:min-h-[440px]">
              <p className="font-medium">
                Add a section image from the admin page
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
