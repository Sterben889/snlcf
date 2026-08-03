/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { ChurchEvent } from "@prisma/client";
import Link from "next/link";

import { db } from "~/server/db";

const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;

type EventOccurrence = {
  occurrenceId: string;
  eventId: string;
  title: string;
  description: string;
  location: string | null;
  startsAt: Date;
};

function CalendarIcon() {
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
      <path d="M7 2v3" />
      <path d="M17 2v3" />
      <path d="M3 9h18" />
      <rect x="3" y="5" width="18" height="16" rx="2" />
    </svg>
  );
}

function ClockIcon() {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

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

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  month: "2-digit",
  day: "2-digit",
  year: "numeric",
  timeZone: "America/Regina",
});

const timeFormatter = new Intl.DateTimeFormat("en-CA", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "America/Regina",
});

/**
 * Converts one stored event into its upcoming occurrence or occurrences.
 *
 * A one-time event produces either zero or one occurrence.
 * A weekly event produces up to three upcoming occurrences.
 */
function getUpcomingOccurrences(
  event: ChurchEvent,
  now: Date,
): EventOccurrence[] {
  if (event.recurrence === "NONE") {
    if (event.startsAt.getTime() < now.getTime()) {
      return [];
    }

    return [
      {
        occurrenceId: `${event.id}-${event.startsAt.toISOString()}`,
        eventId: event.id,
        title: event.title,
        description: event.description,
        location: event.location,
        startsAt: event.startsAt,
      },
    ];
  }

  /*
   * A weekly event starts from its original startsAt value.
   * If that date is in the past, move forward by full weeks until
   * we reach the next occurrence.
   */
  let nextOccurrence = new Date(event.startsAt);

  if (nextOccurrence.getTime() < now.getTime()) {
    const elapsedMilliseconds = now.getTime() - nextOccurrence.getTime();

    const completedWeeks = Math.floor(
      elapsedMilliseconds / oneWeekInMilliseconds,
    );

    nextOccurrence = new Date(
      nextOccurrence.getTime() + completedWeeks * oneWeekInMilliseconds,
    );

    if (nextOccurrence.getTime() < now.getTime()) {
      nextOccurrence = new Date(
        nextOccurrence.getTime() + oneWeekInMilliseconds,
      );
    }
  }

  const occurrences: EventOccurrence[] = [];

  /*
   * Generate at most three occurrences for each weekly event.
   * The homepage later sorts all occurrences and displays the
   * next three overall.
   */
  for (let index = 0; index < 3; index += 1) {
    if (
      event.recurrenceEndsAt &&
      nextOccurrence.getTime() > event.recurrenceEndsAt.getTime()
    ) {
      break;
    }

    occurrences.push({
      occurrenceId: `${event.id}-${nextOccurrence.toISOString()}`,
      eventId: event.id,
      title: event.title,
      description: event.description,
      location: event.location,
      startsAt: new Date(nextOccurrence),
    });

    nextOccurrence = new Date(nextOccurrence.getTime() + oneWeekInMilliseconds);
  }

  return occurrences;
}

export async function UpcomingEventsSection() {
  const now = new Date();

  /*
   * Retrieve the stored event definitions.
   *
   * A weekly event may have a startsAt date in the past, so we cannot
   * filter every record using startsAt >= now in the database query.
   */
  const storedEvents = await db.churchEvent.findMany({
    where: {
      published: true,
    },
    orderBy: {
      startsAt: "asc",
    },
  });

  /*
   * Expand recurring event definitions into individual upcoming dates,
   * sort all occurrences together, and display only the next three.
   */
  const events = storedEvents
    .flatMap((event) => getUpcomingOccurrences(event, now))
    .sort(
      (first, second) => first.startsAt.getTime() - second.startsAt.getTime(),
    )
    .slice(0, 3);

  return (
    <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-4xl font-medium text-blue-950 sm:text-5xl">
            Upcoming Events
          </h2>

          <p className="mt-3 text-xl text-gray-700 sm:text-2xl">
            Join us in our upcoming events
          </p>
        </div>

        {events.length > 0 ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <article
                key={event.occurrenceId}
                className="rounded-xl border border-l-4 border-gray-200 border-l-blue-950 bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <h3 className="text-2xl font-medium text-gray-950">
                  {event.title}
                </h3>

                <div className="mt-4 flex items-center gap-3 text-purple-600">
                  <CalendarIcon />

                  <time dateTime={event.startsAt.toISOString()}>
                    {dateFormatter.format(event.startsAt)}
                  </time>
                </div>

                <div className="mt-5 flex items-center gap-3 text-gray-500">
                  <ClockIcon />

                  <span>
                    {timeFormatter.format(event.startsAt).toLowerCase()}
                  </span>
                </div>

                {event.location && (
                  <div className="mt-4 flex items-start gap-3 text-gray-600">
                    <div className="mt-0.5 shrink-0">
                      <LocationIcon />
                    </div>

                    <p>{event.location}</p>
                  </div>
                )}

                <p className="mt-5 text-lg leading-relaxed whitespace-pre-line text-gray-800">
                  {event.description}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
            <p className="text-xl font-medium text-gray-800">
              No upcoming events have been announced yet.
            </p>

            <p className="mt-2 text-gray-600">Please check back again soon.</p>
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <Link
            href="/"
            className="inline-flex min-w-60 items-center justify-center rounded-full bg-blue-950 px-8 py-4 text-lg font-bold tracking-wide text-white shadow-md transition duration-200 hover:-translate-y-0.5 hover:bg-blue-900"
          >
            All Events
          </Link>
        </div>
      </div>
    </section>
  );
}
