type NextStepCard = {
  eyebrow: string;
  title: string;
  body: string;
  contact: string;
  email: string;
  phone: string;
  icon: "community" | "cross" | "missions";
};

type DiscipleshipNextStepsSectionProps = {
  eyebrow: string;
  title: string;
  cards: NextStepCard[];
};

function CommunityIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6Z" />
    </svg>
  );
}

function MissionsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3.5 9h17" />
      <path d="M3.5 15h17" />
      <path d="M12 3a15 15 0 0 1 0 18" />
      <path d="M12 3a15 15 0 0 0 0 18" />
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16v16H4Z" />
      <path d="m4 6 8 6 8-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function CardIcon({ icon }: { icon: NextStepCard["icon"] }) {
  if (icon === "cross") {
    return <CrossIcon />;
  }

  if (icon === "missions") {
    return <MissionsIcon />;
  }

  return <CommunityIcon />;
}

export function DiscipleshipNextStepsSection({
  eyebrow,
  title,
  cards,
}: DiscipleshipNextStepsSectionProps) {
  return (
    <section className="bg-gray-50 px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="text-sm font-bold tracking-[0.3em] text-blue-700">
            {eyebrow}
          </p>

          <h2 className="mt-4 max-w-3xl text-5xl leading-tight font-bold tracking-tight text-blue-950 sm:text-6xl">
            {title}
          </h2>
        </div>

        <div className="mt-12 grid gap-7 lg:grid-cols-3">
          {cards.map((card, index) => (
            <article
              key={index}
              className="flex min-h-125 flex-col rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg sm:p-8"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <CardIcon icon={card.icon} />
              </div>

              <p className="mt-7 text-sm font-bold tracking-wide text-blue-700 uppercase">
                {card.eyebrow}
              </p>

              <h3 className="mt-3 text-3xl font-bold text-blue-950">
                {card.title}
              </h3>

              <div className="mt-6 text-lg leading-8 whitespace-pre-line text-slate-600">
                {card.body}
              </div>

              {/* Contact information */}
              <div className="mt-auto border-t border-gray-100 pt-7">
                <p className="font-bold text-gray-950">{card.contact}</p>

                <div className="mt-3 space-y-2">
                  <a
                    href={`mailto:${card.email}`}
                    className="flex items-center gap-2 text-sm font-semibold text-blue-700 transition hover:text-blue-950 hover:underline"
                  >
                    <ContactIcon />
                    {card.email}
                  </a>

                  <a
                    href={`tel:${card.phone.replace(/[^+\d]/g, "")}`}
                    className="flex items-center gap-2 text-sm font-semibold text-blue-700 transition hover:text-blue-950 hover:underline"
                  >
                    <PhoneIcon />
                    {card.phone}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
