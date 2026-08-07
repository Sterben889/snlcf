/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { updateGiveScripture } from "~/app/admin/actions";
import { getSiteContent } from "~/server/site-content";

export async function GiveScriptureAdminSection() {
  const content = await getSiteContent();

  return (
    <>
      <div className="my-12 border-t border-gray-200" />

      <section id="give-scripture-editor" className="scroll-mt-6">
        <div>
          <h2 className="text-2xl font-bold">Give Page — Scripture</h2>

          <p className="mt-2 text-gray-600">
            Edit the Bible verse displayed underneath the Give page header.
          </p>
        </div>

        {/* Preview */}
        <div className="mt-8 rounded-xl bg-gray-50 p-5 sm:p-8">
          <div className="mx-auto max-w-3xl rounded-xl border border-gray-100 bg-white px-6 py-10 text-center shadow-lg sm:px-10">
            <p className="text-lg font-semibold text-blue-800">
              {content.giveVerseReference}
            </p>

            <blockquote className="mt-6">
              <p className="text-xl leading-9 font-medium whitespace-pre-line text-slate-800 italic">
                {content.giveVerseText}
              </p>
            </blockquote>
          </div>
        </div>

        {/* Editor */}
        <form action={updateGiveScripture} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="giveVerseReference"
              className="mb-2 block font-semibold"
            >
              Scripture reference
            </label>

            <input
              id="giveVerseReference"
              name="giveVerseReference"
              type="text"
              required
              maxLength={100}
              defaultValue={content.giveVerseReference}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="giveVerseText" className="mb-2 block font-semibold">
              Scripture text
            </label>

            <textarea
              id="giveVerseText"
              name="giveVerseText"
              required
              rows={8}
              maxLength={3000}
              defaultValue={content.giveVerseText}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />

            <p className="mt-2 text-sm text-gray-500">
              You can replace this with another Scripture passage at any time.
            </p>
          </div>

          <button
            type="submit"
            className="rounded-md bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Save Scripture section
          </button>
        </form>
      </section>
    </>
  );
}
