/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { db } from "~/server/db";

type ServeMinistriesSectionProps = {
  title: string;
};

export async function ServeMinistriesSection({
  title,
}: ServeMinistriesSectionProps) {
  const ministries = await db.serveMinistry.findMany({
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
    <section className="bg-white px-4 py-16 text-blue-950 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h2>

        {ministries.length > 0 ? (
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {ministries.map((ministry) => (
              <article
                key={ministry.id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                {ministry.imageUrl ? (
                  <div
                    role="img"
                    aria-label={`${ministry.title} ministry`}
                    className="aspect-[4/3] w-full bg-gray-200 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${JSON.stringify(
                        ministry.imageUrl,
                      )})`,
                    }}
                  />
                ) : (
                  <div className="flex aspect-[4/3] w-full items-center justify-center bg-gray-100 text-gray-500">
                    No image available
                  </div>
                )}

                <div className="p-7">
                  <h3 className="text-2xl font-bold text-blue-800">
                    {ministry.title}
                  </h3>

                  <p className="mt-6 text-lg leading-8 whitespace-pre-line text-slate-700">
                    {ministry.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-xl border border-gray-200 bg-gray-50 px-6 py-12 text-center">
            <p className="text-lg text-gray-600">
              Ministry opportunities will be added soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
