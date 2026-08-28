/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import Link from "next/link";

import {
  deleteTestimony,
  saveTestimony,
  updateDiscipleshipTestimonyContent,
} from "~/app/admin/actions";

import { db } from "~/server/db";
import { getSiteContent } from "~/server/site-content";

export async function DiscipleshipTestimoniesAdminSection() {
  const [content, testimonies] = await Promise.all([
    getSiteContent(),

    db.testimony.findMany({
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

  const nextOrder =
    testimonies.length > 0
      ? Math.max(...testimonies.map((testimony) => testimony.sortOrder)) + 1
      : 1;

  return (
    <>
      <div className="my-12 border-t border-gray-200" />

      <section id="discipleship-testimonies-editor" className="scroll-mt-6">
        <div>
          <h2 className="text-2xl font-bold">Discipleship — Testimonies</h2>

          <p className="mt-2 text-gray-600">
            Add, edit, publish, reorder, or remove testimony stories.
          </p>
        </div>

        {/* Section headings */}
        <form
          action={updateDiscipleshipTestimonyContent}
          className="mt-8 space-y-6"
        >
          <h3 className="text-xl font-bold">Section content</h3>

          <div>
            <label
              htmlFor="discipleshipTestimoniesEyebrow"
              className="mb-2 block font-semibold"
            >
              Small heading
            </label>

            <input
              id="discipleshipTestimoniesEyebrow"
              name="discipleshipTestimoniesEyebrow"
              required
              defaultValue={content.discipleshipTestimoniesEyebrow}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="discipleshipTestimoniesTitle"
              className="mb-2 block font-semibold"
            >
              Section title
            </label>

            <input
              id="discipleshipTestimoniesTitle"
              name="discipleshipTestimoniesTitle"
              required
              defaultValue={content.discipleshipTestimoniesTitle}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="discipleshipTestimoniesIntro"
              className="mb-2 block font-semibold"
            >
              Introduction
            </label>

            <textarea
              id="discipleshipTestimoniesIntro"
              name="discipleshipTestimoniesIntro"
              rows={4}
              required
              defaultValue={content.discipleshipTestimoniesIntro}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <h3 className="pt-4 text-xl font-bold">Individual story footer</h3>

          <div>
            <label className="mb-2 block font-semibold">Small heading</label>

            <input
              name="discipleshipExploreEyebrow"
              required
              defaultValue={content.discipleshipExploreEyebrow}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">Title</label>

            <input
              name="discipleshipExploreTitle"
              required
              defaultValue={content.discipleshipExploreTitle}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">Message</label>

            <textarea
              name="discipleshipExploreBody"
              rows={4}
              required
              defaultValue={content.discipleshipExploreBody}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">Button text</label>

            <input
              name="discipleshipExploreButtonText"
              required
              defaultValue={content.discipleshipExploreButtonText}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="rounded-md bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Save testimony section
          </button>
        </form>

        {/* Add new testimony */}
        <form
          action={saveTestimony}
          className="mt-12 space-y-6 rounded-xl border border-gray-200 bg-gray-50 p-6"
        >
          <h3 className="text-xl font-bold">Add testimony</h3>

          <div>
            <label className="mb-2 block font-semibold">Story heading</label>

            <input
              name="kicker"
              required
              placeholder="A STORY OF NEW BEGINNINGS"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">Testimony title</label>

            <input
              name="title"
              required
              placeholder="I found a family that helped me follow Jesus"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Short quotation / summary
            </label>

            <textarea
              name="summary"
              rows={4}
              required
              placeholder="Discipleship became real for me..."
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">Author line</label>

            <input
              name="authorLine"
              required
              defaultValue="A story from our New Life family"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">Full testimony</label>

            <textarea
              name="body"
              rows={12}
              required
              placeholder={`Write the complete testimony here.

Leave a blank line between paragraphs.

Each paragraph will automatically be formatted on the story page.`}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
            />

            <p className="mt-2 text-sm text-gray-500">
              Leave a blank line between paragraphs.
            </p>
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Closing statement
            </label>

            <textarea
              name="closingText"
              rows={3}
              placeholder="My story is still being written..."
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">Image</label>

            <input
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">Display order</label>

            <input
              name="sortOrder"
              type="number"
              min={0}
              required
              defaultValue={nextOrder}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 sm:max-w-40"
            />
          </div>

          <label className="flex items-center gap-3">
            <input
              name="published"
              type="checkbox"
              defaultChecked
              className="h-4 w-4"
            />

            <span className="font-medium">Publish this testimony</span>
          </label>

          <button
            type="submit"
            className="rounded-md bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Add testimony
          </button>
        </form>

        {/* Existing testimonies */}
        <div className="mt-12 space-y-8">
          <h3 className="text-xl font-bold">Existing testimonies</h3>

          {testimonies.length === 0 ? (
            <p className="rounded-lg bg-gray-100 p-6 text-gray-600">
              No testimonies have been created yet.
            </p>
          ) : (
            testimonies.map((testimony) => (
              <article
                key={testimony.id}
                className="rounded-xl border border-gray-200 p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h4 className="text-xl font-bold">{testimony.title}</h4>

                    <p className="mt-1 text-sm text-gray-500">
                      /discipleship/testimonies/
                      {testimony.slug}
                    </p>
                  </div>

                  <Link
                    href={`/discipleship/testimonies/${testimony.slug}`}
                    target="_blank"
                    className="font-semibold text-blue-700 hover:underline"
                  >
                    View story ↗
                  </Link>
                </div>

                {testimony.imageUrl && (
                  <div
                    role="img"
                    aria-label={testimony.title}
                    className="mt-6 aspect-video max-w-xl rounded-lg bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${JSON.stringify(
                        testimony.imageUrl,
                      )})`,
                    }}
                  />
                )}

                <form action={saveTestimony} className="mt-8 space-y-6">
                  <input
                    type="hidden"
                    name="testimonyId"
                    value={testimony.id}
                  />

                  <div>
                    <label className="mb-2 block font-semibold">
                      Story heading
                    </label>

                    <input
                      name="kicker"
                      required
                      defaultValue={testimony.kicker}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-semibold">Title</label>

                    <input
                      name="title"
                      required
                      defaultValue={testimony.title}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-semibold">
                      Short quotation / summary
                    </label>

                    <textarea
                      name="summary"
                      rows={4}
                      required
                      defaultValue={testimony.summary}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-semibold">
                      Author line
                    </label>

                    <input
                      name="authorLine"
                      required
                      defaultValue={testimony.authorLine}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-semibold">
                      Full testimony
                    </label>

                    <textarea
                      name="body"
                      rows={12}
                      required
                      defaultValue={testimony.body}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-semibold">
                      Closing statement
                    </label>

                    <textarea
                      name="closingText"
                      rows={3}
                      defaultValue={testimony.closingText ?? ""}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-semibold">
                      Replace image
                    </label>

                    <input
                      name="image"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="block w-full rounded-md border border-gray-300 px-3 py-2"
                    />

                    {testimony.imageUrl && (
                      <label className="mt-3 flex items-center gap-3">
                        <input name="removeImage" type="checkbox" />
                        Remove current image
                      </label>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block font-semibold">
                      Display order
                    </label>

                    <input
                      name="sortOrder"
                      type="number"
                      min={0}
                      required
                      defaultValue={testimony.sortOrder}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 sm:max-w-40"
                    />
                  </div>

                  <label className="flex items-center gap-3">
                    <input
                      name="published"
                      type="checkbox"
                      defaultChecked={testimony.published}
                    />
                    Publish this testimony
                  </label>

                  <button
                    type="submit"
                    className="rounded-md bg-blue-700 px-5 py-2 font-semibold text-white hover:bg-blue-800"
                  >
                    Save changes
                  </button>
                </form>

                <form action={deleteTestimony} className="mt-4">
                  <input
                    type="hidden"
                    name="testimonyId"
                    value={testimony.id}
                  />

                  <button
                    type="submit"
                    className="rounded-md bg-red-700 px-5 py-2 font-semibold text-white hover:bg-red-800"
                  >
                    Delete testimony
                  </button>
                </form>
              </article>
            ))
          )}
        </div>
      </section>
    </>
  );
}
