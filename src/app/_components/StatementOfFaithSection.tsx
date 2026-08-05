/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { db } from "~/server/db";

export async function StatementOfFaithSection() {
  const concepts = await db.statementOfFaithItem.findMany({
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
          Statement of Faith
        </h2>

        {concepts.length > 0 ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {concepts.map((concept) => (
              <article
                key={concept.id}
                className="rounded-xl border border-gray-200 bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg sm:p-8"
              >
                <h3 className="text-xl font-bold text-blue-800">
                  {concept.title}
                </h3>

                <p className="mt-6 text-lg leading-8 whitespace-pre-line text-slate-800">
                  {concept.description}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-xl border border-gray-200 bg-gray-50 px-6 py-12 text-center">
            <p className="text-lg text-gray-600">
              The Statement of Faith will be added soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
