/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { db } from "~/server/db";

import {
  deleteLeadershipMember,
  saveLeadershipMember,
} from "~/app/admin/actions";

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export async function LeadershipTeamAdminSection() {
  const members = await db.leadershipMember.findMany({
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
  });

  const nextSortOrder =
    members.length > 0
      ? Math.max(...members.map((member) => member.sortOrder)) + 1
      : 1;

  const publishedMembers = members.filter((member) => member.published);

  return (
    <>
      <div className="my-12 border-t border-gray-200" />

      <section id="leadership-team-editor" className="scroll-mt-6">
        <div>
          <h2 className="text-2xl font-bold">About Page — Leadership Team</h2>

          <p className="mt-2 text-gray-600">
            Add, edit, arrange, publish, or remove church leaders shown on the
            About Us page.
          </p>
        </div>

        {/* Public section preview */}
        <div className="mt-8 rounded-xl bg-gray-50 p-5 sm:p-8">
          <h3 className="text-center text-3xl font-bold text-blue-950">
            Leadership Team
          </h3>

          {publishedMembers.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {publishedMembers.map((member) => (
                <article
                  key={member.id}
                  className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm"
                >
                  {member.imageUrl ? (
                    <div
                      role="img"
                      aria-label={`${member.name} profile picture`}
                      className="mx-auto h-24 w-24 rounded-full bg-gray-200 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${JSON.stringify(
                          member.imageUrl,
                        )})`,
                      }}
                    />
                  ) : (
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-900 text-2xl font-bold text-white">
                      {getInitials(member.name)}
                    </div>
                  )}

                  <h4 className="mt-5 text-xl font-bold">{member.name}</h4>

                  <p className="mt-1 font-semibold text-blue-700">
                    {member.role}
                  </p>

                  <p className="mt-5 line-clamp-4 leading-7 whitespace-pre-line text-slate-700">
                    {member.bio}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-8 rounded-lg bg-white p-6 text-center text-gray-600">
              No published leadership members are available.
            </p>
          )}
        </div>

        {/* Add new member */}
        <form
          action={saveLeadershipMember}
          className="mt-10 space-y-6 rounded-xl border border-gray-200 bg-gray-50 p-6"
        >
          <div>
            <h3 className="text-xl font-bold">Add a leadership member</h3>

            <p className="mt-1 text-sm text-gray-500">
              Create a new card for the Leadership Team section.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="new-leader-name"
                className="mb-2 block font-semibold"
              >
                Name
              </label>

              <input
                id="new-leader-name"
                name="name"
                type="text"
                required
                maxLength={150}
                placeholder="Pastor John Smith"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="new-leader-role"
                className="mb-2 block font-semibold"
              >
                Role
              </label>

              <input
                id="new-leader-role"
                name="role"
                type="text"
                required
                maxLength={150}
                placeholder="Senior Pastor"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="new-leader-bio"
              className="mb-2 block font-semibold"
            >
              Biography
            </label>

            <textarea
              id="new-leader-bio"
              name="bio"
              required
              rows={5}
              maxLength={2500}
              placeholder="Write a brief introduction and description of this leader's ministry."
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="new-leader-email"
                className="mb-2 block font-semibold"
              >
                Email
              </label>

              <input
                id="new-leader-email"
                name="email"
                type="email"
                maxLength={254}
                placeholder="pastor@example.com"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="new-leader-phone"
                className="mb-2 block font-semibold"
              >
                Phone
              </label>

              <input
                id="new-leader-phone"
                name="phone"
                type="tel"
                maxLength={50}
                placeholder="(306) 683-1950"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="new-leader-image"
                className="mb-2 block font-semibold"
              >
                Profile picture
              </label>

              <input
                id="new-leader-image"
                name="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
              />

              <p className="mt-2 text-sm text-gray-500">
                Optional. Initials will be displayed when no picture is
                uploaded.
              </p>
            </div>

            <div>
              <label
                htmlFor="new-leader-order"
                className="mb-2 block font-semibold"
              >
                Display order
              </label>

              <input
                id="new-leader-order"
                name="sortOrder"
                type="number"
                min={0}
                max={9999}
                required
                defaultValue={nextSortOrder}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
              />

              <p className="mt-2 text-sm text-gray-500">
                Lower numbers appear first.
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

            <span className="font-medium">Display this person publicly</span>
          </label>

          <button
            type="submit"
            className="rounded-md bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Add leadership member
          </button>
        </form>

        {/* Existing members */}
        <div className="mt-12">
          <h3 className="text-xl font-bold">Existing leadership members</h3>

          <p className="mt-1 text-sm text-gray-500">
            Edit an existing member or remove the member completely.
          </p>

          {members.length === 0 ? (
            <p className="mt-6 rounded-lg bg-gray-100 p-6 text-gray-600">
              No leadership members have been created yet.
            </p>
          ) : (
            <div className="mt-6 space-y-8">
              {members.map((member) => (
                <article
                  key={member.id}
                  className="rounded-xl border border-gray-200 p-6"
                >
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {member.imageUrl ? (
                        <div
                          role="img"
                          aria-label={`${member.name} profile picture`}
                          className="h-16 w-16 shrink-0 rounded-full bg-gray-200 bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${JSON.stringify(
                              member.imageUrl,
                            )})`,
                          }}
                        />
                      ) : (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-900 font-bold text-white">
                          {getInitials(member.name)}
                        </div>
                      )}

                      <div>
                        <h4 className="text-lg font-bold">{member.name}</h4>

                        <p className="text-sm text-gray-500">
                          {member.role} · Order {member.sortOrder}
                        </p>
                      </div>
                    </div>

                    <span
                      className={
                        member.published
                          ? "rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800"
                          : "rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700"
                      }
                    >
                      {member.published ? "Published" : "Hidden"}
                    </span>
                  </div>

                  <form action={saveLeadershipMember} className="space-y-6">
                    <input type="hidden" name="memberId" value={member.id} />

                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor={`leader-name-${member.id}`}
                          className="mb-2 block font-semibold"
                        >
                          Name
                        </label>

                        <input
                          id={`leader-name-${member.id}`}
                          name="name"
                          type="text"
                          required
                          maxLength={150}
                          defaultValue={member.name}
                          className="w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`leader-role-${member.id}`}
                          className="mb-2 block font-semibold"
                        >
                          Role
                        </label>

                        <input
                          id={`leader-role-${member.id}`}
                          name="role"
                          type="text"
                          required
                          maxLength={150}
                          defaultValue={member.role}
                          className="w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor={`leader-bio-${member.id}`}
                        className="mb-2 block font-semibold"
                      >
                        Biography
                      </label>

                      <textarea
                        id={`leader-bio-${member.id}`}
                        name="bio"
                        required
                        rows={5}
                        maxLength={2500}
                        defaultValue={member.bio}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor={`leader-email-${member.id}`}
                          className="mb-2 block font-semibold"
                        >
                          Email
                        </label>

                        <input
                          id={`leader-email-${member.id}`}
                          name="email"
                          type="email"
                          maxLength={254}
                          defaultValue={member.email ?? ""}
                          className="w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`leader-phone-${member.id}`}
                          className="mb-2 block font-semibold"
                        >
                          Phone
                        </label>

                        <input
                          id={`leader-phone-${member.id}`}
                          name="phone"
                          type="tel"
                          maxLength={50}
                          defaultValue={member.phone ?? ""}
                          className="w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor={`leader-image-${member.id}`}
                          className="mb-2 block font-semibold"
                        >
                          Replace profile picture
                        </label>

                        <input
                          id={`leader-image-${member.id}`}
                          name="image"
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="block w-full rounded-md border border-gray-300 px-3 py-2"
                        />

                        {member.imageUrl && (
                          <label className="mt-3 flex items-center gap-3">
                            <input
                              name="removeImage"
                              type="checkbox"
                              className="h-4 w-4"
                            />

                            <span className="text-sm font-medium">
                              Remove the current picture
                            </span>
                          </label>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor={`leader-order-${member.id}`}
                          className="mb-2 block font-semibold"
                        >
                          Display order
                        </label>

                        <input
                          id={`leader-order-${member.id}`}
                          name="sortOrder"
                          type="number"
                          min={0}
                          max={9999}
                          required
                          defaultValue={member.sortOrder}
                          className="w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-3">
                      <input
                        name="published"
                        type="checkbox"
                        defaultChecked={member.published}
                        className="h-4 w-4"
                      />

                      <span className="font-medium">
                        Display this person publicly
                      </span>
                    </label>

                    <button
                      type="submit"
                      className="rounded-md bg-blue-700 px-5 py-2 font-semibold text-white hover:bg-blue-800"
                    >
                      Save changes
                    </button>
                  </form>

                  <form action={deleteLeadershipMember} className="mt-4">
                    <input type="hidden" name="memberId" value={member.id} />

                    <button
                      type="submit"
                      className="rounded-md bg-red-700 px-5 py-2 font-semibold text-white hover:bg-red-800"
                    >
                      Delete leadership member
                    </button>
                  </form>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
