/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { signOut } from "~/server/auth";
import { getSiteContent } from "~/server/site-content";

import {
  updateDescriptionSection,
  updateHomepage,
  updateMissionSection,
} from "./actions";
import { EventsAdminSection } from "./components/EventsAdminSection";
import { AboutPageAdminSection } from "./components/AboutPageAdminSection";
import { AdminTableOfContents } from "./components/AdminTableOfContents";
import { AboutWhoAdminSection } from "./components/AboutWhoAdminSection";
import { AboutMissionAdminSection } from "./components/AboutMissionAdminSection";
import { AboutVisionAdminSection } from "./components/AboutVisionAdminSection";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const content = await getSiteContent();

  const previewBackground = `linear-gradient(
    rgba(0, 0, 0, 0.4),
    rgba(0, 0, 0, 0.4)
  ), url(${JSON.stringify(content.heroImageUrl)})`;

  return (
    <main
      id="admin-top"
      className="min-h-screen bg-gray-100 px-4 py-12 text-gray-900 sm:px-6"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <AdminTableOfContents />

          <div className="rounded-xl bg-white p-6 shadow sm:p-8">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">Homepage Editor</h1>

                <p className="mt-2 text-gray-600">
                  Change the homepage content and images.
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

            {/* Hero section editor */}
            <section id="hero-editor" className="scroll-mt-6 pt-10">
              <div>
                <h2 className="text-2xl font-bold">Hero Section</h2>

                <p className="mt-2 text-gray-600">
                  Edit the main title, subtitle, and background image.
                </p>
              </div>

              {/* Hero preview */}
              <div
                className="mt-8 flex min-h-72 items-center justify-center rounded-lg bg-cover bg-center px-6"
                style={{
                  backgroundImage: previewBackground,
                }}
              >
                <div className="text-center text-white">
                  <h3 className="text-4xl font-bold">{content.heroTitle}</h3>

                  <p className="mt-3 text-xl font-semibold">
                    {content.heroSubtitle}
                  </p>
                </div>
              </div>

              {/* Hero form */}
              <form action={updateHomepage} className="mt-8 space-y-6">
                <div>
                  <label
                    htmlFor="heroTitle"
                    className="mb-2 block font-semibold"
                  >
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
                  <label
                    htmlFor="heroImage"
                    className="mb-2 block font-semibold"
                  >
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
                    Leave this empty to keep the current picture. Maximum size:
                    4 MB.
                  </p>
                </div>

                <button
                  type="submit"
                  className="rounded-md bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
                >
                  Save hero section
                </button>
              </form>
            </section>

            <div className="my-12 border-t border-gray-200" />

            {/* Sunday service section editor */}
            <section id="sunday-service-editor" className="scroll-mt-6">
              <div>
                <h2 className="text-2xl font-bold">Sunday Service Section</h2>

                <p className="mt-2 text-gray-600">
                  Edit the service description, time, location, image, and
                  button.
                </p>
              </div>

              {/* Sunday service preview */}
              <div className="mt-8 bg-black p-4 sm:p-8">
                <div className="grid items-center gap-8 bg-white p-6 lg:grid-cols-[0.8fr_1.4fr] lg:p-10">
                  {content.descImageUrl ? (
                    <div
                      role="img"
                      aria-label={content.descTitle}
                      className="min-h-80 bg-gray-200 bg-cover bg-center lg:min-h-105"
                      style={{
                        backgroundImage: `url(${JSON.stringify(
                          content.descImageUrl,
                        )})`,
                      }}
                    />
                  ) : (
                    <div className="flex min-h-80 items-center justify-center bg-gray-200 p-6 text-center text-gray-500 lg:min-h-105">
                      No Sunday service image has been uploaded.
                    </div>
                  )}

                  <div>
                    <h3 className="text-3xl font-medium">
                      {content.descTitle}
                    </h3>

                    <p className="mt-6 text-lg leading-relaxed whitespace-pre-line">
                      {content.descBody}
                    </p>

                    <div className="mt-8 space-y-1 text-lg">
                      <p>
                        <span className="font-medium">Time:</span>{" "}
                        {content.descTime}
                      </p>

                      <p>
                        <span className="font-medium">Location:</span>{" "}
                        {content.descLocation}
                      </p>
                    </div>

                    <span className="mt-8 inline-flex min-w-60 justify-center rounded-full bg-black px-8 py-3 font-bold tracking-wide text-white">
                      {content.descButtonText}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sunday service form */}
              <form
                action={updateDescriptionSection}
                className="mt-8 space-y-6"
              >
                <div>
                  <label
                    htmlFor="descTitle"
                    className="mb-2 block font-semibold"
                  >
                    Section title
                  </label>

                  <input
                    id="descTitle"
                    name="descTitle"
                    type="text"
                    required
                    maxLength={120}
                    defaultValue={content.descTitle}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                <div>
                  <label
                    htmlFor="descBody"
                    className="mb-2 block font-semibold"
                  >
                    Description
                  </label>

                  <textarea
                    id="descBody"
                    name="descBody"
                    required
                    rows={8}
                    maxLength={2500}
                    defaultValue={content.descBody}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="descTime"
                      className="mb-2 block font-semibold"
                    >
                      Service time
                    </label>

                    <input
                      id="descTime"
                      name="descTime"
                      type="text"
                      required
                      maxLength={100}
                      defaultValue={content.descTime}
                      placeholder="10:00 am"
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="descLocation"
                      className="mb-2 block font-semibold"
                    >
                      Location
                    </label>

                    <input
                      id="descLocation"
                      name="descLocation"
                      type="text"
                      required
                      maxLength={250}
                      defaultValue={content.descLocation}
                      placeholder="3532 Fairlight Dr. Saskatoon, SK"
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="descButtonText"
                      className="mb-2 block font-semibold"
                    >
                      Button text
                    </label>

                    <input
                      id="descButtonText"
                      name="descButtonText"
                      type="text"
                      required
                      maxLength={50}
                      defaultValue={content.descButtonText}
                      placeholder="Learn more"
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="descButtonUrl"
                      className="mb-2 block font-semibold"
                    >
                      Button destination
                    </label>

                    <input
                      id="descButtonUrl"
                      name="descButtonUrl"
                      type="text"
                      required
                      maxLength={500}
                      defaultValue={content.descButtonUrl}
                      placeholder="/about"
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />

                    <p className="mt-2 text-sm text-gray-500">
                      Examples: /about, /contact, or a complete website URL.
                    </p>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="descImage"
                    className="mb-2 block font-semibold"
                  >
                    Sunday service image
                  </label>

                  <input
                    id="descImage"
                    name="descImage"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="block w-full rounded-md border border-gray-300 px-3 py-2"
                  />

                  <p className="mt-2 text-sm text-gray-500">
                    Leave this empty to keep the current image. Maximum size: 4
                    MB.
                  </p>
                </div>

                <button
                  type="submit"
                  className="rounded-md bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
                >
                  Save Sunday service section
                </button>
              </form>
            </section>
            <div className="my-12 border-t border-gray-200" />

            <section id="mission-editor" className="scroll-mt-6">
              <div>
                <h2 className="text-2xl font-bold">Mission Section</h2>

                <p className="mt-2 text-gray-600">
                  Edit the church vision and mission messages.
                </p>
              </div>

              {/* Mission preview */}
              <div className="mt-8 rounded-xl bg-blue-950 p-4 sm:p-8">
                <div className="rounded-xl border border-white/10 bg-blue-900 px-6 py-10 text-center text-white shadow-xl sm:px-10">
                  <h3 className="text-2xl leading-tight font-bold whitespace-pre-line uppercase sm:text-3xl">
                    {content.missionTitle}
                  </h3>

                  <p className="mt-6 text-lg leading-relaxed whitespace-pre-line">
                    {content.missionTransformation}
                  </p>

                  <div className="mt-8">
                    <p className="text-xl font-bold uppercase sm:text-2xl">
                      {content.missionDisciplesTitle}
                    </p>

                    <p className="mt-1 text-lg tracking-wide uppercase">
                      {content.missionDisciplesSubtitle}
                    </p>
                  </div>

                  <div className="my-8 border-t border-white/25" />

                  <p className="text-lg leading-relaxed whitespace-pre-line">
                    {content.missionStatement}
                  </p>
                </div>
              </div>

              {/* Mission form */}
              <form action={updateMissionSection} className="mt-8 space-y-6">
                <div>
                  <label
                    htmlFor="missionTitle"
                    className="mb-2 block font-semibold"
                  >
                    Main mission heading
                  </label>

                  <textarea
                    id="missionTitle"
                    name="missionTitle"
                    required
                    rows={3}
                    maxLength={250}
                    defaultValue={content.missionTitle}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />

                  <p className="mt-2 text-sm text-gray-500">
                    Press Enter where you want the heading to break onto a new
                    line.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="missionTransformation"
                    className="mb-2 block font-semibold"
                  >
                    Transformation message
                  </label>

                  <textarea
                    id="missionTransformation"
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
                      htmlFor="missionDisciplesTitle"
                      className="mb-2 block font-semibold"
                    >
                      Disciples heading
                    </label>

                    <input
                      id="missionDisciplesTitle"
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
                      htmlFor="missionDisciplesSubtitle"
                      className="mb-2 block font-semibold"
                    >
                      Disciples subtitle
                    </label>

                    <input
                      id="missionDisciplesSubtitle"
                      name="missionDisciplesSubtitle"
                      type="text"
                      required
                      maxLength={150}
                      defaultValue={content.missionDisciplesSubtitle}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="missionStatement"
                    className="mb-2 block font-semibold"
                  >
                    Mission statement
                  </label>

                  <textarea
                    id="missionStatement"
                    name="missionStatement"
                    required
                    rows={5}
                    maxLength={1500}
                    defaultValue={content.missionStatement}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-md bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
                >
                  Save mission section
                </button>
              </form>
            </section>
            <div id="events-editor" className="scroll-mt-6">
              <EventsAdminSection />
            </div>

            <div id="about-editor" className="scroll-mt-6">
              <AboutPageAdminSection />
            </div>

            <AboutWhoAdminSection />
            <AboutMissionAdminSection />
            <AboutVisionAdminSection />
          </div>
        </div>
      </div>
    </main>
  );
}
