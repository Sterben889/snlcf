/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { updateServeHero } from "~/app/admin/actions";
import { getSiteContent } from "~/server/site-content";

export async function ServePageAdminSection() {
  const content = await getSiteContent();

  return (
    <>
      <div className="my-12 border-t border-gray-200" />

      <section id="serve-page-header-editor" className="scroll-mt-6">
        <div>
          <h2 className="text-2xl font-bold">Serve Page — Header</h2>

          <p className="mt-2 text-gray-600">
            Edit the heading and introduction shown at the top of the Serve
            page.
          </p>
        </div>

        {/* Preview */}
        <div className="mt-8 overflow-hidden rounded-xl border border-gray-200">
          <div className="bg-blue-900 px-6 py-14 text-center text-white">
            <h3 className="text-4xl font-bold">{content.serveHeroTitle}</h3>

            <p className="mx-auto mt-5 max-w-2xl text-xl leading-relaxed whitespace-pre-line text-blue-100">
              {content.serveHeroSubtitle}
            </p>

            <div className="mx-auto mt-7 h-1 w-20 rounded-full bg-white/40" />
          </div>
        </div>

        {/* Editor */}
        <form action={updateServeHero} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="serveHeroTitle"
              className="mb-2 block font-semibold"
            >
              Serve page title
            </label>

            <input
              id="serveHeroTitle"
              name="serveHeroTitle"
              type="text"
              required
              maxLength={150}
              defaultValue={content.serveHeroTitle}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="serveHeroSubtitle"
              className="mb-2 block font-semibold"
            >
              Serve page subtitle
            </label>

            <textarea
              id="serveHeroSubtitle"
              name="serveHeroSubtitle"
              required
              rows={4}
              maxLength={500}
              defaultValue={content.serveHeroSubtitle}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="rounded-md bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Save Serve page header
          </button>
        </form>
      </section>
    </>
  );
}
