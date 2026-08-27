"use client";

import { useState } from "react";

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

  {
    id: "gather-page-group",
    label: "Gather Page",
    sections: [
      {
        id: "gather-page-header-editor",
        label: "Page Header",
      },
      {
        id: "gather-ways-editor",
        label: "Ways to Gather",
      },
      {
        id: "gather-cta-editor",
        label: "Final Call to Action",
      },
    ],
  },

  {
    id: "serve-page-group",
    label: "Serve Page",
    sections: [
      {
        id: "serve-page-header-editor",
        label: "Page Header",
      },
      {
        id: "serve-intro-editor",
        label: "Introduction",
      },
      {
        id: "serve-ministries-editor",
        label: "Where You Can Serve",
      },
      {
        id: "serve-cta-editor",
        label: "Find Your Fit",
      },
    ],
  },

  {
    id: "give-page-group",
    label: "Give Page",
    sections: [
      {
        id: "give-page-header-editor",
        label: "Page Header",
      },
      {
        id: "give-scripture-editor",
        label: "Scripture",
      },
      {
        id: "give-ways-editor",
        label: "Ways of Giving",
      },
      {
        id: "give-thank-you-editor",
        label: "Thank You",
      },
    ],
  },
] as const;

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`h-5 w-5 shrink-0 transition-transform duration-200 ${
        open ? "rotate-90" : ""
      }`}
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
  /*
   * Homepage starts open.
   *
   * Set this to null instead if you want every category
   * closed when the admin page first loads.
   */
  const [openGroupId, setOpenGroupId] = useState<string | null>(
    "homepage-group",
  );

  function toggleGroup(groupId: string) {
    setOpenGroupId((currentGroupId) =>
      currentGroupId === groupId ? null : groupId,
    );
  }

  return (
    <aside className="lg:sticky lg:top-6 lg:self-start">
      {/*
       * max-height + overflow-y-auto gives the navigation
       * its own scrollbar.
       */}
      <div className="max-h-[70vh] overflow-y-auto overscroll-contain rounded-xl bg-white p-4 shadow lg:max-h-[calc(100vh-3rem)]">
        <div className="sticky top-0 z-10 -mx-1 bg-white px-1 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Jump to section
              </h2>

              <p className="mt-1 text-sm leading-5 text-gray-500">
                Choose a page, then select the section you want to edit.
              </p>
            </div>

            {openGroupId && (
              <button
                type="button"
                onClick={() => setOpenGroupId(null)}
                className="shrink-0 rounded-md px-2 py-1 text-xs font-semibold text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              >
                Collapse
              </button>
            )}
          </div>
        </div>

        <nav aria-label="Admin editor sections" className="space-y-3">
          {editorGroups.map((group) => {
            const isOpen = openGroupId === group.id;

            return (
              <div
                key={group.id}
                className="overflow-hidden rounded-lg border border-gray-200"
              >
                {/* Category button */}
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  aria-expanded={isOpen}
                  aria-controls={`${group.id}-sections`}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left font-semibold transition ${
                    isOpen
                      ? "bg-blue-50 text-blue-950"
                      : "bg-gray-50 text-gray-900 hover:bg-blue-50 hover:text-blue-950"
                  }`}
                >
                  <span>{group.label}</span>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
                      {group.sections.length}
                    </span>

                    <ChevronIcon open={isOpen} />
                  </div>
                </button>

                {/* Sections */}
                {isOpen && (
                  <div
                    id={`${group.id}-sections`}
                    className="space-y-2 border-t border-gray-200 bg-white p-3"
                  >
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
                )}
              </div>
            );
          })}

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
