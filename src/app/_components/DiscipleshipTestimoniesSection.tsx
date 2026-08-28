/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Link from "next/link";

import { db } from "~/server/db";

type DiscipleshipTestimoniesSectionProps = {
  eyebrow: string;
  title: string;
  intro: string;
};

export async function DiscipleshipTestimoniesSection({
  eyebrow,
  title,
  intro,
}: DiscipleshipTestimoniesSectionProps) {
  const testimonies = await db.testimony.findMany({
    where: {
      published: true,
    },

    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
  });

  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <div className="grid gap-8 border-b border-gray-200 pb-10 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="text-sm font-bold tracking-[0.3em] text-blue-700">
              {eyebrow}
            </p>

            <h2 className="mt-4 text-5xl font-bold tracking-tight text-blue-950 sm:text-6xl">
              {title}
            </h2>
          </div>

          <p className="max-w-xl text-lg leading-8 text-slate-600 lg:justify-self-end">
            {intro}
          </p>
        </div>

        {testimonies.length > 0 ? (
          <div>
            {testimonies.map((testimony, index) => {
              const imageFirst = index % 2 === 0;

              return (
                <article
                  key={testimony.id}
                  className="border-b border-gray-200 py-14 lg:py-20"
                >
                  <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
                    {/* Image */}
                    <div className={imageFirst ? "" : "lg:order-2"}>
                      <div className="relative overflow-hidden bg-gray-100">
                        {testimony.imageUrl ? (
                          <div
                            role="img"
                            aria-label={testimony.title}
                            className="aspect-4/3 bg-cover bg-center"
                            style={{
                              backgroundImage: `url(${JSON.stringify(
                                testimony.imageUrl,
                              )})`,
                            }}
                          />
                        ) : (
                          <div className="flex aspect-4/3 items-center justify-center text-gray-500">
                            No image
                          </div>
                        )}

                        <div className="absolute top-4 left-4 flex h-10 min-w-10 items-center justify-center bg-white px-2 text-xs font-bold text-blue-700 shadow-sm">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                      </div>
                    </div>

                    {/* Text */}
                    <div className={imageFirst ? "" : "lg:order-1"}>
                      <p className="text-sm font-bold tracking-[0.3em] text-blue-700">
                        {testimony.kicker}
                      </p>

                      <h3 className="mt-5 text-4xl leading-tight font-bold text-blue-950 sm:text-5xl">
                        “{testimony.title}”
                      </h3>

                      <p className="mt-7 text-lg leading-8 text-slate-600">
                        {testimony.summary}
                      </p>

                      <p className="mt-7 text-sm font-bold text-gray-950">
                        {testimony.authorLine}
                      </p>

                      <Link
                        href={`/discipleship/testimonies/${testimony.slug}`}
                        className="mt-7 inline-flex items-center gap-2 font-semibold text-blue-700 transition hover:text-blue-950"
                      >
                        Read more
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center text-gray-500">
            No testimonies have been published yet.
          </div>
        )}
      </div>
    </section>
  );
}
