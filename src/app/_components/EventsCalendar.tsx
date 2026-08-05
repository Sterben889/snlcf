"use client";

import { useMemo, useState } from "react";

export type CalendarEventDefinition = {
  id: string;
  title: string;
  description: string;
  location: string | null;

  /*
   * These values are passed as strings from the Server Component
   * so they remain serializable and timezone-safe.
   */
  startDate: string;
  timeLabel: string;
  startMinutes: number;

  recurrence: "NONE" | "WEEKLY";
  recurrenceEndDate: string | null;
};

type EventsCalendarProps = {
  eventDefinitions: CalendarEventDefinition[];
  todayDateKey: string;
};

type WeeklyEventOccurrence = {
  occurrenceId: string;
  dateKey: string;
  event: CalendarEventDefinition;
};

const millisecondsPerDay = 24 * 60 * 60 * 1000;

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function parseDateKey(dateKey: string): Date {
  const [yearText, monthText, dayText] = dateKey.split("-");

  return new Date(
    Date.UTC(Number(yearText), Number(monthText) - 1, Number(dayText)),
  );
}

function toDateKey(date: Date): string {
  const year = date.getUTCFullYear();

  const month = String(date.getUTCMonth() + 1).padStart(2, "0");

  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function addDays(dateKey: string, numberOfDays: number): string {
  const date = parseDateKey(dateKey);

  date.setUTCDate(date.getUTCDate() + numberOfDays);

  return toDateKey(date);
}

function getMonthStartDateKey(dateKey: string): string {
  const date = parseDateKey(dateKey);

  return toDateKey(
    new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1)),
  );
}

function getNumberOfDaysInMonth(monthDateKey: string): number {
  const monthDate = parseDateKey(monthDateKey);

  return new Date(
    Date.UTC(monthDate.getUTCFullYear(), monthDate.getUTCMonth() + 1, 0),
  ).getUTCDate();
}

function getWeekStartDateKey(dateKey: string): string {
  const date = parseDateKey(dateKey);

  /*
   * getUTCDay():
   * Sunday = 0
   * Monday = 1
   * ...
   * Saturday = 6
   */
  const dayOfWeek = date.getUTCDay();

  return addDays(dateKey, -dayOfWeek);
}

function getWeekEndDateKey(dateKey: string): string {
  return addDays(getWeekStartDateKey(dateKey), 6);
}

function eventOccursOnDate(
  event: CalendarEventDefinition,
  dateKey: string,
): boolean {
  const eventStart = parseDateKey(event.startDate);
  const candidateDate = parseDateKey(dateKey);

  const candidateTime = candidateDate.getTime();
  const startTime = eventStart.getTime();

  /*
   * An event cannot occur before its original start date.
   */
  if (candidateTime < startTime) {
    return false;
  }

  /*
   * Stop producing recurring occurrences after the optional
   * recurrence ending date.
   */
  if (event.recurrenceEndDate) {
    const recurrenceEnd = parseDateKey(event.recurrenceEndDate);

    if (candidateTime > recurrenceEnd.getTime()) {
      return false;
    }
  }

  /*
   * A one-time event occurs only on its exact date.
   */
  if (event.recurrence === "NONE") {
    return candidateTime === startTime;
  }

  /*
   * A weekly event occurs every seven days after its
   * original start date.
   */
  const differenceInDays = Math.round(
    (candidateTime - startTime) / millisecondsPerDay,
  );

  return differenceInDays % 7 === 0;
}

function getEventsForDate(
  eventDefinitions: CalendarEventDefinition[],
  dateKey: string,
): CalendarEventDefinition[] {
  return eventDefinitions
    .filter((event) => eventOccursOnDate(event, dateKey))
    .sort((first, second) => first.startMinutes - second.startMinutes);
}

function getEventsForWeek(
  eventDefinitions: CalendarEventDefinition[],
  selectedDateKey: string,
): WeeklyEventOccurrence[] {
  const weekStartDateKey = getWeekStartDateKey(selectedDateKey);

  const occurrences: WeeklyEventOccurrence[] = [];

  /*
   * Check each day from Sunday through Saturday.
   */
  for (let dayOffset = 0; dayOffset < 7; dayOffset += 1) {
    const dateKey = addDays(weekStartDateKey, dayOffset);

    const eventsForDate = getEventsForDate(eventDefinitions, dateKey);

    for (const event of eventsForDate) {
      occurrences.push({
        occurrenceId: `${event.id}-${dateKey}`,
        dateKey,
        event,
      });
    }
  }

  /*
   * Sort the week's occurrences first by date and then by
   * their scheduled time.
   */
  return occurrences.sort((first, second) => {
    const dateComparison = first.dateKey.localeCompare(second.dateKey);

    if (dateComparison !== 0) {
      return dateComparison;
    }

    return first.event.startMinutes - second.event.startMinutes;
  });
}

