/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getSiteContent } from "~/server/site-content";

import { updateAboutMissionSection } from "../actions";

export async function AboutMissionAdminSection() {
  const content = await getSiteContent();

  return (
    <>
      <div className="my-12 border-t border-gray-200" />

      <section id="about-mission-editor" className="scroll-mt-6">
        <div>
          <h2 className="text-2xl font-bold">
            About Page — Purpose and Mission
          </h2>

          <p className="mt-2 text-gray-600">
            Edit the purpose and mission statement shown on the About Us page.
          </p>
        </div>

        {/* Preview */}
        <div className="mt-8 rounded-xl bg-gray-50 px-5 py-10 sm:px-8">
          <h3 className="text-center text-3xl font-bold text-blue-950">
            {content.aboutMissionTitle}
          </h3>

          <div className="mx-auto mt-8 max-w-3xl rounded-xl bg-white px-6 py-10 text-center shadow-lg">
            <p className="text-lg leading-8 whitespace-pre-line text-slate-800">
              {content.missionStatement}
            </p>
          </div>
        </div>

        {/* Editor */}
        <form action={updateAboutMissionSection} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="aboutMissionTitle"
              className="mb-2 block font-semibold"
            >
              Section title
            </label>

            <input
              id="aboutMissionTitle"
              name="aboutMissionTitle"
              type="text"
              required
              maxLength={150}
              defaultValue={content.aboutMissionTitle}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="aboutMissionStatement"
              className="mb-2 block font-semibold"
            >
              Mission statement
            </label>

            <textarea
              id="aboutMissionStatement"
              name="missionStatement"
              required
              rows={5}
              maxLength={1500}
              defaultValue={content.missionStatement}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />

            <p className="mt-2 text-sm text-gray-500">
              This statement is shared with the homepage Mission Section.
            </p>
          </div>

          <button
            type="submit"
            className="rounded-md bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Save purpose and mission section
          </button>
        </form>
      </section>
    </>
  );
}
