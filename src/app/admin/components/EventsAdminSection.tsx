/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { db } from "~/server/db";

import { deleteChurchEvent, saveChurchEvent } from "../actions";

function toReginaDateTimeLocal(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Regina",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}`;
}

function toReginaDateInput(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Regina",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

export async function EventsAdminSection() {
  const events = await db.churchEvent.findMany({
    orderBy: {
      startsAt: "asc",
    },
  });

  return (
    <>
      <div className="my-12 border-t border-gray-200" />

      <section>
        <div>
          <h2 className="text-2xl font-bold">Upcoming Events</h2>

          <p className="mt-2 text-gray-600">
            Add and manage the events displayed on the homepage.
          </p>
        </div>

        {/* Add a new event */}
        <form
          action={saveChurchEvent}
          className="mt-8 space-y-6 rounded-xl border border-gray-200 bg-gray-50 p-6"
        >
          <h3 className="text-xl font-bold">Add a new event</h3>

          <div>
            <label
              htmlFor="new-event-title"
              className="mb-2 block font-semibold"
            >
              Event title
            </label>

            <input
              id="new-event-title"
              name="title"
              type="text"
              required
              maxLength={150}
              placeholder="Fusion Service"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="new-event-description"
              className="mb-2 block font-semibold"
            >
              Description
            </label>

            <textarea
              id="new-event-description"
              name="description"
              required
              rows={4}
              maxLength={1500}
              placeholder="Join us for fellowship, games, and Bible study."
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="new-event-start"
                className="mb-2 block font-semibold"
              >
                First date and time
              </label>

              <input
                id="new-event-start"
                name="startsAt"
                type="datetime-local"
                required
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
              />

              <p className="mt-2 text-sm text-gray-500">
                For weekly events, enter the date and time of the first
                occurrence.
              </p>
            </div>

            <div>
              <label
                htmlFor="new-event-location"
                className="mb-2 block font-semibold"
              >
                Location
              </label>

              <input
                id="new-event-location"
                name="location"
                type="text"
                maxLength={250}
                placeholder="SNLCF Church"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
              />
            </div>
          </div>

          {/* Recurrence fields */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="new-event-recurrence"
                className="mb-2 block font-semibold"
              >
                Repeats
              </label>

              <select
                id="new-event-recurrence"
                name="recurrence"
                defaultValue="NONE"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
              >
                <option value="NONE">Does not repeat</option>

                <option value="WEEKLY">Every week</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="new-event-recurrence-end"
                className="mb-2 block font-semibold"
              >
                Recurrence ending date
              </label>

              <input
                id="new-event-recurrence-end"
                name="recurrenceEndsAt"
                type="date"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
              />

              <p className="mt-2 text-sm text-gray-500">
                Leave empty for an event that repeats indefinitely.
              </p>
            </div>
          </div>

          <label className="flex items-center gap-3">
            <input
              name="published"
              type="checkbox"
              defaultChecked
              className="h-4 w-4"
            />

            <span className="font-medium">Display this event publicly</span>
          </label>

          <button
            type="submit"
            className="rounded-md bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Add event
          </button>
        </form>

        {/* Existing events */}
        <div className="mt-10 space-y-8">
          <h3 className="text-xl font-bold">Existing events</h3>

          {events.length === 0 ? (
            <p className="rounded-lg bg-gray-100 p-6 text-gray-600">
              No events have been created yet.
            </p>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="rounded-xl border border-gray-200 p-6"
              >
                <form action={saveChurchEvent} className="space-y-6">
                  <input type="hidden" name="eventId" value={event.id} />

                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-bold">{event.title}</h4>

                      <p className="mt-1 text-sm text-gray-500">
                        {event.recurrence === "WEEKLY"
                          ? "Repeats every week"
                          : "One-time event"}
                      </p>
                    </div>

                    <span
                      className={
                        event.published
                          ? "rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800"
                          : "rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700"
                      }
                    >
                      {event.published ? "Published" : "Hidden"}
                    </span>
                  </div>

                  <div>
                    <label
                      htmlFor={`event-title-${event.id}`}
                      className="mb-2 block font-semibold"
                    >
                      Event title
                    </label>

                    <input
                      id={`event-title-${event.id}`}
                      name="title"
                      type="text"
                      required
                      maxLength={150}
                      defaultValue={event.title}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`event-description-${event.id}`}
                      className="mb-2 block font-semibold"
                    >
                      Description
                    </label>

                    <textarea
                      id={`event-description-${event.id}`}
                      name="description"
                      required
                      rows={4}
                      maxLength={1500}
                      defaultValue={event.description}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor={`event-start-${event.id}`}
                        className="mb-2 block font-semibold"
                      >
                        First date and time
                      </label>

                      <input
                        id={`event-start-${event.id}`}
                        name="startsAt"
                        type="datetime-local"
                        required
                        defaultValue={toReginaDateTimeLocal(event.startsAt)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                      />

                      <p className="mt-2 text-sm text-gray-500">
                        For weekly events, this determines the weekday and time.
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor={`event-location-${event.id}`}
                        className="mb-2 block font-semibold"
                      >
                        Location
                      </label>

                      <input
                        id={`event-location-${event.id}`}
                        name="location"
                        type="text"
                        maxLength={250}
                        defaultValue={event.location ?? ""}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    </div>
                  </div>

                  {/* Existing event recurrence fields */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor={`event-recurrence-${event.id}`}
                        className="mb-2 block font-semibold"
                      >
                        Repeats
                      </label>

                      <select
                        id={`event-recurrence-${event.id}`}
                        name="recurrence"
                        defaultValue={event.recurrence}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                      >
                        <option value="NONE">Does not repeat</option>

                        <option value="WEEKLY">Every week</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor={`event-recurrence-end-${event.id}`}
                        className="mb-2 block font-semibold"
                      >
                        Recurrence ending date
                      </label>

                      <input
                        id={`event-recurrence-end-${event.id}`}
                        name="recurrenceEndsAt"
                        type="date"
                        defaultValue={
                          event.recurrenceEndsAt
                            ? toReginaDateInput(event.recurrenceEndsAt)
                            : ""
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                      />

                      <p className="mt-2 text-sm text-gray-500">
                        Leave empty to repeat indefinitely.
                      </p>
                    </div>
                  </div>

                  <label className="flex items-center gap-3">
                    <input
                      name="published"
                      type="checkbox"
                      defaultChecked={event.published}
                      className="h-4 w-4"
                    />

                    <span className="font-medium">
                      Display this event publicly
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="rounded-md bg-blue-700 px-5 py-2 font-semibold text-white hover:bg-blue-800"
                  >
                    Save changes
                  </button>
                </form>

                {/* Separate delete form to avoid nested forms */}
                <form action={deleteChurchEvent} className="mt-4">
                  <input type="hidden" name="eventId" value={event.id} />

                  <button
                    type="submit"
                    className="rounded-md bg-red-700 px-5 py-2 font-semibold text-white hover:bg-red-800"
                  >
                    Delete event
                  </button>
                </form>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}
