/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { db } from "~/server/db";

import { EventsCalendar, type CalendarEventDefinition } from "./EventsCalendar";

const reginaDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Regina",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const reginaTimeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Regina",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const reginaSortTimeFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Regina",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function getPart(
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes,
): string {
  return parts.find((part) => part.type === type)?.value ?? "";
}

function toReginaDateKey(date: Date): string {
  const parts = reginaDateFormatter.formatToParts(date);

  const year = getPart(parts, "year");
  const month = getPart(parts, "month");
  const day = getPart(parts, "day");

  return `${year}-${month}-${day}`;
}

function toReginaStartMinutes(date: Date): number {
  const parts = reginaSortTimeFormatter.formatToParts(date);

  const hour = Number(getPart(parts, "hour"));
  const minute = Number(getPart(parts, "minute"));

  return hour * 60 + minute;
}

export async function EventsCalendarSection() {
  const storedEvents = await db.churchEvent.findMany({
    where: {
      published: true,
    },
    orderBy: [
      {
        startsAt: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
  });

  const eventDefinitions: CalendarEventDefinition[] = storedEvents.map(
    (event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      location: event.location,

      startDate: toReginaDateKey(event.startsAt),

      timeLabel: reginaTimeFormatter
        .format(event.startsAt)
        .replace(/\u202f/g, " "),

      startMinutes: toReginaStartMinutes(event.startsAt),

      recurrence: event.recurrence as "NONE" | "WEEKLY",

      recurrenceEndDate: event.recurrenceEndsAt
        ? toReginaDateKey(event.recurrenceEndsAt)
        : null,
    }),
  );

  return (
    <EventsCalendar
      eventDefinitions={eventDefinitions}
      todayDateKey={toReginaDateKey(new Date())}
    />
  );
}