function findFirstEventDateInMonth(
  eventDefinitions: CalendarEventDefinition[],
  monthDateKey: string,
): string | null {
  const monthDate = parseDateKey(monthDateKey);

  const year = monthDate.getUTCFullYear();
  const month = monthDate.getUTCMonth();

  const numberOfDays = getNumberOfDaysInMonth(monthDateKey);

  for (let day = 1; day <= numberOfDays; day += 1) {
    const dateKey = toDateKey(new Date(Date.UTC(year, month, day)));

    if (getEventsForDate(eventDefinitions, dateKey).length > 0) {
      return dateKey;
    }
  }

  return null;
}

function formatMonthHeading(monthDateKey: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(parseDateKey(monthDateKey));
}

function formatSelectedDate(dateKey: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(parseDateKey(dateKey));
}

function formatEventDay(dateKey: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(parseDateKey(dateKey));
}

function formatWeekRange(dateKey: string): string {
  const weekStart = parseDateKey(getWeekStartDateKey(dateKey));

  const weekEnd = parseDateKey(getWeekEndDateKey(dateKey));

  /*
   * Include the year on both sides when the week crosses
   * into another calendar year.
   */
  if (weekStart.getUTCFullYear() !== weekEnd.getUTCFullYear()) {
    const fullFormatter = new Intl.DateTimeFormat("en-CA", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });

    return `${fullFormatter.format(
      weekStart,
    )} – ${fullFormatter.format(weekEnd)}`;
  }

  const startFormatter = new Intl.DateTimeFormat("en-CA", {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  const endFormatter = new Intl.DateTimeFormat("en-CA", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  return `${startFormatter.format(
    weekStart,
  )} – ${endFormatter.format(weekEnd)}`;
}

function PreviousIcon() {
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
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function NextIcon() {
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
      <path d="m9 18 6-6-6-6" />
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

export function EventsCalendar({
  eventDefinitions,
  todayDateKey,
}: EventsCalendarProps) {
  const initialMonth = getMonthStartDateKey(todayDateKey);

  const [visibleMonthDateKey, setVisibleMonthDateKey] = useState(initialMonth);

  const [selectedDateKey, setSelectedDateKey] = useState(todayDateKey);

  const calendarInformation = useMemo(() => {
    const visibleMonth = parseDateKey(visibleMonthDateKey);

    const year = visibleMonth.getUTCFullYear();
    const month = visibleMonth.getUTCMonth();

    const firstWeekday = visibleMonth.getUTCDay();

    const numberOfDays = getNumberOfDaysInMonth(visibleMonthDateKey);

    /*
     * Add enough cells to complete the last calendar row.
     */
    const totalCells = Math.ceil((firstWeekday + numberOfDays) / 7) * 7;

    const cells: Array<{
      dateKey: string | null;
      events: CalendarEventDefinition[];
    }> = [];

    for (let index = 0; index < totalCells; index += 1) {
      const dayNumber = index - firstWeekday + 1;

      if (dayNumber < 1 || dayNumber > numberOfDays) {
        cells.push({
          dateKey: null,
          events: [],
        });

        continue;
      }

      const dateKey = toDateKey(new Date(Date.UTC(year, month, dayNumber)));

      cells.push({
        dateKey,
        events: getEventsForDate(eventDefinitions, dateKey),
      });
    }

    return {
      cells,
      monthHeading: formatMonthHeading(visibleMonthDateKey),
    };
  }, [eventDefinitions, visibleMonthDateKey]);

  /*
   * The sidebar displays all events during the Sunday-to-Saturday
   * week containing the currently selected calendar date.
   */
  const weeklyEvents = useMemo(
    () => getEventsForWeek(eventDefinitions, selectedDateKey),
    [eventDefinitions, selectedDateKey],
  );

  function changeMonth(offset: number) {
    const currentMonth = parseDateKey(visibleMonthDateKey);

    const nextMonth = new Date(
      Date.UTC(
        currentMonth.getUTCFullYear(),
        currentMonth.getUTCMonth() + offset,
        1,
      ),
    );

    const nextMonthKey = toDateKey(nextMonth);

    setVisibleMonthDateKey(nextMonthKey);

    /*
     * Select the first event date in the newly displayed month.
     * When no events exist, select the first day of that month.
     */
    const firstEventDate = findFirstEventDateInMonth(
      eventDefinitions,
      nextMonthKey,
    );

    setSelectedDateKey(firstEventDate ?? nextMonthKey);
  }

  function returnToToday() {
    setVisibleMonthDateKey(getMonthStartDateKey(todayDateKey));

    setSelectedDateKey(todayDateKey);
  }

  return (
    <section className="bg-white px-4 py-16 text-blue-950 sm:px-6 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] lg:gap-12">
        {/* Calendar */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-3xl font-bold tracking-tight">
              {calendarInformation.monthHeading}
            </h2>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={returnToToday}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-blue-950 transition hover:bg-blue-50"
              >
                Today
              </button>

              <button
                type="button"
                onClick={() => changeMonth(-1)}
                aria-label="Show previous month"
                className="flex h-11 w-11 items-center justify-center rounded-md border border-gray-300 transition hover:border-blue-700 hover:bg-blue-50"
              >
                <PreviousIcon />
              </button>

              <button
                type="button"
                onClick={() => changeMonth(1)}
                aria-label="Show next month"
                className="flex h-11 w-11 items-center justify-center rounded-md border border-gray-300 transition hover:border-blue-700 hover:bg-blue-50"
              >
                <NextIcon />
              </button>
            </div>
          </div>

          <div className="mt-7 overflow-x-auto pb-2">
            <div className="min-w-[720px]">
              <div className="grid grid-cols-7 gap-2">
                {weekdays.map((weekday) => (
                  <div
                    key={weekday}
                    className="px-2 py-3 text-center text-sm font-bold text-gray-600"
                  >
                    {weekday}
                  </div>
                ))}

                {calendarInformation.cells.map((cell, index) => {
                  if (!cell.dateKey) {
                    return (
                      <div
                        key={`empty-${index}`}
                        aria-hidden="true"
                        className="min-h-[112px]"
                      />
                    );
                  }

                  const date = parseDateKey(cell.dateKey);

                  const isSelected = cell.dateKey === selectedDateKey;

                  const isToday = cell.dateKey === todayDateKey;

                  return (
                    <button
                      key={cell.dateKey}
                      type="button"
                      onClick={() => setSelectedDateKey(cell.dateKey!)}
                      aria-pressed={isSelected}
                      aria-label={`Select ${formatSelectedDate(cell.dateKey)}`}
                      className={`flex min-h-[112px] flex-col rounded-lg border p-3 text-left transition ${
                        isSelected
                          ? "border-blue-700 bg-blue-50 shadow-sm"
                          : "border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50/40"
                      }`}
                    >
                      <span
                        className={`flex h-7 min-w-7 items-center justify-center self-start rounded-full px-1 text-sm font-semibold ${
                          isToday ? "bg-blue-950 text-white" : "text-gray-950"
                        }`}
                      >
                        {date.getUTCDate()}
                      </span>

                      {cell.events.length > 0 && (
                        <div className="mt-auto flex items-center gap-1.5">
                          {cell.events.slice(0, 3).map((event) => (
                            <span
                              key={event.id}
                              title={event.title}
                              className="h-2 w-2 rounded-full bg-blue-700"
                            />
                          ))}

                          {cell.events.length > 3 && (
                            <span className="ml-1 text-xs font-semibold text-blue-800">
                              +{cell.events.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Selected-week details */}
        <aside className="lg:pt-1">
          <h2 className="text-2xl font-bold text-blue-950">Events This Week</h2>

          <p className="mt-2 text-sm font-medium text-gray-500">
            {formatWeekRange(selectedDateKey)}
          </p>

          {weeklyEvents.length > 0 ? (
            <div className="mt-6 space-y-5">
              {weeklyEvents.map(({ occurrenceId, dateKey, event }) => (
                <article
                  key={occurrenceId}
                  className="rounded-xl border border-l-4 border-gray-200 border-l-blue-700 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <p className="font-bold text-blue-800">
                      {formatEventDay(dateKey)}
                    </p>

                    {event.recurrence === "WEEKLY" && (
                      <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-bold tracking-wide text-blue-800 uppercase">
                        Weekly
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 text-xl font-bold text-gray-950">
                    {event.title}
                  </h3>

                  <div className="mt-4 flex items-center gap-3 text-gray-600">
                    <ClockIcon />

                    <span>{event.timeLabel}</span>
                  </div>

                  {event.location && (
                    <div className="mt-3 flex items-start gap-3 text-gray-600">
                      <div className="mt-0.5 shrink-0">
                        <LocationIcon />
                      </div>

                      <span>{event.location}</span>
                    </div>
                  )}

                  <p className="mt-5 leading-7 whitespace-pre-line text-slate-700">
                    {event.description}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 px-6 py-10 text-center">
              <p className="font-semibold text-gray-800">
                No events scheduled for this week.
              </p>

              <p className="mt-2 text-sm text-gray-600">
                Select a date in another week or browse a different month.
              </p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
