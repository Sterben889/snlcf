/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { updateServeIntro } from "~/app/admin/actions";
import { getSiteContent } from "~/server/site-content";

export async function ServeIntroAdminSection() {
  const content = await getSiteContent();

  return (
    <>
      <div className="my-12 border-t border-gray-200" />

      <section id="serve-intro-editor" className="scroll-mt-6">
        <div>
          <h2 className="text-2xl font-bold">Serve Page — Introduction</h2>

          <p className="mt-2 text-gray-600">
            Edit the introductory message shown underneath the Serve page
            header.
          </p>
        </div>

        {/* Preview */}
        <div className="mt-8 rounded-xl bg-gray-50 p-5 sm:p-8">
          <div className="mx-auto max-w-3xl rounded-xl border border-gray-100 bg-white px-6 py-10 text-center shadow-lg sm:px-10">
            <h3 className="text-3xl font-bold text-blue-900">
              {content.serveIntroTitle}
            </h3>

            <p className="mx-auto mt-6 text-lg leading-8 whitespace-pre-line text-slate-700">
              {content.serveIntroBody}
            </p>
          </div>
        </div>

        {/* Editor */}
        <form action={updateServeIntro} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="serveIntroTitle"
              className="mb-2 block font-semibold"
            >
              Section title
            </label>

            <input
              id="serveIntroTitle"
              name="serveIntroTitle"
              type="text"
              required
              maxLength={150}
              defaultValue={content.serveIntroTitle}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="serveIntroBody"
              className="mb-2 block font-semibold"
            >
              Section message
            </label>

            <textarea
              id="serveIntroBody"
              name="serveIntroBody"
              required
              rows={7}
              maxLength={2000}
              defaultValue={content.serveIntroBody}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="rounded-md bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Save Serve introduction
          </button>
        </form>
      </section>
    </>
  );
}
