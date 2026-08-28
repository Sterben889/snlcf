/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { db } from "~/server/db";

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
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
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

function getPhoneHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export async function LeadershipTeamSection() {
  const members = await db.leadershipMember.findMany({
    where: {
      published: true,
    },
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
  });

  return (
    <section className="bg-gray-50 px-4 py-16 text-blue-950 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Our Staff
        </h2>

        {members.length > 0 ? (
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {members.map((member) => (
              <article
                key={member.id}
                className="flex flex-col rounded-xl border border-gray-200 bg-white p-7 text-center shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg sm:p-8"
              >
                {member.imageUrl ? (
                  <div
                    role="img"
                    aria-label={`${member.name} profile picture`}
                    className="mx-auto h-32 w-32 rounded-full bg-gray-200 bg-cover bg-center shadow-sm"
                    style={{
                      backgroundImage: `url(${JSON.stringify(
                        member.imageUrl,
                      )})`,
                    }}
                  />
                ) : (
                  <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-blue-900 text-3xl font-bold text-white shadow-sm">
                    {getInitials(member.name)}
                  </div>
                )}

                <h3 className="mt-7 text-2xl font-bold text-gray-950">
                  {member.name}
                </h3>

                <p className="mt-2 font-semibold text-blue-700">
                  {member.role}
                </p>

                <p className="mt-7 text-lg leading-8 whitespace-pre-line text-slate-700">
                  {member.bio}
                </p>

                {(member.email ?? member.phone) && (
                  <div className="mt-auto pt-7">
                    <div className="border-t border-gray-200 pt-6">
                      <div className="flex flex-col items-center gap-3 text-slate-600">
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="inline-flex items-center gap-3 transition hover:text-blue-700"
                          >
                            <MailIcon />

                            <span className="break-all">{member.email}</span>
                          </a>
                        )}

                        {member.phone && (
                          <a
                            href={getPhoneHref(member.phone)}
                            className="inline-flex items-center gap-3 transition hover:text-blue-700"
                          >
                            <PhoneIcon />

                            <span>{member.phone}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
            <p className="text-lg text-gray-600">
              Leadership information will be added soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
