/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { updateDiscipleshipHero } from "~/app/admin/actions";
import { getSiteContent } from "~/server/site-content";

export async function DiscipleshipPageAdminSection() {
  const content = await getSiteContent();

  return (
    <>
      <div className="my-12 border-t border-gray-200" />

      <section id="discipleship-page-header-editor" className="scroll-mt-6">
        <div>
          <h2 className="text-2xl font-bold">Discipleship Page — Header</h2>

          <p className="mt-2 text-gray-600">
            Edit the introductory content shown at the top of the Discipleship
            page.
          </p>
        </div>

        {/* Preview */}
        <div className="mt-8 overflow-hidden rounded-xl border border-gray-200">
          <div className="bg-blue-900 px-6 py-16 text-center text-white">
            <p className="text-sm font-bold tracking-[0.3em] text-blue-200">
              {content.discipleshipHeroEyebrow}
            </p>

            <h3 className="mx-auto mt-6 max-w-3xl text-4xl leading-tight font-bold sm:text-5xl">
              {content.discipleshipHeroTitle}
            </h3>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 whitespace-pre-line text-blue-100">
              {content.discipleshipHeroSubtitle}
            </p>

            <div className="mx-auto mt-8 h-1 w-20 rounded-full bg-white/40" />
          </div>
        </div>

        {/* Editor */}
        <form action={updateDiscipleshipHero} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="discipleshipHeroEyebrow"
              className="mb-2 block font-semibold"
            >
              Small heading
            </label>

            <input
              id="discipleshipHeroEyebrow"
              name="discipleshipHeroEyebrow"
              type="text"
              required
              maxLength={100}
              defaultValue={content.discipleshipHeroEyebrow}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="discipleshipHeroTitle"
              className="mb-2 block font-semibold"
            >
              Main title
            </label>

            <textarea
              id="discipleshipHeroTitle"
              name="discipleshipHeroTitle"
              required
              rows={3}
              maxLength={200}
              defaultValue={content.discipleshipHeroTitle}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="discipleshipHeroSubtitle"
              className="mb-2 block font-semibold"
            >
              Subtitle
            </label>

            <textarea
              id="discipleshipHeroSubtitle"
              name="discipleshipHeroSubtitle"
              required
              rows={5}
              maxLength={1000}
              defaultValue={content.discipleshipHeroSubtitle}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="rounded-md bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Save Discipleship page header
          </button>
        </form>
      </section>
    </>
  );
}
