/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyrightFooter } from "~/app/_components/CopyrightFooter";

import { db } from "~/server/db";
import { getSiteContent } from "~/server/site-content";

type TestimonyPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function TestimonyPage({ params }: TestimonyPageProps) {
  const { slug } = await params;

  const [testimony, content] = await Promise.all([
    db.testimony.findUnique({
      where: {
        slug,
      },
    }),

    getSiteContent(),
  ]);

  if (!testimony?.published) {
    notFound();
  }

  const paragraphs = testimony.body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-white pt-40 text-slate-700">
      {/* Back link */}
      <section className="border-b border-gray-200">
        <div className="mx-auto flex max-w-6xl justify-end px-4 py-5 sm:px-6">
          <Link
            href="/discipleship"
            className="inline-flex items-center gap-2 font-semibold text-blue-700 transition hover:text-blue-950"
          >
            <span aria-hidden="true">←</span>
            Back to discipleship
          </Link>
        </div>
      </section>

      {/* Story hero */}
      <section className="px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            {testimony.imageUrl ? (
              <div
                role="img"
                aria-label={testimony.title}
                className="aspect-4/3 bg-gray-100 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${JSON.stringify(testimony.imageUrl)})`,
                }}
              />
            ) : (
              <div className="flex aspect-4/3 items-center justify-center bg-gray-100 text-gray-500">
                No image
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-bold tracking-[0.3em] text-blue-700">
              {testimony.kicker}
            </p>

            <h1 className="mt-6 text-5xl leading-[0.95] font-bold tracking-tight text-blue-950 sm:text-6xl lg:text-7xl">
              {testimony.title}.
            </h1>

            <p className="mt-8 text-sm font-bold text-gray-950">
              {testimony.authorLine}
            </p>
          </div>
        </div>
      </section>

      {/* Full testimony */}
      <section className="border-y border-gray-200 bg-gray-50 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <blockquote className="text-3xl leading-tight font-medium text-blue-900 sm:text-4xl">
            “{testimony.summary}”
          </blockquote>

          <div className="mt-10 space-y-8 text-lg leading-8 text-slate-600">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}

            {testimony.closingText && (
              <p className="font-bold text-gray-950">{testimony.closingText}</p>
            )}
          </div>
        </div>
      </section>

      {/* Keep exploring */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-bold tracking-[0.3em] text-blue-700">
            {content.discipleshipExploreEyebrow}
          </p>

          <h2 className="mt-5 text-4xl font-bold text-blue-950 sm:text-5xl">
            {content.discipleshipExploreTitle}
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            {content.discipleshipExploreBody}
          </p>

          <Link
            href="/discipleship"
            className="mt-7 inline-flex items-center gap-2 font-semibold text-blue-700 hover:text-blue-950"
          >
            {content.discipleshipExploreButtonText}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
      <CopyrightFooter />
    </main>
  );
}
