/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getSiteContent } from "~/server/site-content";

import { updateAboutVisionSection } from "../actions";

export async function AboutVisionAdminSection() {
  const content = await getSiteContent();

  return (
    <>
      <div className="my-12 border-t border-gray-200" />

      <section id="about-vision-editor" className="scroll-mt-6">
        <div>
          <h2 className="text-2xl font-bold">About Page — Vision Prayer</h2>

          <p className="mt-2 text-gray-600">
            Edit the vision prayer displayed on the About Us page.
          </p>
        </div>

        {/* Preview */}
        <div className="mt-8 rounded-xl bg-blue-950 p-4 sm:p-8">
          <div className="rounded-xl border border-white/10 bg-blue-900 px-6 py-10 text-center text-white shadow-xl sm:px-10">
            <h3 className="text-3xl font-bold">{content.aboutVisionTitle}</h3>

            <p className="mt-8 text-xl leading-relaxed font-bold whitespace-pre-line">
              {content.missionTitle}
            </p>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed whitespace-pre-line text-blue-100">
              {content.missionTransformation}
            </p>

            <div className="mt-8">
              <p className="text-xl font-bold uppercase">
                {content.missionDisciplesTitle}
              </p>

              <p className="mt-1 text-lg tracking-wide text-blue-100 uppercase">
                {content.missionDisciplesSubtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Editor */}
        <form action={updateAboutVisionSection} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="aboutVisionTitle"
              className="mb-2 block font-semibold"
            >
              Section title
            </label>

            <input
              id="aboutVisionTitle"
              name="aboutVisionTitle"
              type="text"
              required
              maxLength={150}
              defaultValue={content.aboutVisionTitle}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="aboutVisionPrayerTitle"
              className="mb-2 block font-semibold"
            >
              Prayer heading
            </label>

            <textarea
              id="aboutVisionPrayerTitle"
              name="missionTitle"
              required
              rows={3}
              maxLength={250}
              defaultValue={content.missionTitle}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />

            <p className="mt-2 text-sm text-gray-500">
              This heading is shared with the homepage Mission Section.
            </p>
          </div>

          <div>
            <label
              htmlFor="aboutVisionTransformation"
              className="mb-2 block font-semibold"
            >
              Transformation message
            </label>

            <textarea
              id="aboutVisionTransformation"
              name="missionTransformation"
              required
              rows={4}
              maxLength={1000}
              defaultValue={content.missionTransformation}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="aboutVisionDisciplesTitle"
                className="mb-2 block font-semibold"
              >
                Disciples heading
              </label>

              <input
                id="aboutVisionDisciplesTitle"
                name="missionDisciplesTitle"
                type="text"
                required
                maxLength={150}
                defaultValue={content.missionDisciplesTitle}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="aboutVisionDisciplesSubtitle"
                className="mb-2 block font-semibold"
              >
                Disciples subtitle
              </label>

              <input
                id="aboutVisionDisciplesSubtitle"
                name="missionDisciplesSubtitle"
                type="text"
                required
                maxLength={150}
                defaultValue={content.missionDisciplesSubtitle}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>

          <p className="rounded-md bg-blue-50 px-4 py-3 text-sm text-blue-900">
            The prayer wording is shared with the homepage Mission Section.
            Updating it here will update both pages.
          </p>

          <button
            type="submit"
            className="rounded-md bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Save Vision Prayer section
          </button>
        </form>
      </section>
    </>
  );
}
