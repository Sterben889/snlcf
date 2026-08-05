/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { updateAboutCallToAction } from "~/app/admin/actions";
import { getSiteContent } from "~/server/site-content";

export async function AboutCallToActionAdminSection() {
  const content = await getSiteContent();

  return (
    <>
      <div className="my-12 border-t border-gray-200" />

      <section id="about-cta-editor" className="scroll-mt-6">
        <div>
          <h2 className="text-2xl font-bold">
            About Page — Final Call to Action
          </h2>

          <p className="mt-2 text-gray-600">
            Edit the final message and buttons shown at the bottom of the About
            Us page.
          </p>
        </div>

        <div className="mt-8 rounded-xl bg-blue-950 px-6 py-12 text-center text-white">
          <h3 className="text-3xl font-bold">{content.aboutCtaTitle}</h3>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 whitespace-pre-line text-blue-100">
            {content.aboutCtaBody}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <span className="inline-flex min-w-52 justify-center rounded-md bg-white px-6 py-3 font-semibold text-blue-950">
              {content.aboutCtaVisitText}
            </span>

            <span className="inline-flex min-w-52 justify-center rounded-md border border-white px-6 py-3 font-semibold text-white">
              {content.aboutCtaEventsText}
            </span>
          </div>
        </div>

        <form action={updateAboutCallToAction} className="mt-8 space-y-6">
          <div>
            <label htmlFor="aboutCtaTitle" className="mb-2 block font-semibold">
              Section title
            </label>

            <input
              id="aboutCtaTitle"
              name="aboutCtaTitle"
              type="text"
              required
              maxLength={150}
              defaultValue={content.aboutCtaTitle}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="aboutCtaBody" className="mb-2 block font-semibold">
              Message
            </label>

            <textarea
              id="aboutCtaBody"
              name="aboutCtaBody"
              required
              rows={4}
              maxLength={1000}
              defaultValue={content.aboutCtaBody}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="aboutCtaVisitText"
                className="mb-2 block font-semibold"
              >
                Visit button text
              </label>

              <input
                id="aboutCtaVisitText"
                name="aboutCtaVisitText"
                type="text"
                required
                maxLength={100}
                defaultValue={content.aboutCtaVisitText}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="aboutCtaVisitUrl"
                className="mb-2 block font-semibold"
              >
                Map destination
              </label>

              <input
                id="aboutCtaVisitUrl"
                name="aboutCtaVisitUrl"
                type="url"
                required
                maxLength={1000}
                defaultValue={content.aboutCtaVisitUrl}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="aboutCtaEventsText"
                className="mb-2 block font-semibold"
              >
                Events button text
              </label>

              <input
                id="aboutCtaEventsText"
                name="aboutCtaEventsText"
                type="text"
                required
                maxLength={100}
                defaultValue={content.aboutCtaEventsText}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="aboutCtaEventsUrl"
                className="mb-2 block font-semibold"
              >
                Events button destination
              </label>

              <input
                id="aboutCtaEventsUrl"
                name="aboutCtaEventsUrl"
                type="text"
                required
                maxLength={500}
                defaultValue={content.aboutCtaEventsUrl}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>

          <button
            type="submit"
            className="rounded-md bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Save final About section
          </button>
        </form>
      </section>
    </>
  );
}
