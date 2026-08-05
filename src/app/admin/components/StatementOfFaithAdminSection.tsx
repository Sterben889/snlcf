/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { db } from "~/server/db";

import {
  deleteStatementOfFaithItem,
  saveStatementOfFaithItem,
} from "~/app/admin/actions";

export async function StatementOfFaithAdminSection() {
  const concepts = await db.statementOfFaithItem.findMany({
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
  });

  const nextSortOrder =
    concepts.length > 0
      ? Math.max(...concepts.map((concept) => concept.sortOrder)) + 1
      : 1;

  return (
    <>
      <div className="my-12 border-t border-gray-200" />

      <section id="statement-of-faith-editor" className="scroll-mt-6">
        <div>
          <h2 className="text-2xl font-bold">
            About Page — Statement of Faith
          </h2>

          <p className="mt-2 text-gray-600">
            Add, edit, arrange, publish, or remove faith concepts shown on the
            About Us page.
          </p>
        </div>

        {/* Public section preview */}
        <div className="mt-8 rounded-xl bg-gray-50 p-5 sm:p-8">
          <h3 className="text-center text-3xl font-bold text-blue-950">
            Statement of Faith
          </h3>

          {concepts.filter((concept) => concept.published).length > 0 ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {concepts
                .filter((concept) => concept.published)
                .map((concept) => (
                  <article
                    key={concept.id}
                    className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                  >
                    <h4 className="text-lg font-bold text-blue-800">
                      {concept.title}
                    </h4>

                    <p className="mt-4 leading-7 whitespace-pre-line text-slate-700">
                      {concept.description}
                    </p>
                  </article>
                ))}
            </div>
          ) : (
            <p className="mt-8 rounded-lg bg-white p-6 text-center text-gray-600">
              No published faith concepts are available.
            </p>
          )}
        </div>

        {/* Add new concept */}
        <form
          action={saveStatementOfFaithItem}
          className="mt-10 space-y-6 rounded-xl border border-gray-200 bg-gray-50 p-6"
        >
          <div>
            <h3 className="text-xl font-bold">Add a faith concept</h3>

            <p className="mt-1 text-sm text-gray-500">
              Create a new card for the Statement of Faith section.
            </p>
          </div>

          <div>
            <label
              htmlFor="new-faith-title"
              className="mb-2 block font-semibold"
            >
              Concept title
            </label>

            <input
              id="new-faith-title"
              name="title"
              type="text"
              required
              maxLength={150}
              placeholder="The Bible"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="new-faith-description"
              className="mb-2 block font-semibold"
            >
              Description
            </label>

            <textarea
              id="new-faith-description"
              name="description"
              required
              rows={5}
              maxLength={2500}
              placeholder="We believe the Bible is the inspired, infallible, and authoritative Word of God..."
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="new-faith-order"
              className="mb-2 block font-semibold"
            >
              Display order
            </label>

            <input
              id="new-faith-order"
              name="sortOrder"
              type="number"
              min={0}
              max={9999}
              required
              defaultValue={nextSortOrder}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 sm:max-w-48"
            />

            <p className="mt-2 text-sm text-gray-500">
              Lower numbers appear first.
            </p>
          </div>

          <label className="flex items-center gap-3">
            <input
              name="published"
              type="checkbox"
              defaultChecked
              className="h-4 w-4"
            />

            <span className="font-medium">Display this concept publicly</span>
          </label>

          <button
            type="submit"
            className="rounded-md bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Add faith concept
          </button>
        </form>

        {/* Existing concepts */}
        <div className="mt-12">
          <h3 className="text-xl font-bold">Existing faith concepts</h3>

          <p className="mt-1 text-sm text-gray-500">
            Edit an existing concept or remove it completely.
          </p>

          {concepts.length === 0 ? (
            <p className="mt-6 rounded-lg bg-gray-100 p-6 text-gray-600">
              No faith concepts have been created yet.
            </p>
          ) : (
            <div className="mt-6 space-y-8">
              {concepts.map((concept) => (
                <article
                  key={concept.id}
                  className="rounded-xl border border-gray-200 p-6"
                >
                  <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-bold">{concept.title}</h4>

                      <p className="mt-1 text-sm text-gray-500">
                        Display order: {concept.sortOrder}
                      </p>
                    </div>

                    <span
                      className={
                        concept.published
                          ? "rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800"
                          : "rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700"
                      }
                    >
                      {concept.published ? "Published" : "Hidden"}
                    </span>
                  </div>

                  <form action={saveStatementOfFaithItem} className="space-y-6">
                    <input type="hidden" name="itemId" value={concept.id} />

                    <div>
                      <label
                        htmlFor={`faith-title-${concept.id}`}
                        className="mb-2 block font-semibold"
                      >
                        Concept title
                      </label>

                      <input
                        id={`faith-title-${concept.id}`}
                        name="title"
                        type="text"
                        required
                        maxLength={150}
                        defaultValue={concept.title}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`faith-description-${concept.id}`}
                        className="mb-2 block font-semibold"
                      >
                        Description
                      </label>

                      <textarea
                        id={`faith-description-${concept.id}`}
                        name="description"
                        required
                        rows={5}
                        maxLength={2500}
                        defaultValue={concept.description}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`faith-order-${concept.id}`}
                        className="mb-2 block font-semibold"
                      >
                        Display order
                      </label>

                      <input
                        id={`faith-order-${concept.id}`}
                        name="sortOrder"
                        type="number"
                        min={0}
                        max={9999}
                        required
                        defaultValue={concept.sortOrder}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 sm:max-w-48"
                      />
                    </div>

                    <label className="flex items-center gap-3">
                      <input
                        name="published"
                        type="checkbox"
                        defaultChecked={concept.published}
                        className="h-4 w-4"
                      />

                      <span className="font-medium">
                        Display this concept publicly
                      </span>
                    </label>

                    <button
                      type="submit"
                      className="rounded-md bg-blue-700 px-5 py-2 font-semibold text-white hover:bg-blue-800"
                    >
                      Save changes
                    </button>
                  </form>

                  <form action={deleteStatementOfFaithItem} className="mt-4">
                    <input type="hidden" name="itemId" value={concept.id} />

                    <button
                      type="submit"
                      className="rounded-md bg-red-700 px-5 py-2 font-semibold text-white hover:bg-red-800"
                    >
                      Delete concept
                    </button>
                  </form>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
