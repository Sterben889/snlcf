/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  deleteGivingMethod,
  saveGivingMethod,
  updateGiveWaysTitle,
} from "~/app/admin/actions";
import { db } from "~/server/db";
import { getSiteContent } from "~/server/site-content";

export async function GiveWaysAdminSection() {
  const [content, methods] = await Promise.all([
    getSiteContent(),

    db.givingMethod.findMany({
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
    methods.length > 0
      ? Math.max(...methods.map((method) => method.sortOrder)) + 1
      : 1;

  return (
    <>
      <div className="my-12 border-t border-gray-200" />

      <section id="give-ways-editor" className="scroll-mt-6">
        <div>
          <h2 className="text-2xl font-bold">Give Page — Ways of Giving</h2>

          <p className="mt-2 text-gray-600">
            Add, edit, reorder, hide, or remove the giving methods displayed on
            the Give page.
          </p>
        </div>

        {/* Section title */}
        <form action={updateGiveWaysTitle} className="mt-8 space-y-4">
          <div>
            <label htmlFor="giveWaysTitle" className="mb-2 block font-semibold">
              Section title
            </label>

            <input
              id="giveWaysTitle"
              name="giveWaysTitle"
              type="text"
              required
              maxLength={150}
              defaultValue={content.giveWaysTitle}
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

        {/* Add method */}
        <form
          action={saveGivingMethod}
          className="mt-10 space-y-6 rounded-xl border border-gray-200 bg-gray-50 p-6"
        >
          <h3 className="text-xl font-bold">Add a giving method</h3>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="new-giving-title"
                className="mb-2 block font-semibold"
              >
                Title
              </label>

              <input
                id="new-giving-title"
                name="title"
                required
                maxLength={150}
                placeholder="Interac e-Transfer"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="new-giving-icon"
                className="mb-2 block font-semibold"
              >
                Icon
              </label>

              <select
                id="new-giving-icon"
                name="icon"
                defaultValue="EMAIL"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
              >
                <option value="EMAIL">Email / e-Transfer</option>

                <option value="MAIL">Mail / Cheque</option>

                <option value="CHURCH">Church / In Person</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="new-giving-description"
              className="mb-2 block font-semibold"
            >
              Description
            </label>

            <textarea
              id="new-giving-description"
              name="description"
              required
              rows={4}
              maxLength={1500}
              placeholder="Send your gift quickly and securely via Interac e-Transfer."
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="new-giving-detail"
              className="mb-2 block font-semibold"
            >
              Main giving information
            </label>

            <textarea
              id="new-giving-detail"
              name="detail"
              required
              rows={2}
              maxLength={500}
              placeholder="info@saskatoonnewlife.ca"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="new-giving-href"
              className="mb-2 block font-semibold"
            >
              Optional link
            </label>

            <input
              id="new-giving-href"
              name="href"
              type="text"
              maxLength={1000}
              placeholder="mailto:info@saskatoonnewlife.ca"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
            />

            <p className="mt-2 text-sm text-gray-500">
              Leave empty when the information should only be shown as text.
            </p>
          </div>

          <div>
            <label
              htmlFor="new-giving-order"
              className="mb-2 block font-semibold"
            >
              Display order
            </label>

            <input
              id="new-giving-order"
              name="sortOrder"
              type="number"
              min={0}
              max={9999}
              required
              defaultValue={nextSortOrder}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 sm:max-w-48"
            />
          </div>

          <label className="flex items-center gap-3">
            <input
              name="published"
              type="checkbox"
              defaultChecked
              className="h-4 w-4"
            />

            <span className="font-medium">Display this method publicly</span>
          </label>

          <button
            type="submit"
            className="rounded-md bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Add giving method
          </button>
        </form>

        {/* Existing methods */}
        <div className="mt-12 space-y-8">
          <h3 className="text-xl font-bold">Existing giving methods</h3>

          {methods.length === 0 ? (
            <p className="rounded-lg bg-gray-100 p-6 text-gray-600">
              No giving methods have been created yet.
            </p>
          ) : (
            methods.map((method) => (
              <article
                key={method.id}
                className="rounded-xl border border-gray-200 p-6"
              >
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-bold">{method.title}</h4>

                    <p className="mt-1 text-sm text-gray-500">
                      Display order: {method.sortOrder}
                    </p>
                  </div>

                  <span
                    className={
                      method.published
                        ? "rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800"
                        : "rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700"
                    }
                  >
                    {method.published ? "Published" : "Hidden"}
                  </span>
                </div>

                <form action={saveGivingMethod} className="space-y-6">
                  <input type="hidden" name="methodId" value={method.id} />

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor={`giving-title-${method.id}`}
                        className="mb-2 block font-semibold"
                      >
                        Title
                      </label>

                      <input
                        id={`giving-title-${method.id}`}
                        name="title"
                        required
                        maxLength={150}
                        defaultValue={method.title}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`giving-icon-${method.id}`}
                        className="mb-2 block font-semibold"
                      >
                        Icon
                      </label>

                      <select
                        id={`giving-icon-${method.id}`}
                        name="icon"
                        defaultValue={method.icon}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                      >
                        <option value="EMAIL">Email / e-Transfer</option>

                        <option value="MAIL">Mail / Cheque</option>

                        <option value="CHURCH">Church / In Person</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor={`giving-description-${method.id}`}
                      className="mb-2 block font-semibold"
                    >
                      Description
                    </label>

                    <textarea
                      id={`giving-description-${method.id}`}
                      name="description"
                      required
                      rows={4}
                      maxLength={1500}
                      defaultValue={method.description}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`giving-detail-${method.id}`}
                      className="mb-2 block font-semibold"
                    >
                      Main giving information
                    </label>

                    <textarea
                      id={`giving-detail-${method.id}`}
                      name="detail"
                      required
                      rows={2}
                      maxLength={500}
                      defaultValue={method.detail}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`giving-href-${method.id}`}
                      className="mb-2 block font-semibold"
                    >
                      Optional link
                    </label>

                    <input
                      id={`giving-href-${method.id}`}
                      name="href"
                      maxLength={1000}
                      defaultValue={method.href ?? ""}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`giving-order-${method.id}`}
                      className="mb-2 block font-semibold"
                    >
                      Display order
                    </label>

                    <input
                      id={`giving-order-${method.id}`}
                      name="sortOrder"
                      type="number"
                      min={0}
                      max={9999}
                      required
                      defaultValue={method.sortOrder}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 sm:max-w-48"
                    />
                  </div>

                  <label className="flex items-center gap-3">
                    <input
                      name="published"
                      type="checkbox"
                      defaultChecked={method.published}
                      className="h-4 w-4"
                    />

                    <span className="font-medium">
                      Display this method publicly
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="rounded-md bg-blue-700 px-5 py-2 font-semibold text-white hover:bg-blue-800"
                  >
                    Save changes
                  </button>
                </form>

                <form action={deleteGivingMethod} className="mt-4">
                  <input type="hidden" name="methodId" value={method.id} />

                  <button
                    type="submit"
                    className="rounded-md bg-red-700 px-5 py-2 font-semibold text-white hover:bg-red-800"
                  >
                    Delete giving method
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
