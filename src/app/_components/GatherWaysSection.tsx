/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { db } from "~/server/db";

import { GatherImageCarousel } from "./GatherImageCarousel";

type GatherWaysSectionProps = {
  title: string;
};

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export async function GatherWaysSection({ title }: GatherWaysSectionProps) {
  const groups = await db.gatherGroup.findMany({
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
    include: {
      images: {
        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            createdAt: "asc",
          },
        ],
        take: 10,
      },
    },
  });

  return (
    <section className="bg-gray-50 px-4 py-16 text-blue-950 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h2>

        {groups.length > 0 ? (
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {groups.map((group) => (
              <article
                key={group.id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg sm:p-5"
              >
                <GatherImageCarousel
                  title={group.title}
                  images={group.images.map((image) => ({
                    id: image.id,
                    imageUrl: image.imageUrl,
                  }))}
                />

                <div className="px-2 pt-6 pb-3">
                  <h3 className="text-2xl font-bold text-blue-800">
                    {group.title}
                  </h3>

                  <div className="mt-4 space-y-2 text-slate-600">
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 text-blue-700">
                        <ClockIcon />
                      </div>

                      <span>{group.schedule}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="shrink-0 text-blue-700">
                        <LocationIcon />
                      </div>

                      <span>{group.location}</span>
                    </div>
                  </div>

                  <p className="mt-7 text-lg leading-8 whitespace-pre-line text-slate-700">
                    {group.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
            <p className="text-lg text-gray-600">
              Gathering information will be added soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
