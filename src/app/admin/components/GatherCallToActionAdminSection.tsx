/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { updateGatherCallToAction } from "~/app/admin/actions";
import { getSiteContent } from "~/server/site-content";

export async function GatherCallToActionAdminSection() {
  const content = await getSiteContent();

  return (
    <>
      <div className="my-12 border-t border-gray-200" />

      <section id="gather-cta-editor" className="scroll-mt-6">
        <div>
          <h2 className="text-2xl font-bold">
            Gather Page — Final Call to Action
          </h2>

          <p className="mt-2 text-gray-600">
            Edit the final invitation and navigation buttons shown at the bottom
            of the Gather page.
          </p>
        </div>

        {/* Preview */}
        <div className="mt-8 overflow-hidden rounded-xl border border-gray-200">
          <div className="bg-blue-950 px-6 py-14 text-center text-white">
            <h3 className="text-3xl font-bold">{content.gatherCtaTitle}</h3>

            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 whitespace-pre-line text-blue-100">
              {content.gatherCtaBody}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <span className="inline-flex min-w-52 justify-center rounded-md bg-white px-6 py-3 font-semibold text-blue-950">
                {content.gatherCtaEventsText}
              </span>

              <span className="inline-flex min-w-52 justify-center rounded-md border border-white px-6 py-3 font-semibold text-white">
                {content.gatherCtaAboutText}
              </span>
            </div>
          </div>
        </div>

        {/* Editor */}
        <form action={updateGatherCallToAction} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="gatherCtaTitle"
              className="mb-2 block font-semibold"
            >
              Section title
            </label>

            <input
              id="gatherCtaTitle"
              name="gatherCtaTitle"
              required
              maxLength={150}
              defaultValue={content.gatherCtaTitle}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="gatherCtaBody" className="mb-2 block font-semibold">
              Invitation message
            </label>

            <textarea
              id="gatherCtaBody"
              name="gatherCtaBody"
              required
              rows={5}
              maxLength={1500}
              defaultValue={content.gatherCtaBody}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="gatherCtaEventsText"
                className="mb-2 block font-semibold"
              >
                Events button text
              </label>

              <input
                id="gatherCtaEventsText"
                name="gatherCtaEventsText"
                required
                maxLength={100}
                defaultValue={content.gatherCtaEventsText}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />

              <p className="mt-2 text-sm text-gray-500">
                This button always links to /events.
              </p>
            </div>

            <div>
              <label
                htmlFor="gatherCtaAboutText"
                className="mb-2 block font-semibold"
              >
                About button text
              </label>

              <input
                id="gatherCtaAboutText"
                name="gatherCtaAboutText"
                required
                maxLength={100}
                defaultValue={content.gatherCtaAboutText}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />

              <p className="mt-2 text-sm text-gray-500">
                This button always links to /about.
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="rounded-md bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Save Gather call to action
          </button>
        </form>
      </section>
    </>
  );
}
