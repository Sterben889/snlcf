const editorGroups = [
  {
    id: "homepage-group",
    label: "Homepage",
    sections: [
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
    ],
  },
  {
    id: "about-group",
    label: "About Us Page",
    sections: [
      {
        id: "about-editor",
        label: "Page Header",
      },
      {
        id: "about-who-editor",
        label: "Who We Are",
      },
      {
        id: "about-mission-editor",
        label: "Purpose & Mission",
      },
      {
        id: "about-vision-editor",
        label: "Vision Prayer",
      },
      {
        id: "statement-of-faith-editor",
        label: "Statement of Faith",
      },
      {
        id: "leadership-team-editor",
        label: "Leadership Team",
      },
      {
        id: "about-cta-editor",
        label: "Final Call to Action",
      },
    ],
  },
  {
    id: "events-page-group",
    label: "Events Page",
    sections: [
      {
        id: "events-page-header-editor",
        label: "Page Header",
      },
    ],
  },
] as const;

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5 transition-transform duration-200 group-open:rotate-90"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function AdminTableOfContents() {
  return (
    <aside className="lg:sticky lg:top-6 lg:self-start">
      <div className="rounded-xl bg-white p-4 shadow">
        <h2 className="text-lg font-bold text-gray-900">Jump to section</h2>

        <p className="mt-1 text-sm leading-5 text-gray-500">
          Choose a page, then select the section you want to edit.
        </p>

        <nav aria-label="Admin editor sections" className="mt-5 space-y-3">
          {editorGroups.map((group, groupIndex) => (
            <details
              key={group.id}
              className="group overflow-hidden rounded-lg border border-gray-200"
              open={groupIndex === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 bg-gray-50 px-4 py-3 font-semibold text-gray-900 transition hover:bg-blue-50 hover:text-blue-950 [&::-webkit-details-marker]:hidden">
                <span>{group.label}</span>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
                    {group.sections.length}
                  </span>

                  <ChevronIcon />
                </div>
              </summary>

              <div className="space-y-2 border-t border-gray-200 bg-white p-3">
                {group.sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block rounded-md border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-blue-700 hover:bg-blue-50 hover:text-blue-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                  >
                    {section.label}
                  </a>
                ))}
              </div>
            </details>
          ))}

          <a
            href="#admin-top"
            className="flex w-full items-center justify-center rounded-md bg-blue-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900"
          >
            Back to top
          </a>
        </nav>
      </div>
    </aside>
  );
}
