/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { updateServeCallToAction } from "~/app/admin/actions";
import { getSiteContent } from "~/server/site-content";

export async function ServeCallToActionAdminSection() {
  const content = await getSiteContent();

  return (
    <>
      <div className="my-12 border-t border-gray-200" />

      <section id="serve-cta-editor" className="scroll-mt-6">
        <div>
          <h2 className="text-2xl font-bold">Serve Page — Find Your Fit</h2>

          <p className="mt-2 text-gray-600">
            Edit the final invitation and Google Form button shown underneath
            the ministry opportunities.
          </p>
        </div>

        {/* Preview */}
        <div className="mt-8 overflow-hidden rounded-xl bg-blue-950 lg:grid lg:grid-cols-2">
          <div className="flex flex-col justify-center px-8 py-12 text-white">
            <p className="text-xs font-bold tracking-[0.25em] text-blue-200">
              {content.serveCtaEyebrow}
            </p>

            <h3 className="mt-5 text-3xl font-bold">{content.serveCtaTitle}</h3>

            <p className="mt-5 leading-7 whitespace-pre-line text-blue-100">
              {content.serveCtaBody}
            </p>

            <div className="mt-7">
              <span className="inline-flex rounded-md bg-white px-6 py-3 font-semibold text-blue-950">
                {content.serveCtaButtonText}
              </span>
            </div>
          </div>

          {content.serveCtaImageUrl ? (
            <div
              role="img"
              aria-label="Serve section preview"
              className="min-h-72 bg-cover bg-center"
              style={{
                backgroundImage: `url(${JSON.stringify(
                  content.serveCtaImageUrl,
                )})`,
              }}
            />
          ) : (
            <div className="flex min-h-72 items-center justify-center bg-blue-900 text-blue-200">
              No image selected
            </div>
          )}
        </div>

        {/* Editor */}
        <form action={updateServeCallToAction} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="serveCtaEyebrow"
              className="mb-2 block font-semibold"
            >
              Small heading
            </label>

            <input
              id="serveCtaEyebrow"
              name="serveCtaEyebrow"
              required
              maxLength={100}
              defaultValue={content.serveCtaEyebrow}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="serveCtaTitle" className="mb-2 block font-semibold">
              Main title
            </label>

            <input
              id="serveCtaTitle"
              name="serveCtaTitle"
              required
              maxLength={150}
              defaultValue={content.serveCtaTitle}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="serveCtaBody" className="mb-2 block font-semibold">
              Message
            </label>

            <textarea
              id="serveCtaBody"
              name="serveCtaBody"
              required
              rows={6}
              maxLength={2000}
              defaultValue={content.serveCtaBody}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="serveCtaButtonText"
                className="mb-2 block font-semibold"
              >
                Button text
              </label>

              <input
                id="serveCtaButtonText"
                name="serveCtaButtonText"
                required
                maxLength={100}
                defaultValue={content.serveCtaButtonText}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="serveCtaButtonUrl"
                className="mb-2 block font-semibold"
              >
                Google Form URL
              </label>

              <input
                id="serveCtaButtonUrl"
                name="serveCtaButtonUrl"
                type="url"
                required
                maxLength={1500}
                defaultValue={content.serveCtaButtonUrl}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label htmlFor="serveCtaImage" className="mb-2 block font-semibold">
              Section image
            </label>

            <input
              id="serveCtaImage"
              name="serveCtaImage"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="block w-full rounded-md border border-gray-300 px-3 py-2"
            />

            <p className="mt-2 text-sm text-gray-500">
              Leave empty to keep the current image.
            </p>

            {content.serveCtaImageUrl && (
              <label className="mt-3 flex items-center gap-3">
                <input name="removeImage" type="checkbox" className="h-4 w-4" />

                <span className="text-sm font-medium">
                  Remove current image
                </span>
              </label>
            )}
          </div>

          <button
            type="submit"
            className="rounded-md bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Save Find Your Fit section
          </button>
        </form>
      </section>
    </>
  );
}
