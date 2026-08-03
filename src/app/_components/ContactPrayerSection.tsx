function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
      fill="currentColor"
    >
      <path d="M14 8h3V4h-3c-3.3 0-5 2-5 5v2H6v4h3v9h4v-9h3.2l.8-4H13V9c0-.7.3-1 1-1Z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
      fill="currentColor"
    >
      <path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 15.5 4.5 12 4.5s-7 .1-8.9.6A3 3 0 0 0 1 7.2C.5 9.1.5 12 .5 12s0 2.9.5 4.8a3 3 0 0 0 2.1 2.1c1.9.5 5.4.6 8.9.6s7-.1 8.9-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-4.8.5-4.8s0-2.9-.5-4.8ZM9.7 15.5v-7l6.1 3.5-6.1 3.5Z" />
    </svg>
  );
}

export function ContactPrayerSection() {
  return (
    <section className="bg-blue-950 px-4 py-16 text-white sm:px-6 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:gap-20">
        {/* Contact information */}
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">
            Saskatoon New Life Community Fellowship
          </h2>

          <div className="mt-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="mt-1 text-purple-400">
                <LocationIcon />
              </div>

              <address className="leading-relaxed not-italic">
                3532 Fairlight Drive
                <br />
                Saskatoon SK S7M 4T3
              </address>
            </div>

            <a
              href="tel:+13066831950"
              className="flex items-center gap-4 transition hover:text-purple-300"
            >
              <span className="text-purple-400">
                <PhoneIcon />
              </span>

              <span>(306) 683-1950</span>
            </a>

            <a
              href="mailto:info@saskatoonnewlife.ca"
              className="flex items-center gap-4 transition hover:text-purple-300"
            >
              <span className="text-purple-400">
                <MailIcon />
              </span>

              <span>info@saskatoonnewlife.ca</span>
            </a>
          </div>

          <div className="mt-9">
            <h3 className="text-lg font-bold">Follow us:</h3>

            <div className="mt-4 flex flex-wrap gap-6">
              <a
                href="https://www.facebook.com/SNLCFPage"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-blue-400 transition hover:text-blue-300"
              >
                <FacebookIcon />
                <span>Facebook</span>
              </a>

              <a
                href="https://www.youtube.com/@SNLCFLive"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-red-400 transition hover:text-red-300"
              >
                <YouTubeIcon />
                <span>YouTube</span>
              </a>
            </div>
          </div>
        </div>

        {/* Prayer-request form */}
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">Prayer Requests</h2>

          <form className="mt-8 space-y-5">
            <div>
              <label htmlFor="prayer-name" className="mb-2 block font-semibold">
                Name
              </label>

              <input
                id="prayer-name"
                name="name"
                type="text"
                placeholder="Your name"
                className="w-full rounded-md border border-slate-600 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-purple-400"
              />
            </div>

            <div>
              <label
                htmlFor="prayer-email"
                className="mb-2 block font-semibold"
              >
                Email
              </label>

              <input
                id="prayer-email"
                name="email"
                type="email"
                placeholder="Your email"
                className="w-full rounded-md border border-slate-600 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-purple-400"
              />
            </div>

            <div>
              <label
                htmlFor="prayer-request"
                className="mb-2 block font-semibold"
              >
                Prayer Request
              </label>

              <textarea
                id="prayer-request"
                name="prayerRequest"
                rows={5}
                placeholder="Share your prayer request..."
                className="w-full resize-y rounded-md border border-slate-600 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-purple-400"
              />
            </div>

            <button
              type="button"
              disabled
              title="Prayer request submissions are coming soon."
              className="w-full cursor-not-allowed rounded-md bg-purple-600 px-6 py-3 font-bold text-white opacity-50"
            >
              Submit Prayer Request
            </button>

            <p className="text-center text-sm text-slate-400">
              Online prayer-request submissions are coming soon.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
