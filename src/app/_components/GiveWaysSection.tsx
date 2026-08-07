import type { GivingMethodIcon } from "@prisma/client";

import { db } from "~/server/db";

type GiveWaysSectionProps = {
  title: string;
};

function EmailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2h9l4 4v16H6Z" />
      <path d="M14 2v5h5" />
      <path d="M9 12h6" />
      <path d="M9 16h6" />
    </svg>
  );
}

function ChurchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v5" />
      <path d="M9.5 4.5h5" />
      <path d="m4 11 8-5 8 5v11H4Z" />
      <path d="M9 22v-6h6v6" />
      <path d="M7 13h2" />
      <path d="M15 13h2" />
    </svg>
  );
}

function MethodIcon({ icon }: { icon: GivingMethodIcon }) {
  switch (icon) {
    case "MAIL":
      return <MailIcon />;

    case "CHURCH":
      return <ChurchIcon />;

    case "EMAIL":
    default:
      return <EmailIcon />;
  }
}

export async function GiveWaysSection({ title }: GiveWaysSectionProps) {
  const methods = await db.givingMethod.findMany({
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
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h2>

        {methods.length > 0 ? (
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {methods.map((method) => (
              <article
                key={method.id}
                className="flex min-h-80 flex-col items-center rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-900 text-white">
                  <MethodIcon icon={method.icon} />
                </div>

                <h3 className="mt-7 text-xl font-bold text-gray-950">
                  {method.title}
                </h3>

                <p className="mt-6 leading-7 whitespace-pre-line text-slate-700">
                  {method.description}
                </p>

                <div className="mt-auto pt-6">
                  {method.href ? (
                    <a
                      href={method.href}
                      className="font-semibold text-blue-700 transition hover:text-blue-900 hover:underline"
                    >
                      {method.detail}
                    </a>
                  ) : (
                    <p className="font-semibold whitespace-pre-line text-blue-700">
                      {method.detail}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-xl border border-gray-200 bg-gray-50 p-10 text-center">
            <p className="text-gray-600">
              Giving information will be added soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
