import { getLatestYouTubeStream, youtubeStreamsUrl } from "~/server/youtube";

export async function LatestSermonSection() {
  let stream = null;

  try {
    stream = await getLatestYouTubeStream();
  } catch (error) {
    console.error("Unable to retrieve the latest YouTube livestream:", error);
  }

  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold text-blue-950 sm:text-4xl">
          Watch Our Latest Sermon
        </h2>

        <div className="mt-10">
          {stream ? (
            <>
              <div className="relative aspect-video overflow-hidden rounded-xl bg-black shadow-xl">
                {stream.isLive && (
                  <div className="absolute top-4 left-4 z-10 rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white shadow">
                    LIVE NOW
                  </div>
                )}

                <iframe
                  src={stream.embedUrl}
                  title={stream.title}
                  className="absolute inset-0 h-full w-full"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>

              <p className="mt-4 text-center text-sm text-gray-600">
                {stream.title}
              </p>
            </>
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-xl bg-black px-6 text-center text-white shadow-xl">
              <div>
                <p className="text-xl font-semibold">
                  The latest sermon is temporarily unavailable.
                </p>

                <p className="mt-2 text-gray-300">
                  Visit our YouTube channel to watch recent services.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <a
            href={youtubeStreamsUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-blue-950 px-8 py-3 font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-blue-900"
          >
            Watch More
          </a>
        </div>
      </div>
    </section>
  );
}
