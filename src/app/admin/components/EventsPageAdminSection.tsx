/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { updateEventsHero } from "~/app/admin/actions";
import { getSiteContent } from "~/server/site-content";

export async function EventsPageAdminSection() {
  const content = await getSiteContent();

  return (
    <>
      <div className="my-12 border-t border-gray-200" />

      <section id="events-page-header-editor" className="scroll-mt-6">
        <div>
          <h2 className="text-2xl font-bold">Events Page — Header</h2>

          <p className="mt-2 text-gray-600">
            Edit the heading and introduction shown at the top of the Events
            page.
          </p>
        </div>

        {/* Preview */}
        <div className="mt-8 overflow-hidden rounded-xl border border-gray-200">
          <div className="bg-blue-900 px-6 py-14 text-center text-white">
            <h3 className="text-4xl font-bold">{content.eventsHeroTitle}</h3>

            <p className="mx-auto mt-5 max-w-2xl text-xl leading-relaxed whitespace-pre-line text-blue-100">
              {content.eventsHeroSubtitle}
            </p>

            <div className="mx-auto mt-7 h-1 w-20 rounded-full bg-white/40" />
          </div>
        </div>

        {/* Editor form */}
        <form action={updateEventsHero} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="eventsHeroTitle"
              className="mb-2 block font-semibold"
            >
              Events page title
            </label>

            <input
              id="eventsHeroTitle"
              name="eventsHeroTitle"
              type="text"
              required
              maxLength={150}
              defaultValue={content.eventsHeroTitle}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="eventsHeroSubtitle"
              className="mb-2 block font-semibold"
            >
              Events page subtitle
            </label>

            <textarea
              id="eventsHeroSubtitle"
              name="eventsHeroSubtitle"
              required
              rows={4}
              maxLength={500}
              defaultValue={content.eventsHeroSubtitle}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="rounded-md bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Save Events page header
          </button>
        </form>
      </section>
    </>
  );
}
