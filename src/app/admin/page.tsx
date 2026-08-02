/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { signOut } from "~/server/auth";
import { getSiteContent } from "~/server/site-content";

import { updateHomepage } from "./actions";

export default async function AdminPage() {
  const content = await getSiteContent();

  const previewBackground = `linear-gradient(
    rgba(0, 0, 0, 0.4),
    rgba(0, 0, 0, 0.4)
  ), url(${JSON.stringify(content.heroImageUrl)})`;

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-12 text-gray-900">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-xl bg-white p-8 shadow">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Homepage Editor</h1>

              <p className="mt-2 text-gray-600">
                Change the homepage text and background picture.
              </p>
            </div>

            <form
              action={async () => {
                "use server";

                await signOut({
                  redirectTo: "/",
                });
              }}
            >
              <button
                type="submit"
                className="rounded-md bg-gray-800 px-4 py-2 font-semibold text-white hover:bg-gray-900"
              >
                Sign out
              </button>
            </form>
          </div>

          <div
            className="mt-8 flex min-h-72 items-center justify-center rounded-lg bg-cover bg-center px-6"
            style={{
              backgroundImage: previewBackground,
            }}
          >
            <div className="text-center text-white">
              <h2 className="text-4xl font-bold">{content.heroTitle}</h2>

              <p className="mt-3 text-xl font-semibold">
                {content.heroSubtitle}
              </p>
            </div>
          </div>

          <form action={updateHomepage} className="mt-8 space-y-6">
            <div>
              <label htmlFor="heroTitle" className="mb-2 block font-semibold">
                Main title
              </label>

              <input
                id="heroTitle"
                name="heroTitle"
                type="text"
                required
                maxLength={120}
                defaultValue={content.heroTitle}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="heroSubtitle"
                className="mb-2 block font-semibold"
              >
                Subtitle
              </label>

              <input
                id="heroSubtitle"
                name="heroSubtitle"
                type="text"
                required
                maxLength={200}
                defaultValue={content.heroSubtitle}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="heroImage" className="mb-2 block font-semibold">
                New background image
              </label>

              <input
                id="heroImage"
                name="heroImage"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="block w-full rounded-md border border-gray-300 px-3 py-2"
              />

              <p className="mt-2 text-sm text-gray-500">
                Leave this empty to keep the current picture. Maximum size: 4
                MB.
              </p>
            </div>

            <button
              type="submit"
              className="rounded-md bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
            >
              Save homepage
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
