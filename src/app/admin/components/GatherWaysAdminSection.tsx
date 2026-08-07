/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  deleteGatherGroup,
  deleteGatherGroupImage,
  saveGatherGroup,
  updateGatherWaysTitle,
} from "~/app/admin/actions";
import { db } from "~/server/db";
import { getSiteContent } from "~/server/site-content";

export async function GatherWaysAdminSection() {
  const [content, groups] = await Promise.all([
    getSiteContent(),

    db.gatherGroup.findMany({
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
        },
      },
    }),
  ]);

  const nextSortOrder =
    groups.length > 0
      ? Math.max(...groups.map((group) => group.sortOrder)) + 1
      : 1;

  return (
    <>
      <div className="my-12 border-t border-gray-200" />

      <section id="gather-ways-editor" className="scroll-mt-6">
        <div>
          <h2 className="text-2xl font-bold">Gather Page — Ways to Gather</h2>

          <p className="mt-2 text-gray-600">
            Create and manage recurring ministries and gatherings. Each
            gathering can have up to 10 carousel images.
          </p>
        </div>

        {/* Section title */}
        <form action={updateGatherWaysTitle} className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="gatherWaysTitle"
              className="mb-2 block font-semibold"
            >
              Section title
            </label>

            <input
              id="gatherWaysTitle"
              name="gatherWaysTitle"
              required
              maxLength={150}
              defaultValue={content.gatherWaysTitle}
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

        {/* New gathering */}
        <form
          action={saveGatherGroup}
          className="mt-10 space-y-6 rounded-xl border border-gray-200 bg-gray-50 p-6"
        >
          <div>
            <h3 className="text-xl font-bold">Add a gathering</h3>

            <p className="mt-1 text-sm text-gray-500">
              Examples include Sunday Service, Prayer Meeting, Young Adults, or
              Fusion Youth.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="new-gather-title"
                className="mb-2 block font-semibold"
              >
                Title
              </label>

              <input
                id="new-gather-title"
                name="title"
                required
                maxLength={150}
                placeholder="Sunday Service"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="new-gather-order"
                className="mb-2 block font-semibold"
              >
                Display order
              </label>

              <input
                id="new-gather-order"
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

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="new-gather-schedule"
                className="mb-2 block font-semibold"
              >
                Schedule
              </label>

              <input
                id="new-gather-schedule"
                name="schedule"
                required
                maxLength={200}
                placeholder="Sundays at 10:00 AM"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="new-gather-location"
                className="mb-2 block font-semibold"
              >
                Location
              </label>

              <input
                id="new-gather-location"
                name="location"
                required
                maxLength={250}
                placeholder="Main Sanctuary"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="new-gather-description"
              className="mb-2 block font-semibold"
            >
              Description
            </label>

            <textarea
              id="new-gather-description"
              name="description"
              required
              rows={5}
              maxLength={3000}
              placeholder="Describe this gathering..."
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="new-gather-images"
              className="mb-2 block font-semibold"
            >
              Carousel images
            </label>

            <input
              id="new-gather-images"
              name="images"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
            />

            <p className="mt-2 text-sm text-gray-500">
              Select up to 10 images. JPG, PNG, and WebP are supported.
            </p>
          </div>

          <label className="flex items-center gap-3">
            <input
              name="published"
              type="checkbox"
              defaultChecked
              className="h-4 w-4"
            />

            <span className="font-medium">Display this gathering publicly</span>
          </label>

          <button
            type="submit"
            className="rounded-md bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Add gathering
          </button>
        </form>

        {/* Existing gatherings */}
        <div className="mt-12">
          <h3 className="text-xl font-bold">Existing gatherings</h3>

          {groups.length === 0 ? (
            <p className="mt-6 rounded-lg bg-gray-100 p-6 text-gray-600">
              No gatherings have been created yet.
            </p>
          ) : (
            <div className="mt-6 space-y-10">
              {groups.map((group) => (
                <article
                  key={group.id}
                  className="rounded-xl border border-gray-200 p-6"
                >
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xl font-bold">{group.title}</h4>

                      <p className="mt-1 text-sm text-gray-500">
                        {group.images.length}/10 images · Display order{" "}
                        {group.sortOrder}
                      </p>
                    </div>

                    <span
                      className={
                        group.published
                          ? "rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800"
                          : "rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700"
                      }
                    >
                      {group.published ? "Published" : "Hidden"}
                    </span>
                  </div>

                  {/* Existing images */}
                  {group.images.length > 0 && (
                    <div className="mb-8">
                      <h5 className="font-semibold">Carousel images</h5>

                      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                        {group.images.map((image) => (
                          <div key={image.id}>
                            <div
                              role="img"
                              aria-label={`${group.title} carousel image`}
                              className="aspect-video rounded-lg bg-gray-200 bg-cover bg-center"
                              style={{
                                backgroundImage: `url(${JSON.stringify(
                                  image.imageUrl,
                                )})`,
                              }}
                            />

                            <form
                              action={deleteGatherGroupImage}
                              className="mt-2"
                            >
                              <input
                                type="hidden"
                                name="imageId"
                                value={image.id}
                              />

                              <button
                                type="submit"
                                className="w-full rounded-md bg-red-50 px-2 py-1 text-sm font-semibold text-red-700 hover:bg-red-100"
                              >
                                Remove
                              </button>
                            </form>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Edit group */}
                  <form action={saveGatherGroup} className="space-y-6">
                    <input type="hidden" name="groupId" value={group.id} />

                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor={`gather-title-${group.id}`}
                          className="mb-2 block font-semibold"
                        >
                          Title
                        </label>

                        <input
                          id={`gather-title-${group.id}`}
                          name="title"
                          required
                          maxLength={150}
                          defaultValue={group.title}
                          className="w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`gather-order-${group.id}`}
                          className="mb-2 block font-semibold"
                        >
                          Display order
                        </label>

                        <input
                          id={`gather-order-${group.id}`}
                          name="sortOrder"
                          type="number"
                          min={0}
                          max={9999}
                          required
                          defaultValue={group.sortOrder}
                          className="w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor={`gather-schedule-${group.id}`}
                          className="mb-2 block font-semibold"
                        >
                          Schedule
                        </label>

                        <input
                          id={`gather-schedule-${group.id}`}
                          name="schedule"
                          required
                          maxLength={200}
                          defaultValue={group.schedule}
                          className="w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`gather-location-${group.id}`}
                          className="mb-2 block font-semibold"
                        >
                          Location
                        </label>

                        <input
                          id={`gather-location-${group.id}`}
                          name="location"
                          required
                          maxLength={250}
                          defaultValue={group.location}
                          className="w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor={`gather-description-${group.id}`}
                        className="mb-2 block font-semibold"
                      >
                        Description
                      </label>

                      <textarea
                        id={`gather-description-${group.id}`}
                        name="description"
                        required
                        rows={5}
                        maxLength={3000}
                        defaultValue={group.description}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`gather-images-${group.id}`}
                        className="mb-2 block font-semibold"
                      >
                        Add more carousel images
                      </label>

                      <input
                        id={`gather-images-${group.id}`}
                        name="images"
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp"
                        disabled={group.images.length >= 10}
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 disabled:cursor-not-allowed disabled:bg-gray-100"
                      />

                      <p className="mt-2 text-sm text-gray-500">
                        {group.images.length >= 10
                          ? "This gathering already has the maximum of 10 images."
                          : `${
                              10 - group.images.length
                            } image slots remaining.`}
                      </p>
                    </div>

                    <label className="flex items-center gap-3">
                      <input
                        name="published"
                        type="checkbox"
                        defaultChecked={group.published}
                        className="h-4 w-4"
                      />

                      <span className="font-medium">
                        Display this gathering publicly
                      </span>
                    </label>

                    <button
                      type="submit"
                      className="rounded-md bg-blue-700 px-5 py-2 font-semibold text-white hover:bg-blue-800"
                    >
                      Save changes
                    </button>
                  </form>

                  <form action={deleteGatherGroup} className="mt-4">
                    <input type="hidden" name="groupId" value={group.id} />

                    <button
                      type="submit"
                      className="rounded-md bg-red-700 px-5 py-2 font-semibold text-white hover:bg-red-800"
                    >
                      Delete gathering
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
