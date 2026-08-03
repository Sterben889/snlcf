import React from "react";

type DescSectionProps = {
  title: string;
  body: string;
  imageUrl: string;
  serviceTime: string;
  serviceLocation: string;
  buttonText: string;
  buttonUrl: string;
};

export function DescSection({
  title,
  body,
  imageUrl,
  serviceTime,
  serviceLocation,
  buttonText,
  buttonUrl,
}: DescSectionProps) {
  return (
    <section className="bg-black bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_25%)] px-4 py-14 sm:px-8 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-7xl bg-white px-6 py-10 text-black shadow-2xl sm:px-10 lg:px-16 lg:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(280px,0.85fr)_minmax(0,1.55fr)] lg:gap-16">
          <div>
            {imageUrl ? (
              <div
                role="img"
                aria-label={title}
                className="mx-auto min-h-[420px] w-full max-w-md bg-gray-200 bg-cover bg-center lg:min-h-[520px]"
                style={{
                  backgroundImage: `url(${JSON.stringify(imageUrl)})`,
                }}
              />
            ) : (
              <div className="mx-auto flex min-h-[420px] w-full max-w-md items-center justify-center bg-gray-200 px-6 text-center text-gray-500 lg:min-h-[520px]">
                Upload a Sunday service image from the admin dashboard.
              </div>
            )}
          </div>

          <div>
            <h2 className="text-4xl font-medium tracking-tight sm:text-5xl">
              {title}
            </h2>

            <p className="mt-8 text-lg leading-relaxed whitespace-pre-line sm:text-xl">
              {body}
            </p>

            <div className="mt-10 space-y-1 text-lg sm:text-xl">
              <p>
                <span className="font-medium">Time:</span> {serviceTime}
              </p>

              <p>
                <span className="font-medium">Location:</span> {serviceLocation}
              </p>
            </div>

            <a
              href={buttonUrl}
              className="mt-10 inline-flex min-w-72 items-center justify-center rounded-full bg-black px-8 py-4 text-lg font-bold tracking-wider text-white shadow-md transition hover:-translate-y-0.5 hover:bg-gray-800"
            >
              {buttonText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
