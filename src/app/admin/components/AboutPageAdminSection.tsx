/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getSiteContent } from "~/server/site-content";

import { updateAboutHero } from "../actions";

export async function AboutPageAdminSection() {
  const content = await getSiteContent();

  return (
    <>
      <div className="my-12 border-t border-gray-200" />

      <section>
        <div>
          <h2 className="text-2xl font-bold">About Page Header</h2>

          <p className="mt-2 text-gray-600">
            Edit the heading and introduction shown at the top of the About Us
            page.
          </p>
        </div>

        {/* Preview */}
        <div className="mt-8 overflow-hidden rounded-xl border border-gray-200">
          <div className="bg-blue-900 px-6 py-14 text-center text-white">
            <h3 className="text-4xl font-bold">{content.aboutHeroTitle}</h3>

            <p className="mx-auto mt-5 max-w-2xl text-xl leading-relaxed whitespace-pre-line text-blue-100">
              {content.aboutHeroSubtitle}
            </p>

            <div className="mx-auto mt-7 h-1 w-20 rounded-full bg-white/40" />
          </div>
        </div>

        {/* Editor */}
        <form action={updateAboutHero} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="aboutHeroTitle"
              className="mb-2 block font-semibold"
            >
              About page title
            </label>

            <input
              id="aboutHeroTitle"
              name="aboutHeroTitle"
              type="text"
              required
              maxLength={120}
              defaultValue={content.aboutHeroTitle}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="aboutHeroSubtitle"
              className="mb-2 block font-semibold"
            >
              About page subtitle
            </label>

            <textarea
              id="aboutHeroSubtitle"
              name="aboutHeroSubtitle"
              required
              rows={4}
              maxLength={500}
              defaultValue={content.aboutHeroSubtitle}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="rounded-md bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Save About page header
          </button>
        </form>
      </section>
    </>
  );
}
