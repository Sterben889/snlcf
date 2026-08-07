/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { updateGiveThankYou } from "~/app/admin/actions";
import { getSiteContent } from "~/server/site-content";

export async function GiveThankYouAdminSection() {
  const content = await getSiteContent();

  return (
    <>
      <div className="my-12 border-t border-gray-200" />

      <section id="give-thank-you-editor" className="scroll-mt-6">
        <div>
          <h2 className="text-2xl font-bold">Give Page — Thank You</h2>

          <p className="mt-2 text-gray-600">
            Edit the final thank-you message displayed at the bottom of the Give
            page.
          </p>
        </div>

        {/* Preview */}
        <div className="mt-8 overflow-hidden rounded-xl border border-gray-200">
          <div className="bg-blue-950 px-6 py-14 text-center text-white">
            <h3 className="text-3xl font-bold">{content.giveThanksTitle}</h3>

            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 whitespace-pre-line text-blue-100">
              {content.giveThanksBody}
            </p>
          </div>
        </div>

        {/* Editor */}
        <form action={updateGiveThankYou} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="giveThanksTitle"
              className="mb-2 block font-semibold"
            >
              Section title
            </label>

            <input
              id="giveThanksTitle"
              name="giveThanksTitle"
              type="text"
              required
              maxLength={150}
              defaultValue={content.giveThanksTitle}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="giveThanksBody"
              className="mb-2 block font-semibold"
            >
              Thank-you message
            </label>

            <textarea
              id="giveThanksBody"
              name="giveThanksBody"
              required
              rows={5}
              maxLength={1500}
              defaultValue={content.giveThanksBody}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="rounded-md bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Save thank-you section
          </button>
        </form>
      </section>
    </>
  );
}
