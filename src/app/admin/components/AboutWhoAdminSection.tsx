/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getSiteContent } from "~/server/site-content";

import { updateAboutWhoSection } from "../actions";

export async function AboutWhoAdminSection() {
  const content = await getSiteContent();

  return (
    <>
      <div className="my-12 border-t border-gray-200" />

      <section id="about-who-editor" className="scroll-mt-6">
        <div>
          <h2 className="text-2xl font-bold">About Page — Who We Are</h2>

          <p className="mt-2 text-gray-600">
            Edit the introduction and church-family description shown on the
            About Us page.
          </p>
        </div>

        {/* Preview */}
        <div className="mt-8 rounded-xl border border-gray-200 bg-white px-6 py-12 shadow-sm sm:px-10">
          <h3 className="text-center text-3xl font-bold text-blue-950">
            {content.aboutWhoTitle}
          </h3>

          <div className="mt-8 space-y-6 text-lg leading-8 text-slate-800">
            <p className="whitespace-pre-line">{content.aboutWhoParagraph1}</p>

            <p className="whitespace-pre-line">{content.aboutWhoParagraph2}</p>

            <p className="whitespace-pre-line">{content.aboutWhoParagraph3}</p>
          </div>
        </div>

        {/* Editor */}
        <form action={updateAboutWhoSection} className="mt-8 space-y-6">
          <div>
            <label htmlFor="aboutWhoTitle" className="mb-2 block font-semibold">
              Section title
            </label>

            <input
              id="aboutWhoTitle"
              name="aboutWhoTitle"
              type="text"
              required
              maxLength={120}
              defaultValue={content.aboutWhoTitle}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="aboutWhoParagraph1"
              className="mb-2 block font-semibold"
            >
              First paragraph
            </label>

            <textarea
              id="aboutWhoParagraph1"
              name="aboutWhoParagraph1"
              required
              rows={6}
              maxLength={2000}
              defaultValue={content.aboutWhoParagraph1}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="aboutWhoParagraph2"
              className="mb-2 block font-semibold"
            >
              Second paragraph
            </label>

            <textarea
              id="aboutWhoParagraph2"
              name="aboutWhoParagraph2"
              required
              rows={6}
              maxLength={2000}
              defaultValue={content.aboutWhoParagraph2}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="aboutWhoParagraph3"
              className="mb-2 block font-semibold"
            >
              Third paragraph
            </label>

            <textarea
              id="aboutWhoParagraph3"
              name="aboutWhoParagraph3"
              required
              rows={6}
              maxLength={2000}
              defaultValue={content.aboutWhoParagraph3}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="rounded-md bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Save Who We Are section
          </button>
        </form>
      </section>
    </>
  );
}
