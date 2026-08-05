const editorSections = [
  {
    id: "hero-editor",
    label: "Hero Section",
  },
  {
    id: "sunday-service-editor",
    label: "Sunday Service",
  },
  {
    id: "mission-editor",
    label: "Mission Section",
  },
  {
    id: "events-editor",
    label: "Upcoming Events",
  },
  {
    id: "about-editor",
    label: "About Page",
  },
  {
    id: "about-who-editor",
    label: "About — Who We Are",
  },

  {
    id: "about-mission-editor",
    label: "About — Purpose & Mission",
  },
  {
    id: "about-vision-editor",
    label: "About — Vision Prayer",
  },
] as const;

export function AdminTableOfContents() {
  return (
    <aside className="lg:sticky lg:top-6 lg:self-start">
      <div className="rounded-xl bg-white p-4 shadow">
        <h2 className="text-lg font-bold text-gray-900">Jump to section</h2>

        <p className="mt-1 text-sm text-gray-500">
          Select the part of the website you want to edit.
        </p>

        <nav
          aria-label="Admin editor sections"
          className="mt-4 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0"
        >
          {editorSections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="shrink-0 rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-700 hover:bg-blue-50 hover:text-blue-900 lg:w-full"
            >
              {section.label}
            </a>
          ))}

          <a
            href="#admin-top"
            className="shrink-0 rounded-md bg-blue-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-900 lg:mt-2 lg:w-full"
          >
            Back to top
          </a>
        </nav>
      </div>
    </aside>
  );
}
