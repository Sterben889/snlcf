/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  deleteServeMinistry,
  saveServeMinistry,
  updateServeMinistriesTitle,
} from "~/app/admin/actions";

import { db } from "~/server/db";
import { getSiteContent } from "~/server/site-content";

export async function ServeMinistriesAdminSection() {
  const [content, ministries] = await Promise.all([
    getSiteContent(),

    db.serveMinistry.findMany({
      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          createdAt: "asc",
        },
      ],
    }),
  ]);

  const nextSortOrder =
    ministries.length > 0
      ? Math.max(...ministries.map((ministry) => ministry.sortOrder)) + 1
      : 1;

  return (
    <>
      <div className="my-12 border-t border-gray-200" />

      <section id="serve-ministries-editor" className="scroll-mt-6">
        <div>
          <h2 className="text-2xl font-bold">Serve Page — Ministries</h2>

          <p className="mt-2 text-gray-600">
            Add, edit, reorder, publish, hide, or remove ministry opportunities
            shown on the Serve page.
          </p>
        </div>

        {/* Section title */}
        <form action={updateServeMinistriesTitle} className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="serveMinistriesTitle"
              className="mb-2 block font-semibold"
            >
              Section title
            </label>

            <input
              id="serveMinistriesTitle"
              name="serveMinistriesTitle"
              required
              maxLength={150}
              defaultValue={content.serveMinistriesTitle}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="rounded-md bg-blue-700 px-5 py-2 font-semibold text-white hover:bg-blue-800"
          >
            Save section title
          </button>
        </form>

        {/* Add ministry */}
        <form
          action={saveServeMinistry}
          className="mt-10 space-y-6 rounded-xl border border-gray-200 bg-gray-50 p-6"
        >
          <div>
            <h3 className="text-xl font-bold">Add a ministry</h3>

            <p className="mt-1 text-sm text-gray-500">
              Examples: Kids, Youth, Young Adults, Worship, Media, Hospitality,
              or Outreach.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="new-ministry-title"
                className="mb-2 block font-semibold"
              >
                Ministry name
              </label>

              <input
                id="new-ministry-title"
                name="title"
                required
                maxLength={150}
                placeholder="Kids"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="new-ministry-order"
                className="mb-2 block font-semibold"
              >
                Display order
              </label>

              <input
                id="new-ministry-order"
                name="sortOrder"
                type="number"
                min={0}
                max={9999}
                required
                defaultValue={nextSortOrder}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="new-ministry-description"
              className="mb-2 block font-semibold"
            >
              Description
            </label>

            <textarea
              id="new-ministry-description"
              name="description"
              required
              rows={6}
              maxLength={3000}
              placeholder="Describe this ministry and the opportunities to serve..."
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="new-ministry-image"
              className="mb-2 block font-semibold"
            >
              Ministry image
            </label>

            <input
              id="new-ministry-image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
            />

            <p className="mt-2 text-sm text-gray-500">
              JPG, PNG, or WebP. Leave empty if you don&apos;t have an image
              yet.
            </p>
          </div>

          <label className="flex items-center gap-3">
            <input
              name="published"
              type="checkbox"
              defaultChecked
              className="h-4 w-4"
            />

            <span className="font-medium">Display this ministry publicly</span>
          </label>

          <button
            type="submit"
            className="rounded-md bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Add ministry
          </button>
        </form>

        {/* Existing ministries */}
        <div className="mt-12">
          <h3 className="text-xl font-bold">Existing ministries</h3>

          {ministries.length === 0 ? (
            <p className="mt-6 rounded-lg bg-gray-100 p-6 text-gray-600">
              No ministries have been created yet.
            </p>
          ) : (
            <div className="mt-6 space-y-8">
              {ministries.map((ministry) => (
                <article
                  key={ministry.id}
                  className="rounded-xl border border-gray-200 p-6"
                >
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xl font-bold">{ministry.title}</h4>

                      <p className="mt-1 text-sm text-gray-500">
                        Display order: {ministry.sortOrder}
                      </p>
                    </div>

                    <span
                      className={
                        ministry.published
                          ? "rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800"
                          : "rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700"
                      }
                    >
                      {ministry.published ? "Published" : "Hidden"}
                    </span>
                  </div>

                  {ministry.imageUrl && (
                    <div
                      role="img"
                      aria-label={`${ministry.title} ministry preview`}
                      className="mb-6 aspect-video max-w-xl rounded-lg bg-gray-200 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${JSON.stringify(
                          ministry.imageUrl,
                        )})`,
                      }}
                    />
                  )}

                  <form action={saveServeMinistry} className="space-y-6">
                    <input
                      type="hidden"
                      name="ministryId"
                      value={ministry.id}
                    />

                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor={`ministry-title-${ministry.id}`}
                          className="mb-2 block font-semibold"
                        >
                          Ministry name
                        </label>

                        <input
                          id={`ministry-title-${ministry.id}`}
                          name="title"
                          required
                          maxLength={150}
                          defaultValue={ministry.title}
                          className="w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`ministry-order-${ministry.id}`}
                          className="mb-2 block font-semibold"
                        >
                          Display order
                        </label>

                        <input
                          id={`ministry-order-${ministry.id}`}
                          name="sortOrder"
                          type="number"
                          min={0}
                          max={9999}
                          required
                          defaultValue={ministry.sortOrder}
                          className="w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor={`ministry-description-${ministry.id}`}
                        className="mb-2 block font-semibold"
                      >
                        Description
                      </label>

                      <textarea
                        id={`ministry-description-${ministry.id}`}
                        name="description"
                        required
                        rows={6}
                        maxLength={3000}
                        defaultValue={ministry.description}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`ministry-image-${ministry.id}`}
                        className="mb-2 block font-semibold"
                      >
                        Replace image
                      </label>

                      <input
                        id={`ministry-image-${ministry.id}`}
                        name="image"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="block w-full rounded-md border border-gray-300 px-3 py-2"
                      />

                      {ministry.imageUrl && (
                        <label className="mt-3 flex items-center gap-3">
                          <input
                            name="removeImage"
                            type="checkbox"
                            className="h-4 w-4"
                          />

                          <span className="text-sm font-medium">
                            Remove current image
                          </span>
                        </label>
                      )}
                    </div>

                    <label className="flex items-center gap-3">
                      <input
                        name="published"
                        type="checkbox"
                        defaultChecked={ministry.published}
                        className="h-4 w-4"
                      />

                      <span className="font-medium">
                        Display this ministry publicly
                      </span>
                    </label>

                    <button
                      type="submit"
                      className="rounded-md bg-blue-700 px-5 py-2 font-semibold text-white hover:bg-blue-800"
                    >
                      Save changes
                    </button>
                  </form>

                  <form action={deleteServeMinistry} className="mt-4">
                    <input
                      type="hidden"
                      name="ministryId"
                      value={ministry.id}
                    />

                    <button
                      type="submit"
                      className="rounded-md bg-red-700 px-5 py-2 font-semibold text-white hover:bg-red-800"
                    >
                      Delete ministry
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
