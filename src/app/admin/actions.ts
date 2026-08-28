/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use server";

import { del, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { env } from "~/env";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { defaultSiteContent } from "~/server/site-content";

const homepageSchema = z.object({
  heroTitle: z
    .string()
    .trim()
    .min(1, "The title is required.")
    .max(120, "The title is too long."),

  heroSubtitle: z
    .string()
    .trim()
    .min(1, "The subtitle is required.")
    .max(200, "The subtitle is too long."),
});

const descSectionSchema = z.object({
  descTitle: z
    .string()
    .trim()
    .min(1, "The section title is required.")
    .max(120, "The section title is too long."),

  descBody: z
    .string()
    .trim()
    .min(1, "The description is required.")
    .max(2500, "The description is too long."),

  descTime: z.string().trim().min(1, "The service time is required.").max(100),

  descLocation: z
    .string()
    .trim()
    .min(1, "The service location is required.")
    .max(250),

  descButtonText: z
    .string()
    .trim()
    .min(1, "The button text is required.")
    .max(50),

  descButtonUrl: z
    .string()
    .trim()
    .min(1, "The button destination is required.")
    .max(500)
    .refine(
      (value) =>
        value === "#" ||
        value.startsWith("/") ||
        value.startsWith("https://") ||
        value.startsWith("http://"),
      "Use a site path such as /about or a complete web address.",
    ),
});

const missionSectionSchema = z.object({
  missionTitle: z
    .string()
    .trim()
    .min(1, "The mission title is required.")
    .max(250, "The mission title is too long."),

  missionTransformation: z
    .string()
    .trim()
    .min(1, "The transformation message is required.")
    .max(1000, "The transformation message is too long."),

  missionDisciplesTitle: z
    .string()
    .trim()
    .min(1, "The disciples title is required.")
    .max(150),

  missionDisciplesSubtitle: z
    .string()
    .trim()
    .min(1, "The disciples subtitle is required.")
    .max(150),

  missionStatement: z
    .string()
    .trim()
    .min(1, "The mission statement is required.")
    .max(1500, "The mission statement is too long."),
});

const churchEventSchema = z.object({
  eventId: z.string().trim().optional(),

  title: z
    .string()
    .trim()
    .min(1, "The event title is required.")
    .max(150, "The event title is too long."),

  description: z
    .string()
    .trim()
    .min(1, "The event description is required.")
    .max(1500, "The event description is too long."),

  location: z.string().trim().max(250, "The location is too long.").optional(),

  startsAt: z.string().trim().min(1, "The event date and time are required."),

  recurrence: z.enum(["NONE", "WEEKLY"]),

  recurrenceEndsAt: z.string().trim().optional(),
});

const aboutHeroSchema = z.object({
  aboutHeroTitle: z
    .string()
    .trim()
    .min(1, "The About page title is required.")
    .max(120, "The About page title is too long."),

  aboutHeroSubtitle: z
    .string()
    .trim()
    .min(1, "The About page subtitle is required.")
    .max(500, "The About page subtitle is too long."),
});

const aboutWhoSchema = z.object({
  aboutWhoTitle: z
    .string()
    .trim()
    .min(1, "The section title is required.")
    .max(120, "The section title is too long."),

  aboutWhoParagraph1: z
    .string()
    .trim()
    .min(1, "The first paragraph is required.")
    .max(2000, "The first paragraph is too long."),

  aboutWhoParagraph2: z
    .string()
    .trim()
    .min(1, "The second paragraph is required.")
    .max(2000, "The second paragraph is too long."),

  aboutWhoParagraph3: z
    .string()
    .trim()
    .min(1, "The third paragraph is required.")
    .max(2000, "The third paragraph is too long."),
});

const aboutMissionSchema = z.object({
  aboutMissionTitle: z
    .string()
    .trim()
    .min(1, "The section title is required.")
    .max(150, "The section title is too long."),

  missionStatement: z
    .string()
    .trim()
    .min(1, "The mission statement is required.")
    .max(1500, "The mission statement is too long."),
});

const aboutVisionSchema = z.object({
  aboutVisionTitle: z
    .string()
    .trim()
    .min(1, "The section title is required.")
    .max(150, "The section title is too long."),

  missionTitle: z
    .string()
    .trim()
    .min(1, "The vision prayer heading is required.")
    .max(250, "The vision prayer heading is too long."),

  missionTransformation: z
    .string()
    .trim()
    .min(1, "The transformation message is required.")
    .max(1000, "The transformation message is too long."),

  missionDisciplesTitle: z
    .string()
    .trim()
    .min(1, "The disciples heading is required.")
    .max(150),

  missionDisciplesSubtitle: z
    .string()
    .trim()
    .min(1, "The disciples subtitle is required.")
    .max(150),
});

const statementOfFaithSchema = z.object({
  itemId: z.string().trim().optional(),

  title: z
    .string()
    .trim()
    .min(1, "The concept title is required.")
    .max(150, "The concept title is too long."),

  description: z
    .string()
    .trim()
    .min(1, "The concept description is required.")
    .max(2500, "The concept description is too long."),

  sortOrder: z.coerce
    .number()
    .int("The display order must be a whole number.")
    .min(0, "The display order cannot be negative.")
    .max(9999),
});

const leadershipMemberSchema = z.object({
  memberId: z.string().trim().optional(),

  name: z
    .string()
    .trim()
    .min(1, "The leader's name is required.")
    .max(150, "The leader's name is too long."),

  role: z
    .string()
    .trim()
    .min(1, "The leadership role is required.")
    .max(150, "The leadership role is too long."),

  bio: z
    .string()
    .trim()
    .min(1, "The biography is required.")
    .max(2500, "The biography is too long."),

  email: z
    .string()
    .trim()
    .max(254, "The email address is too long.")
    .refine(
      (value) =>
        value.length === 0 || z.string().email().safeParse(value).success,
      "Enter a valid email address.",
    ),

  phone: z.string().trim().max(50, "The phone number is too long."),

  sortOrder: z.coerce
    .number()
    .int("The display order must be a whole number.")
    .min(0, "The display order cannot be negative.")
    .max(9999),
});

const aboutCtaSchema = z.object({
  aboutCtaTitle: z
    .string()
    .trim()
    .min(1, "The CTA title is required.")
    .max(150),

  aboutCtaBody: z
    .string()
    .trim()
    .min(1, "The CTA message is required.")
    .max(1000),

  aboutCtaVisitText: z
    .string()
    .trim()
    .min(1, "The visit button text is required.")
    .max(100),

  aboutCtaVisitUrl: z.string().trim().url("Enter a valid map URL.").max(1000),

  aboutCtaEventsText: z
    .string()
    .trim()
    .min(1, "The events button text is required.")
    .max(100),

  aboutCtaEventsUrl: z
    .string()
    .trim()
    .min(1, "The events page destination is required.")
    .max(500)
    .refine(
      (value) =>
        value.startsWith("/") ||
        value.startsWith("https://") ||
        value.startsWith("http://"),
      "Use a site path such as /events or a complete URL.",
    ),
});

const eventsHeroSchema = z.object({
  eventsHeroTitle: z
    .string()
    .trim()
    .min(1, "The Events page title is required.")
    .max(150, "The Events page title is too long."),

  eventsHeroSubtitle: z
    .string()
    .trim()
    .min(1, "The Events page subtitle is required.")
    .max(500, "The Events page subtitle is too long."),
});

const giveHeroSchema = z.object({
  giveHeroTitle: z
    .string()
    .trim()
    .min(1, "The Give page title is required.")
    .max(150, "The Give page title is too long."),

  giveHeroSubtitle: z
    .string()
    .trim()
    .min(1, "The Give page subtitle is required.")
    .max(500, "The Give page subtitle is too long."),
});

const giveScriptureSchema = z.object({
  giveVerseReference: z
    .string()
    .trim()
    .min(1, "The Scripture reference is required.")
    .max(100, "The Scripture reference is too long."),

  giveVerseText: z
    .string()
    .trim()
    .min(1, "The Scripture text is required.")
    .max(3000, "The Scripture text is too long."),
});

const givingMethodSchema = z.object({
  methodId: z.string().trim().optional(),

  title: z
    .string()
    .trim()
    .min(1, "The giving method title is required.")
    .max(150),

  description: z
    .string()
    .trim()
    .min(1, "The description is required.")
    .max(1500),

  detail: z
    .string()
    .trim()
    .min(1, "The giving information is required.")
    .max(500),

  href: z.string().trim().max(1000).optional(),

  icon: z.enum(["EMAIL", "MAIL", "CHURCH"]),

  sortOrder: z.coerce.number().int().min(0).max(9999),
});

const giveWaysTitleSchema = z.object({
  giveWaysTitle: z
    .string()
    .trim()
    .min(1, "The section title is required.")
    .max(150),
});

const giveThankYouSchema = z.object({
  giveThanksTitle: z
    .string()
    .trim()
    .min(1, "The section title is required.")
    .max(150, "The section title is too long."),

  giveThanksBody: z
    .string()
    .trim()
    .min(1, "The thank-you message is required.")
    .max(1500, "The thank-you message is too long."),
});

const gatherHeroSchema = z.object({
  gatherHeroTitle: z
    .string()
    .trim()
    .min(1, "The Gather page title is required.")
    .max(150, "The Gather page title is too long."),

  gatherHeroSubtitle: z
    .string()
    .trim()
    .min(1, "The Gather page subtitle is required.")
    .max(500, "The Gather page subtitle is too long."),
});

const gatherGroupSchema = z.object({
  groupId: z.string().trim().optional(),

  title: z.string().trim().min(1, "The gathering title is required.").max(150),

  schedule: z
    .string()
    .trim()
    .min(1, "The gathering schedule is required.")
    .max(200),

  location: z
    .string()
    .trim()
    .min(1, "The gathering location is required.")
    .max(250),

  description: z
    .string()
    .trim()
    .min(1, "The gathering description is required.")
    .max(3000),

  sortOrder: z.coerce.number().int().min(0).max(9999),
});

const gatherWaysTitleSchema = z.object({
  gatherWaysTitle: z
    .string()
    .trim()
    .min(1, "The section title is required.")
    .max(150),
});

const gatherCtaSchema = z.object({
  gatherCtaTitle: z
    .string()
    .trim()
    .min(1, "The CTA title is required.")
    .max(150, "The CTA title is too long."),

  gatherCtaBody: z
    .string()
    .trim()
    .min(1, "The CTA message is required.")
    .max(1500, "The CTA message is too long."),

  gatherCtaEventsText: z
    .string()
    .trim()
    .min(1, "The Events button text is required.")
    .max(100),

  gatherCtaAboutText: z
    .string()
    .trim()
    .min(1, "The About button text is required.")
    .max(100),
});

const serveHeroSchema = z.object({
  serveHeroTitle: z
    .string()
    .trim()
    .min(1, "The Serve page title is required.")
    .max(150, "The Serve page title is too long."),

  serveHeroSubtitle: z
    .string()
    .trim()
    .min(1, "The Serve page subtitle is required.")
    .max(500, "The Serve page subtitle is too long."),
});

const serveIntroSchema = z.object({
  serveIntroTitle: z
    .string()
    .trim()
    .min(1, "The section title is required.")
    .max(150, "The section title is too long."),

  serveIntroBody: z
    .string()
    .trim()
    .min(1, "The section message is required.")
    .max(2000, "The section message is too long."),
});

const serveMinistrySchema = z.object({
  ministryId: z.string().trim().optional(),

  title: z
    .string()
    .trim()
    .min(1, "The ministry name is required.")
    .max(150, "The ministry name is too long."),

  description: z
    .string()
    .trim()
    .min(1, "The ministry description is required.")
    .max(3000, "The ministry description is too long."),

  sortOrder: z.coerce
    .number()
    .int("Display order must be a whole number.")
    .min(0)
    .max(9999),
});

const serveMinistriesTitleSchema = z.object({
  serveMinistriesTitle: z
    .string()
    .trim()
    .min(1, "The section title is required.")
    .max(150),
});

const serveCtaSchema = z.object({
  serveCtaEyebrow: z
    .string()
    .trim()
    .min(1, "The small heading is required.")
    .max(100),

  serveCtaTitle: z
    .string()
    .trim()
    .min(1, "The section title is required.")
    .max(150),

  serveCtaBody: z
    .string()
    .trim()
    .min(1, "The section message is required.")
    .max(2000),

  serveCtaButtonText: z
    .string()
    .trim()
    .min(1, "The button text is required.")
    .max(100),

  serveCtaButtonUrl: z.string().trim().url("Enter a valid URL.").max(1500),
});

const discipleshipHeroSchema = z.object({
  discipleshipHeroEyebrow: z
    .string()
    .trim()
    .min(1, "The small heading is required.")
    .max(100, "The small heading is too long."),

  discipleshipHeroTitle: z
    .string()
    .trim()
    .min(1, "The Discipleship page title is required.")
    .max(200, "The Discipleship page title is too long."),

  discipleshipHeroSubtitle: z
    .string()
    .trim()
    .min(1, "The Discipleship page subtitle is required.")
    .max(1000, "The Discipleship page subtitle is too long."),
});

const testimonySchema = z.object({
  testimonyId: z.string().trim().optional(),

  kicker: z.string().trim().min(1, "The story heading is required.").max(150),

  title: z.string().trim().min(1, "The testimony title is required.").max(250),

  summary: z
    .string()
    .trim()
    .min(1, "The testimony summary is required.")
    .max(1500),

  authorLine: z.string().trim().min(1, "The author line is required.").max(250),

  body: z.string().trim().min(1, "The full testimony is required.").max(15000),

  closingText: z.string().trim().max(2000).optional(),

  sortOrder: z.coerce.number().int().min(0).max(9999),
});

const discipleshipTestimonyHeadingSchema = z.object({
  discipleshipTestimoniesEyebrow: z.string().trim().min(1).max(100),

  discipleshipTestimoniesTitle: z.string().trim().min(1).max(150),

  discipleshipTestimoniesIntro: z.string().trim().min(1).max(1000),

  discipleshipExploreEyebrow: z.string().trim().min(1).max(100),

  discipleshipExploreTitle: z.string().trim().min(1).max(200),

  discipleshipExploreBody: z.string().trim().min(1).max(1500),

  discipleshipExploreButtonText: z.string().trim().min(1).max(100),
});

const discipleshipNextStepsSchema = z.object({
  discipleshipNextEyebrow: z.string().trim().min(1).max(100),

  discipleshipNextTitle: z.string().trim().min(1).max(200),

  discipleshipCard1Eyebrow: z.string().trim().min(1).max(100),

  discipleshipCard1Title: z.string().trim().min(1).max(150),

  discipleshipCard1Body: z.string().trim().min(1).max(3000),

  discipleshipCard1Contact: z.string().trim().min(1).max(150),

  discipleshipCard1Email: z
    .string()
    .trim()
    .email("Enter a valid email address."),

  discipleshipCard1Phone: z.string().trim().min(1).max(50),

  discipleshipCard2Eyebrow: z.string().trim().min(1).max(100),

  discipleshipCard2Title: z.string().trim().min(1).max(150),

  discipleshipCard2Body: z.string().trim().min(1).max(3000),

  discipleshipCard2Contact: z.string().trim().min(1).max(150),

  discipleshipCard2Email: z
    .string()
    .trim()
    .email("Enter a valid email address."),

  discipleshipCard2Phone: z.string().trim().min(1).max(50),

  discipleshipCard3Eyebrow: z.string().trim().min(1).max(100),

  discipleshipCard3Title: z.string().trim().min(1).max(150),

  discipleshipCard3Body: z.string().trim().min(1).max(3000),

  discipleshipCard3Contact: z.string().trim().min(1).max(150),

  discipleshipCard3Email: z
    .string()
    .trim()
    .email("Enter a valid email address."),

  discipleshipCard3Phone: z.string().trim().min(1).max(50),
});
const acceptedImageTypes = ["image/jpeg", "image/png", "image/webp"] as const;

const maximumImageSize = 4 * 1024 * 1024;

export async function updateHomepage(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in to update the homepage.");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    throw new Error("You do not have permission to edit the homepage.");
  }

  const parsed = homepageSchema.safeParse({
    heroTitle: formData.get("heroTitle"),
    heroSubtitle: formData.get("heroSubtitle"),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ?? "The homepage data is invalid.",
    );
  }

  const existingContent = await db.siteContent.findUnique({
    where: {
      id: 1,
    },

    select: {
      heroImageUrl: true,
    },
  });

  let heroImageUrl =
    existingContent?.heroImageUrl ?? defaultSiteContent.heroImageUrl;

  const image = formData.get("heroImage");

  if (image instanceof File && image.size > 0) {
    if (
      !acceptedImageTypes.includes(
        image.type as (typeof acceptedImageTypes)[number],
      )
    ) {
      throw new Error("The image must be a JPG, PNG, or WebP file.");
    }

    if (image.size > maximumImageSize) {
      throw new Error("The image must be smaller than 4 MB.");
    }

    if (!env.BLOB_READ_WRITE_TOKEN) {
      throw new Error("BLOB_READ_WRITE_TOKEN is missing from the environment.");
    }

    const safeFilename = image.name
      .replace(/[^a-zA-Z0-9._-]/g, "-")
      .toLowerCase();

    const blob = await put(`homepage/${safeFilename}`, image, {
      access: "public",
      addRandomSuffix: true,
    });

    heroImageUrl = blob.url;
  }

  await db.siteContent.upsert({
    where: {
      id: 1,
    },

    update: {
      heroTitle: parsed.data.heroTitle,
      heroSubtitle: parsed.data.heroSubtitle,
      heroImageUrl,
    },

    create: {
      id: 1,
      heroTitle: parsed.data.heroTitle,
      heroSubtitle: parsed.data.heroSubtitle,
      heroImageUrl,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateDescriptionSection(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in to update the description section.");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    throw new Error("You do not have permission to update this section.");
  }

  const parsed = descSectionSchema.safeParse({
    descTitle: formData.get("descTitle"),
    descBody: formData.get("descBody"),
    descTime: formData.get("descTime"),
    descLocation: formData.get("descLocation"),
    descButtonText: formData.get("descButtonText"),
    descButtonUrl: formData.get("descButtonUrl"),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ??
        "The description section data is invalid.",
    );
  }

  const existingContent = await db.siteContent.findUnique({
    where: {
      id: 1,
    },
    select: {
      descImageUrl: true,
    },
  });

  let descImageUrl =
    existingContent?.descImageUrl ?? defaultSiteContent.descImageUrl;

  const image = formData.get("descImage");

  if (image instanceof File && image.size > 0) {
    if (
      !acceptedImageTypes.includes(
        image.type as (typeof acceptedImageTypes)[number],
      )
    ) {
      throw new Error("The image must be a JPG, PNG, or WebP file.");
    }

    if (image.size > maximumImageSize) {
      throw new Error("The image is larger than the permitted upload size.");
    }

    if (!env.BLOB_READ_WRITE_TOKEN) {
      throw new Error("BLOB_READ_WRITE_TOKEN is missing from the environment.");
    }

    const safeFilename = image.name
      .replace(/[^a-zA-Z0-9._-]/g, "-")
      .toLowerCase();

    const blob = await put(`description-section/${safeFilename}`, image, {
      access: "public",
      addRandomSuffix: true,
    });

    descImageUrl = blob.url;
  }

  await db.siteContent.upsert({
    where: {
      id: 1,
    },

    update: {
      descTitle: parsed.data.descTitle,
      descBody: parsed.data.descBody,
      descImageUrl,
      descTime: parsed.data.descTime,
      descLocation: parsed.data.descLocation,
      descButtonText: parsed.data.descButtonText,
      descButtonUrl: parsed.data.descButtonUrl,
    },

    create: {
      id: 1,

      heroTitle: defaultSiteContent.heroTitle,
      heroSubtitle: defaultSiteContent.heroSubtitle,
      heroImageUrl: defaultSiteContent.heroImageUrl,

      descTitle: parsed.data.descTitle,
      descBody: parsed.data.descBody,
      descImageUrl,
      descTime: parsed.data.descTime,
      descLocation: parsed.data.descLocation,
      descButtonText: parsed.data.descButtonText,
      descButtonUrl: parsed.data.descButtonUrl,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateMissionSection(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in to update the mission section.");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    throw new Error(
      "You do not have permission to update the mission section.",
    );
  }

  const parsed = missionSectionSchema.safeParse({
    missionTitle: formData.get("missionTitle"),
    missionTransformation: formData.get("missionTransformation"),
    missionDisciplesTitle: formData.get("missionDisciplesTitle"),
    missionDisciplesSubtitle: formData.get("missionDisciplesSubtitle"),
    missionStatement: formData.get("missionStatement"),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ?? "The mission section data is invalid.",
    );
  }

  await db.siteContent.upsert({
    where: {
      id: 1,
    },

    update: {
      missionTitle: parsed.data.missionTitle,
      missionTransformation: parsed.data.missionTransformation,
      missionDisciplesTitle: parsed.data.missionDisciplesTitle,
      missionDisciplesSubtitle: parsed.data.missionDisciplesSubtitle,
      missionStatement: parsed.data.missionStatement,
    },

    create: {
      id: 1,
      missionTitle: parsed.data.missionTitle,
      missionTransformation: parsed.data.missionTransformation,
      missionDisciplesTitle: parsed.data.missionDisciplesTitle,
      missionDisciplesSubtitle: parsed.data.missionDisciplesSubtitle,
      missionStatement: parsed.data.missionStatement,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

function parseReginaDateTime(value: string): Date {
  /*
   * Saskatchewan uses UTC-06:00 throughout the year.
   * datetime-local inputs do not contain a timezone, so we add it here.
   */
  const valueWithSeconds = value.length === 16 ? `${value}:00` : value;

  const date = new Date(`${valueWithSeconds}-06:00`);

  if (Number.isNaN(date.getTime())) {
    throw new Error("The event date and time are invalid.");
  }

  return date;
}

export async function saveChurchEvent(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in to manage events.");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    throw new Error("You do not have permission to manage events.");
  }

  const parsed = churchEventSchema.safeParse({
    eventId: formData.get("eventId") || undefined,
    title: formData.get("title"),
    description: formData.get("description"),
    location: formData.get("location") || undefined,
    startsAt: formData.get("startsAt"),
    recurrence: formData.get("recurrence"),
    recurrenceEndsAt: formData.get("recurrenceEndsAt") || undefined,
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ?? "The event information is invalid.",
    );
  }

  const startsAt = parseReginaDateTime(parsed.data.startsAt);
  const published = formData.get("published") === "on";

  const recurrenceEndsAt = parsed.data.recurrenceEndsAt
    ? parseReginaDateTime(`${parsed.data.recurrenceEndsAt}T23:59`)
    : null;

  const eventData = {
    title: parsed.data.title,
    description: parsed.data.description,
    location: parsed.data.location || null,
    startsAt,
    recurrence: parsed.data.recurrence,
    recurrenceEndsAt,
    published,
  };

  if (parsed.data.eventId) {
    await db.churchEvent.update({
      where: {
        id: parsed.data.eventId,
      },
      data: eventData,
    });
  } else {
    await db.churchEvent.create({
      data: eventData,
    });
  }

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteChurchEvent(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in to delete events.");
  }

  if (session.user.role !== "ADMIN") {
    throw new Error("Only administrators can delete events.");
  }

  const eventId = formData.get("eventId");

  if (typeof eventId !== "string" || !eventId) {
    throw new Error("The event ID is missing.");
  }

  await db.churchEvent.delete({
    where: {
      id: eventId,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}
export async function updateAboutHero(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in to update the About page.");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    throw new Error("You do not have permission to update the About page.");
  }

  const parsed = aboutHeroSchema.safeParse({
    aboutHeroTitle: formData.get("aboutHeroTitle"),
    aboutHeroSubtitle: formData.get("aboutHeroSubtitle"),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ??
        "The About page information is invalid.",
    );
  }

  await db.siteContent.upsert({
    where: {
      id: 1,
    },

    update: {
      aboutHeroTitle: parsed.data.aboutHeroTitle,
      aboutHeroSubtitle: parsed.data.aboutHeroSubtitle,
    },

    create: {
      id: 1,
      aboutHeroTitle: parsed.data.aboutHeroTitle,
      aboutHeroSubtitle: parsed.data.aboutHeroSubtitle,
    },
  });

  revalidatePath("/about");
  revalidatePath("/admin");
}
export async function updateAboutWhoSection(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in to update the About page.");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    throw new Error("You do not have permission to update the About page.");
  }

  const parsed = aboutWhoSchema.safeParse({
    aboutWhoTitle: formData.get("aboutWhoTitle"),
    aboutWhoParagraph1: formData.get("aboutWhoParagraph1"),
    aboutWhoParagraph2: formData.get("aboutWhoParagraph2"),
    aboutWhoParagraph3: formData.get("aboutWhoParagraph3"),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ?? "The Who We Are section is invalid.",
    );
  }

  await db.siteContent.upsert({
    where: {
      id: 1,
    },

    update: {
      aboutWhoTitle: parsed.data.aboutWhoTitle,
      aboutWhoParagraph1: parsed.data.aboutWhoParagraph1,
      aboutWhoParagraph2: parsed.data.aboutWhoParagraph2,
      aboutWhoParagraph3: parsed.data.aboutWhoParagraph3,
    },

    create: {
      id: 1,
      aboutWhoTitle: parsed.data.aboutWhoTitle,
      aboutWhoParagraph1: parsed.data.aboutWhoParagraph1,
      aboutWhoParagraph2: parsed.data.aboutWhoParagraph2,
      aboutWhoParagraph3: parsed.data.aboutWhoParagraph3,
    },
  });

  revalidatePath("/about");
  revalidatePath("/admin");
}
export async function updateAboutMissionSection(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in to update the About page.");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    throw new Error("You do not have permission to update the About page.");
  }

  const parsed = aboutMissionSchema.safeParse({
    aboutMissionTitle: formData.get("aboutMissionTitle"),
    missionStatement: formData.get("missionStatement"),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ??
        "The mission section information is invalid.",
    );
  }

  await db.siteContent.upsert({
    where: {
      id: 1,
    },

    update: {
      aboutMissionTitle: parsed.data.aboutMissionTitle,
      missionStatement: parsed.data.missionStatement,
    },

    create: {
      id: 1,
      aboutMissionTitle: parsed.data.aboutMissionTitle,
      missionStatement: parsed.data.missionStatement,
    },
  });

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin");
}
export async function updateAboutVisionSection(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in to update the About page.");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    throw new Error("You do not have permission to update the About page.");
  }

  const parsed = aboutVisionSchema.safeParse({
    aboutVisionTitle: formData.get("aboutVisionTitle"),
    missionTitle: formData.get("missionTitle"),
    missionTransformation: formData.get("missionTransformation"),
    missionDisciplesTitle: formData.get("missionDisciplesTitle"),
    missionDisciplesSubtitle: formData.get("missionDisciplesSubtitle"),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ??
        "The Vision Prayer section is invalid.",
    );
  }

  await db.siteContent.upsert({
    where: {
      id: 1,
    },

    update: {
      aboutVisionTitle: parsed.data.aboutVisionTitle,
      missionTitle: parsed.data.missionTitle,
      missionTransformation: parsed.data.missionTransformation,
      missionDisciplesTitle: parsed.data.missionDisciplesTitle,
      missionDisciplesSubtitle: parsed.data.missionDisciplesSubtitle,
    },

    create: {
      id: 1,
      aboutVisionTitle: parsed.data.aboutVisionTitle,
      missionTitle: parsed.data.missionTitle,
      missionTransformation: parsed.data.missionTransformation,
      missionDisciplesTitle: parsed.data.missionDisciplesTitle,
      missionDisciplesSubtitle: parsed.data.missionDisciplesSubtitle,
    },
  });

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin");
}
export async function saveStatementOfFaithItem(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in to manage the Statement of Faith.");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    throw new Error(
      "You do not have permission to manage the Statement of Faith.",
    );
  }

  const parsed = statementOfFaithSchema.safeParse({
    itemId: formData.get("itemId") || undefined,
    title: formData.get("title"),
    description: formData.get("description"),
    sortOrder: formData.get("sortOrder"),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ??
        "The Statement of Faith concept is invalid.",
    );
  }

  const data = {
    title: parsed.data.title,
    description: parsed.data.description,
    sortOrder: parsed.data.sortOrder,
    published: formData.get("published") === "on",
  };

  if (parsed.data.itemId) {
    await db.statementOfFaithItem.update({
      where: {
        id: parsed.data.itemId,
      },
      data,
    });
  } else {
    await db.statementOfFaithItem.create({
      data,
    });
  }

  revalidatePath("/about");
  revalidatePath("/admin");
}

export async function deleteStatementOfFaithItem(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error(
      "You must be signed in to delete a Statement of Faith concept.",
    );
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    throw new Error("You do not have permission to delete this concept.");
  }

  const itemId = formData.get("itemId");

  if (typeof itemId !== "string" || itemId.length === 0) {
    throw new Error("The Statement of Faith item ID is missing.");
  }

  await db.statementOfFaithItem.delete({
    where: {
      id: itemId,
    },
  });

  revalidatePath("/about");
  revalidatePath("/admin");
}
export async function saveLeadershipMember(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in to manage the leadership team.");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    throw new Error(
      "You do not have permission to manage the leadership team.",
    );
  }

  const parsed = leadershipMemberSchema.safeParse({
    memberId: formData.get("memberId") || undefined,
    name: formData.get("name"),
    role: formData.get("role"),
    bio: formData.get("bio"),
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    sortOrder: formData.get("sortOrder"),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ??
        "The leadership member information is invalid.",
    );
  }

  const existingMember = parsed.data.memberId
    ? await db.leadershipMember.findUnique({
        where: {
          id: parsed.data.memberId,
        },
        select: {
          imageUrl: true,
        },
      })
    : null;

  let imageUrl = existingMember?.imageUrl ?? null;

  if (formData.get("removeImage") === "on") {
    imageUrl = null;
  }

  const image = formData.get("image");

  if (image instanceof File && image.size > 0) {
    if (
      !acceptedImageTypes.includes(
        image.type as (typeof acceptedImageTypes)[number],
      )
    ) {
      throw new Error("The image must be a JPG, PNG, or WebP file.");
    }

    if (image.size > maximumImageSize) {
      throw new Error("The image is larger than the permitted upload size.");
    }

    if (!env.BLOB_READ_WRITE_TOKEN) {
      throw new Error("BLOB_READ_WRITE_TOKEN is missing from the environment.");
    }

    const safeFilename = image.name
      .replace(/[^a-zA-Z0-9._-]/g, "-")
      .toLowerCase();

    const blob = await put(`leadership/${safeFilename}`, image, {
      access: "public",
      addRandomSuffix: true,
    });

    imageUrl = blob.url;
  }

  const data = {
    name: parsed.data.name,
    role: parsed.data.role,
    bio: parsed.data.bio,
    email: parsed.data.email || null,
    phone: parsed.data.phone || null,
    imageUrl,
    sortOrder: parsed.data.sortOrder,
    published: formData.get("published") === "on",
  };

  if (parsed.data.memberId) {
    await db.leadershipMember.update({
      where: {
        id: parsed.data.memberId,
      },
      data,
    });
  } else {
    await db.leadershipMember.create({
      data,
    });
  }

  revalidatePath("/about");
  revalidatePath("/admin");
}

export async function deleteLeadershipMember(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in to delete a leadership member.");
  }

  if (session.user.role !== "ADMIN") {
    throw new Error("Only administrators can delete leadership members.");
  }

  const memberId = formData.get("memberId");

  if (typeof memberId !== "string" || memberId.length === 0) {
    throw new Error("The leadership member ID is missing.");
  }

  await db.leadershipMember.delete({
    where: {
      id: memberId,
    },
  });

  revalidatePath("/about");
  revalidatePath("/admin");
}
export async function updateAboutCallToAction(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in to update the About page.");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    throw new Error("You do not have permission to update the About page.");
  }

  const parsed = aboutCtaSchema.safeParse({
    aboutCtaTitle: formData.get("aboutCtaTitle"),
    aboutCtaBody: formData.get("aboutCtaBody"),
    aboutCtaVisitText: formData.get("aboutCtaVisitText"),
    aboutCtaVisitUrl: formData.get("aboutCtaVisitUrl"),
    aboutCtaEventsText: formData.get("aboutCtaEventsText"),
    aboutCtaEventsUrl: formData.get("aboutCtaEventsUrl"),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ??
        "The call-to-action section is invalid.",
    );
  }

  await db.siteContent.upsert({
    where: {
      id: 1,
    },

    update: parsed.data,

    create: {
      id: 1,
      ...parsed.data,
    },
  });

  revalidatePath("/about");
  revalidatePath("/admin");
}
export async function updateEventsHero(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in to update the Events page.");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    throw new Error("You do not have permission to update the Events page.");
  }

  const parsed = eventsHeroSchema.safeParse({
    eventsHeroTitle: formData.get("eventsHeroTitle"),
    eventsHeroSubtitle: formData.get("eventsHeroSubtitle"),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ?? "The Events page header is invalid.",
    );
  }

  await db.siteContent.upsert({
    where: {
      id: 1,
    },

    update: {
      eventsHeroTitle: parsed.data.eventsHeroTitle,
      eventsHeroSubtitle: parsed.data.eventsHeroSubtitle,
    },

    create: {
      id: 1,
      eventsHeroTitle: parsed.data.eventsHeroTitle,
      eventsHeroSubtitle: parsed.data.eventsHeroSubtitle,
    },
  });

  revalidatePath("/events");
  revalidatePath("/admin");
}
export async function updateGiveHero(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in to update the Give page.");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    throw new Error("You do not have permission to update the Give page.");
  }

  const parsed = giveHeroSchema.safeParse({
    giveHeroTitle: formData.get("giveHeroTitle"),
    giveHeroSubtitle: formData.get("giveHeroSubtitle"),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ?? "The Give page header is invalid.",
    );
  }

  await db.siteContent.upsert({
    where: {
      id: 1,
    },

    update: {
      giveHeroTitle: parsed.data.giveHeroTitle,
      giveHeroSubtitle: parsed.data.giveHeroSubtitle,
    },

    create: {
      id: 1,
      giveHeroTitle: parsed.data.giveHeroTitle,
      giveHeroSubtitle: parsed.data.giveHeroSubtitle,
    },
  });

  revalidatePath("/give");
  revalidatePath("/admin");
}
export async function updateGiveScripture(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in to update the Give page.");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    throw new Error("You do not have permission to update the Give page.");
  }

  const parsed = giveScriptureSchema.safeParse({
    giveVerseReference: formData.get("giveVerseReference"),
    giveVerseText: formData.get("giveVerseText"),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ?? "The Scripture section is invalid.",
    );
  }

  await db.siteContent.upsert({
    where: {
      id: 1,
    },

    update: {
      giveVerseReference: parsed.data.giveVerseReference,

      giveVerseText: parsed.data.giveVerseText,
    },

    create: {
      id: 1,

      giveVerseReference: parsed.data.giveVerseReference,

      giveVerseText: parsed.data.giveVerseText,
    },
  });

  revalidatePath("/give");
  revalidatePath("/admin");
}

export async function updateGiveWaysTitle(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in.");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    throw new Error("You do not have permission to edit the Give page.");
  }

  const parsed = giveWaysTitleSchema.safeParse({
    giveWaysTitle: formData.get("giveWaysTitle"),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ?? "The section title is invalid.",
    );
  }

  await db.siteContent.upsert({
    where: {
      id: 1,
    },

    update: {
      giveWaysTitle: parsed.data.giveWaysTitle,
    },

    create: {
      id: 1,
      giveWaysTitle: parsed.data.giveWaysTitle,
    },
  });

  revalidatePath("/give");
  revalidatePath("/admin");
}

export async function saveGivingMethod(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in.");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    throw new Error("You do not have permission to manage giving methods.");
  }

  const parsed = givingMethodSchema.safeParse({
    methodId: formData.get("methodId") || undefined,
    title: formData.get("title"),
    description: formData.get("description"),
    detail: formData.get("detail"),
    href: formData.get("href") || undefined,
    icon: formData.get("icon"),
    sortOrder: formData.get("sortOrder"),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ?? "The giving method is invalid.",
    );
  }

  const data = {
    title: parsed.data.title,
    description: parsed.data.description,
    detail: parsed.data.detail,
    href: parsed.data.href || null,
    icon: parsed.data.icon,
    sortOrder: parsed.data.sortOrder,
    published: formData.get("published") === "on",
  };

  if (parsed.data.methodId) {
    await db.givingMethod.update({
      where: {
        id: parsed.data.methodId,
      },
      data,
    });
  } else {
    await db.givingMethod.create({
      data,
    });
  }

  revalidatePath("/give");
  revalidatePath("/admin");
}

export async function deleteGivingMethod(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in.");
  }

  if (session.user.role !== "ADMIN") {
    throw new Error("Only administrators can delete giving methods.");
  }

  const methodId = formData.get("methodId");

  if (typeof methodId !== "string" || !methodId) {
    throw new Error("The giving method ID is missing.");
  }

  await db.givingMethod.delete({
    where: {
      id: methodId,
    },
  });

  revalidatePath("/give");
  revalidatePath("/admin");
}
export async function updateGiveThankYou(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in to update the Give page.");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    throw new Error("You do not have permission to update the Give page.");
  }

  const parsed = giveThankYouSchema.safeParse({
    giveThanksTitle: formData.get("giveThanksTitle"),
    giveThanksBody: formData.get("giveThanksBody"),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ?? "The thank-you section is invalid.",
    );
  }

  await db.siteContent.upsert({
    where: {
      id: 1,
    },

    update: {
      giveThanksTitle: parsed.data.giveThanksTitle,
      giveThanksBody: parsed.data.giveThanksBody,
    },

    create: {
      id: 1,
      giveThanksTitle: parsed.data.giveThanksTitle,
      giveThanksBody: parsed.data.giveThanksBody,
    },
  });

  revalidatePath("/give");
  revalidatePath("/admin");
}
export async function updateGatherHero(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in to update the Gather page.");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    throw new Error("You do not have permission to update the Gather page.");
  }

  const parsed = gatherHeroSchema.safeParse({
    gatherHeroTitle: formData.get("gatherHeroTitle"),
    gatherHeroSubtitle: formData.get("gatherHeroSubtitle"),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ?? "The Gather page header is invalid.",
    );
  }

  await db.siteContent.upsert({
    where: {
      id: 1,
    },

    update: {
      gatherHeroTitle: parsed.data.gatherHeroTitle,

      gatherHeroSubtitle: parsed.data.gatherHeroSubtitle,
    },

    create: {
      id: 1,

      gatherHeroTitle: parsed.data.gatherHeroTitle,

      gatherHeroSubtitle: parsed.data.gatherHeroSubtitle,
    },
  });

  revalidatePath("/gather");
  revalidatePath("/admin");
}
export async function updateGatherWaysTitle(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in.");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    throw new Error("You do not have permission to edit the Gather page.");
  }

  const parsed = gatherWaysTitleSchema.safeParse({
    gatherWaysTitle: formData.get("gatherWaysTitle"),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ?? "The section title is invalid.",
    );
  }

  await db.siteContent.upsert({
    where: {
      id: 1,
    },

    update: {
      gatherWaysTitle: parsed.data.gatherWaysTitle,
    },

    create: {
      id: 1,
      gatherWaysTitle: parsed.data.gatherWaysTitle,
    },
  });

  revalidatePath("/gather");
  revalidatePath("/admin");
}

export async function saveGatherGroup(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in to manage gatherings.");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    throw new Error("You do not have permission to manage gatherings.");
  }

  const parsed = gatherGroupSchema.safeParse({
    groupId: formData.get("groupId") || undefined,
    title: formData.get("title"),
    schedule: formData.get("schedule"),
    location: formData.get("location"),
    description: formData.get("description"),
    sortOrder: formData.get("sortOrder"),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ??
        "The gathering information is invalid.",
    );
  }

  const newImages = formData
    .getAll("images")
    .filter((value): value is File => value instanceof File && value.size > 0);

  let existingImages: {
    id: string;
    sortOrder: number;
  }[] = [];

  if (parsed.data.groupId) {
    const existingGroup = await db.gatherGroup.findUnique({
      where: {
        id: parsed.data.groupId,
      },
      include: {
        images: {
          select: {
            id: true,
            sortOrder: true,
          },
        },
      },
    });

    if (!existingGroup) {
      throw new Error("The gathering could not be found.");
    }

    existingImages = existingGroup.images;
  }

  if (existingImages.length + newImages.length > 10) {
    throw new Error(
      `A gathering can contain a maximum of 10 images. This gathering currently has ${existingImages.length}.`,
    );
  }

  for (const image of newImages) {
    if (
      !acceptedImageTypes.includes(
        image.type as (typeof acceptedImageTypes)[number],
      )
    ) {
      throw new Error("Images must be JPG, PNG, or WebP files.");
    }

    if (image.size > maximumImageSize) {
      throw new Error(
        "One of the images is larger than the permitted upload size.",
      );
    }
  }

  let groupId = parsed.data.groupId;

  if (groupId) {
    await db.gatherGroup.update({
      where: {
        id: groupId,
      },
      data: {
        title: parsed.data.title,
        schedule: parsed.data.schedule,
        location: parsed.data.location,
        description: parsed.data.description,
        sortOrder: parsed.data.sortOrder,
        published: formData.get("published") === "on",
      },
    });
  } else {
    const newGroup = await db.gatherGroup.create({
      data: {
        title: parsed.data.title,
        schedule: parsed.data.schedule,
        location: parsed.data.location,
        description: parsed.data.description,
        sortOrder: parsed.data.sortOrder,
        published: formData.get("published") === "on",
      },
    });

    groupId = newGroup.id;
  }

  if (!groupId) {
    throw new Error("The gathering could not be created.");
  }

  if (newImages.length > 0) {
    if (!env.BLOB_READ_WRITE_TOKEN) {
      throw new Error("BLOB_READ_WRITE_TOKEN is missing from the environment.");
    }

    const highestExistingOrder =
      existingImages.length > 0
        ? Math.max(...existingImages.map((image) => image.sortOrder))
        : -1;

    for (let index = 0; index < newImages.length; index += 1) {
      const image = newImages[index];

      if (!image) {
        continue;
      }

      const safeFilename = image.name
        .replace(/[^a-zA-Z0-9._-]/g, "-")
        .toLowerCase();

      const blob = await put(`gather/${groupId}/${safeFilename}`, image, {
        access: "public",
        addRandomSuffix: true,
      });

      await db.gatherGroupImage.create({
        data: {
          groupId,
          imageUrl: blob.url,
          sortOrder: highestExistingOrder + index + 1,
        },
      });
    }
  }

  revalidatePath("/gather");
  revalidatePath("/admin");
}

export async function deleteGatherGroupImage(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in.");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    throw new Error("You do not have permission to manage gathering images.");
  }

  const imageId = formData.get("imageId");

  if (typeof imageId !== "string" || imageId.length === 0) {
    throw new Error("The image ID is missing.");
  }

  const image = await db.gatherGroupImage.findUnique({
    where: {
      id: imageId,
    },
  });

  if (!image) {
    throw new Error("The image could not be found.");
  }

  await db.gatherGroupImage.delete({
    where: {
      id: imageId,
    },
  });

  try {
    await del(image.imageUrl);
  } catch (error) {
    console.error("Unable to remove Gather image from Blob storage:", error);
  }

  revalidatePath("/gather");
  revalidatePath("/admin");
}

export async function deleteGatherGroup(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in.");
  }

  if (session.user.role !== "ADMIN") {
    throw new Error("Only administrators can delete gatherings.");
  }

  const groupId = formData.get("groupId");

  if (typeof groupId !== "string" || groupId.length === 0) {
    throw new Error("The gathering ID is missing.");
  }

  const group = await db.gatherGroup.findUnique({
    where: {
      id: groupId,
    },
    include: {
      images: {
        select: {
          imageUrl: true,
        },
      },
    },
  });

  if (!group) {
    throw new Error("The gathering could not be found.");
  }

  await db.gatherGroup.delete({
    where: {
      id: groupId,
    },
  });

  if (group.images.length > 0) {
    try {
      await del(group.images.map((image) => image.imageUrl));
    } catch (error) {
      console.error("Unable to remove Gather images from Blob storage:", error);
    }
  }

  revalidatePath("/gather");
  revalidatePath("/admin");
}
export async function updateGatherCallToAction(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in to update the Gather page.");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    throw new Error("You do not have permission to update the Gather page.");
  }

  const parsed = gatherCtaSchema.safeParse({
    gatherCtaTitle: formData.get("gatherCtaTitle"),
    gatherCtaBody: formData.get("gatherCtaBody"),
    gatherCtaEventsText: formData.get("gatherCtaEventsText"),
    gatherCtaAboutText: formData.get("gatherCtaAboutText"),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ??
        "The Gather call-to-action section is invalid.",
    );
  }

  await db.siteContent.upsert({
    where: {
      id: 1,
    },

    update: {
      gatherCtaTitle: parsed.data.gatherCtaTitle,
      gatherCtaBody: parsed.data.gatherCtaBody,
      gatherCtaEventsText: parsed.data.gatherCtaEventsText,
      gatherCtaAboutText: parsed.data.gatherCtaAboutText,
    },

    create: {
      id: 1,
      gatherCtaTitle: parsed.data.gatherCtaTitle,
      gatherCtaBody: parsed.data.gatherCtaBody,
      gatherCtaEventsText: parsed.data.gatherCtaEventsText,
      gatherCtaAboutText: parsed.data.gatherCtaAboutText,
    },
  });

  revalidatePath("/gather");
  revalidatePath("/admin");
}
export async function updateServeHero(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in to update the Serve page.");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    throw new Error("You do not have permission to update the Serve page.");
  }

  const parsed = serveHeroSchema.safeParse({
    serveHeroTitle: formData.get("serveHeroTitle"),
    serveHeroSubtitle: formData.get("serveHeroSubtitle"),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ?? "The Serve page header is invalid.",
    );
  }

  await db.siteContent.upsert({
    where: {
      id: 1,
    },

    update: {
      serveHeroTitle: parsed.data.serveHeroTitle,

      serveHeroSubtitle: parsed.data.serveHeroSubtitle,
    },

    create: {
      id: 1,

      serveHeroTitle: parsed.data.serveHeroTitle,

      serveHeroSubtitle: parsed.data.serveHeroSubtitle,
    },
  });

  revalidatePath("/serve");
  revalidatePath("/admin");
}
export async function updateServeIntro(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in to update the Serve page.");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    throw new Error("You do not have permission to update the Serve page.");
  }

  const parsed = serveIntroSchema.safeParse({
    serveIntroTitle: formData.get("serveIntroTitle"),
    serveIntroBody: formData.get("serveIntroBody"),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ??
        "The Serve introduction section is invalid.",
    );
  }

  await db.siteContent.upsert({
    where: {
      id: 1,
    },

    update: {
      serveIntroTitle: parsed.data.serveIntroTitle,
      serveIntroBody: parsed.data.serveIntroBody,
    },

    create: {
      id: 1,
      serveIntroTitle: parsed.data.serveIntroTitle,
      serveIntroBody: parsed.data.serveIntroBody,
    },
  });

  revalidatePath("/serve");
  revalidatePath("/admin");
}
export async function updateServeMinistriesTitle(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in.");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    throw new Error("You do not have permission to update the Serve page.");
  }

  const parsed = serveMinistriesTitleSchema.safeParse({
    serveMinistriesTitle: formData.get("serveMinistriesTitle"),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ?? "The section title is invalid.",
    );
  }

  await db.siteContent.upsert({
    where: {
      id: 1,
    },

    update: {
      serveMinistriesTitle: parsed.data.serveMinistriesTitle,
    },

    create: {
      id: 1,
      serveMinistriesTitle: parsed.data.serveMinistriesTitle,
    },
  });

  revalidatePath("/serve");
  revalidatePath("/admin");
}
export async function saveServeMinistry(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in to manage ministries.");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    throw new Error("You do not have permission to manage ministries.");
  }

  const parsed = serveMinistrySchema.safeParse({
    ministryId: formData.get("ministryId") || undefined,

    title: formData.get("title"),

    description: formData.get("description"),

    sortOrder: formData.get("sortOrder"),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ?? "The ministry information is invalid.",
    );
  }

  const existingMinistry = parsed.data.ministryId
    ? await db.serveMinistry.findUnique({
        where: {
          id: parsed.data.ministryId,
        },
      })
    : null;

  let imageUrl = existingMinistry?.imageUrl ?? null;

  if (formData.get("removeImage") === "on") {
    if (imageUrl) {
      try {
        await del(imageUrl);
      } catch (error) {
        console.error("Unable to delete ministry image:", error);
      }
    }

    imageUrl = null;
  }

  const image = formData.get("image");

  if (image instanceof File && image.size > 0) {
    if (
      !acceptedImageTypes.includes(
        image.type as (typeof acceptedImageTypes)[number],
      )
    ) {
      throw new Error("The image must be a JPG, PNG, or WebP file.");
    }

    if (image.size > maximumImageSize) {
      throw new Error(
        "The ministry image is larger than the permitted upload size.",
      );
    }

    if (!env.BLOB_READ_WRITE_TOKEN) {
      throw new Error("BLOB_READ_WRITE_TOKEN is missing from the environment.");
    }

    const previousImageUrl = imageUrl;

    const safeFilename = image.name
      .replace(/[^a-zA-Z0-9._-]/g, "-")
      .toLowerCase();

    const blob = await put(`serve/${safeFilename}`, image, {
      access: "public",
      addRandomSuffix: true,
    });

    imageUrl = blob.url;

    if (previousImageUrl) {
      try {
        await del(previousImageUrl);
      } catch (error) {
        console.error("Unable to delete old ministry image:", error);
      }
    }
  }

  const data = {
    title: parsed.data.title,
    description: parsed.data.description,
    imageUrl,
    sortOrder: parsed.data.sortOrder,
    published: formData.get("published") === "on",
  };

  if (parsed.data.ministryId) {
    await db.serveMinistry.update({
      where: {
        id: parsed.data.ministryId,
      },
      data,
    });
  } else {
    await db.serveMinistry.create({
      data,
    });
  }

  revalidatePath("/serve");
  revalidatePath("/admin");
}
export async function deleteServeMinistry(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in.");
  }

  if (session.user.role !== "ADMIN") {
    throw new Error("Only administrators can delete ministries.");
  }

  const ministryId = formData.get("ministryId");

  if (typeof ministryId !== "string" || ministryId.length === 0) {
    throw new Error("The ministry ID is missing.");
  }

  const ministry = await db.serveMinistry.findUnique({
    where: {
      id: ministryId,
    },
  });

  if (!ministry) {
    throw new Error("The ministry could not be found.");
  }

  await db.serveMinistry.delete({
    where: {
      id: ministryId,
    },
  });

  if (ministry.imageUrl) {
    try {
      await del(ministry.imageUrl);
    } catch (error) {
      console.error("Unable to delete ministry image:", error);
    }
  }

  revalidatePath("/serve");
  revalidatePath("/admin");
}

export async function updateServeCallToAction(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in to update the Serve page.");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    throw new Error("You do not have permission to update the Serve page.");
  }

  const parsed = serveCtaSchema.safeParse({
    serveCtaEyebrow: formData.get("serveCtaEyebrow"),
    serveCtaTitle: formData.get("serveCtaTitle"),
    serveCtaBody: formData.get("serveCtaBody"),
    serveCtaButtonText: formData.get("serveCtaButtonText"),
    serveCtaButtonUrl: formData.get("serveCtaButtonUrl"),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ??
        "The Serve call-to-action section is invalid.",
    );
  }

  const existingContent = await db.siteContent.findUnique({
    where: {
      id: 1,
    },
    select: {
      serveCtaImageUrl: true,
    },
  });

  let imageUrl = existingContent?.serveCtaImageUrl ?? "";

  const removeImage = formData.get("removeImage") === "on";

  if (removeImage && imageUrl) {
    try {
      await del(imageUrl);
    } catch (error) {
      console.error("Unable to remove Serve CTA image:", error);
    }

    imageUrl = "";
  }

  const image = formData.get("serveCtaImage");

  if (image instanceof File && image.size > 0) {
    if (
      !acceptedImageTypes.includes(
        image.type as (typeof acceptedImageTypes)[number],
      )
    ) {
      throw new Error("The image must be a JPG, PNG, or WebP file.");
    }

    if (image.size > maximumImageSize) {
      throw new Error("The image is larger than the permitted upload size.");
    }

    if (!env.BLOB_READ_WRITE_TOKEN) {
      throw new Error("BLOB_READ_WRITE_TOKEN is missing from the environment.");
    }

    const previousImageUrl = imageUrl;

    const safeFilename = image.name
      .replace(/[^a-zA-Z0-9._-]/g, "-")
      .toLowerCase();

    const blob = await put(`serve/cta/${safeFilename}`, image, {
      access: "public",
      addRandomSuffix: true,
    });

    imageUrl = blob.url;

    if (previousImageUrl) {
      try {
        await del(previousImageUrl);
      } catch (error) {
        console.error("Unable to delete previous Serve CTA image:", error);
      }
    }
  }

  await db.siteContent.upsert({
    where: {
      id: 1,
    },

    update: {
      serveCtaEyebrow: parsed.data.serveCtaEyebrow,

      serveCtaTitle: parsed.data.serveCtaTitle,

      serveCtaBody: parsed.data.serveCtaBody,

      serveCtaButtonText: parsed.data.serveCtaButtonText,

      serveCtaButtonUrl: parsed.data.serveCtaButtonUrl,

      serveCtaImageUrl: imageUrl,
    },

    create: {
      id: 1,

      serveCtaEyebrow: parsed.data.serveCtaEyebrow,

      serveCtaTitle: parsed.data.serveCtaTitle,

      serveCtaBody: parsed.data.serveCtaBody,

      serveCtaButtonText: parsed.data.serveCtaButtonText,

      serveCtaButtonUrl: parsed.data.serveCtaButtonUrl,

      serveCtaImageUrl: imageUrl,
    },
  });

  revalidatePath("/serve");
  revalidatePath("/admin");
}
export async function updateDiscipleshipHero(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in to update the Discipleship page.");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    throw new Error(
      "You do not have permission to update the Discipleship page.",
    );
  }

  const parsed = discipleshipHeroSchema.safeParse({
    discipleshipHeroEyebrow: formData.get("discipleshipHeroEyebrow"),

    discipleshipHeroTitle: formData.get("discipleshipHeroTitle"),

    discipleshipHeroSubtitle: formData.get("discipleshipHeroSubtitle"),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ??
        "The Discipleship page header is invalid.",
    );
  }

  await db.siteContent.upsert({
    where: {
      id: 1,
    },

    update: {
      discipleshipHeroEyebrow: parsed.data.discipleshipHeroEyebrow,

      discipleshipHeroTitle: parsed.data.discipleshipHeroTitle,

      discipleshipHeroSubtitle: parsed.data.discipleshipHeroSubtitle,
    },

    create: {
      id: 1,

      discipleshipHeroEyebrow: parsed.data.discipleshipHeroEyebrow,

      discipleshipHeroTitle: parsed.data.discipleshipHeroTitle,

      discipleshipHeroSubtitle: parsed.data.discipleshipHeroSubtitle,
    },
  });

  revalidatePath("/discipleship");
  revalidatePath("/admin");
}
function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function createUniqueTestimonySlug(title: string) {
  const baseSlug = createSlug(title) || "testimony";

  let slug = baseSlug;
  let suffix = 2;

  while (
    await db.testimony.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    })
  ) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}
export async function updateDiscipleshipTestimonyContent(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in.");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    throw new Error(
      "You do not have permission to edit the Discipleship page.",
    );
  }

  const parsed = discipleshipTestimonyHeadingSchema.safeParse({
    discipleshipTestimoniesEyebrow: formData.get(
      "discipleshipTestimoniesEyebrow",
    ),

    discipleshipTestimoniesTitle: formData.get("discipleshipTestimoniesTitle"),

    discipleshipTestimoniesIntro: formData.get("discipleshipTestimoniesIntro"),

    discipleshipExploreEyebrow: formData.get("discipleshipExploreEyebrow"),

    discipleshipExploreTitle: formData.get("discipleshipExploreTitle"),

    discipleshipExploreBody: formData.get("discipleshipExploreBody"),

    discipleshipExploreButtonText: formData.get(
      "discipleshipExploreButtonText",
    ),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ?? "The testimony section is invalid.",
    );
  }

  await db.siteContent.upsert({
    where: {
      id: 1,
    },

    update: parsed.data,

    create: {
      id: 1,
      ...parsed.data,
    },
  });

  revalidatePath("/discipleship");
  revalidatePath("/admin");
}
export async function saveTestimony(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in to manage testimonies.");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    throw new Error("You do not have permission to manage testimonies.");
  }

  const parsed = testimonySchema.safeParse({
    testimonyId: formData.get("testimonyId") || undefined,

    kicker: formData.get("kicker"),

    title: formData.get("title"),

    summary: formData.get("summary"),

    authorLine: formData.get("authorLine"),

    body: formData.get("body"),

    closingText: formData.get("closingText") || undefined,

    sortOrder: formData.get("sortOrder"),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ?? "The testimony is invalid.",
    );
  }

  const existing = parsed.data.testimonyId
    ? await db.testimony.findUnique({
        where: {
          id: parsed.data.testimonyId,
        },
      })
    : null;

  if (parsed.data.testimonyId && !existing) {
    throw new Error("The testimony could not be found.");
  }

  let imageUrl = existing?.imageUrl ?? null;

  if (formData.get("removeImage") === "on" && imageUrl) {
    try {
      await del(imageUrl);
    } catch (error) {
      console.error("Unable to remove testimony image:", error);
    }

    imageUrl = null;
  }

  const image = formData.get("image");

  if (image instanceof File && image.size > 0) {
    if (
      !acceptedImageTypes.includes(
        image.type as (typeof acceptedImageTypes)[number],
      )
    ) {
      throw new Error("The image must be JPG, PNG, or WebP.");
    }

    if (image.size > maximumImageSize) {
      throw new Error("The testimony image is too large.");
    }

    if (!env.BLOB_READ_WRITE_TOKEN) {
      throw new Error("BLOB_READ_WRITE_TOKEN is missing.");
    }

    const previousImage = imageUrl;

    const safeFilename = image.name
      .replace(/[^a-zA-Z0-9._-]/g, "-")
      .toLowerCase();

    const blob = await put(`discipleship/testimonies/${safeFilename}`, image, {
      access: "public",
      addRandomSuffix: true,
    });

    imageUrl = blob.url;

    if (previousImage) {
      try {
        await del(previousImage);
      } catch (error) {
        console.error("Unable to remove previous testimony image:", error);
      }
    }
  }

  const data = {
    kicker: parsed.data.kicker,
    title: parsed.data.title,
    summary: parsed.data.summary,
    authorLine: parsed.data.authorLine,
    body: parsed.data.body,

    closingText: parsed.data.closingText || null,

    imageUrl,

    sortOrder: parsed.data.sortOrder,

    published: formData.get("published") === "on",
  };

  let testimonySlug: string;

  if (existing) {
    await db.testimony.update({
      where: {
        id: existing.id,
      },

      data,
    });

    testimonySlug = existing.slug;
  } else {
    const slug = await createUniqueTestimonySlug(parsed.data.title);

    await db.testimony.create({
      data: {
        ...data,
        slug,
      },
    });

    testimonySlug = slug;
  }

  revalidatePath("/discipleship");
  revalidatePath(`/discipleship/testimonies/${testimonySlug}`);
  revalidatePath("/admin");
}
export async function deleteTestimony(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in.");
  }

  if (session.user.role !== "ADMIN") {
    throw new Error("Only administrators can delete testimonies.");
  }

  const testimonyId = formData.get("testimonyId");

  if (typeof testimonyId !== "string" || !testimonyId) {
    throw new Error("The testimony ID is missing.");
  }

  const testimony = await db.testimony.findUnique({
    where: {
      id: testimonyId,
    },
  });

  if (!testimony) {
    throw new Error("The testimony could not be found.");
  }

  await db.testimony.delete({
    where: {
      id: testimony.id,
    },
  });

  if (testimony.imageUrl) {
    try {
      await del(testimony.imageUrl);
    } catch (error) {
      console.error("Unable to remove testimony image:", error);
    }
  }

  revalidatePath("/discipleship");
  revalidatePath("/admin");
}
export async function updateDiscipleshipNextSteps(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in to update the Discipleship page.");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    throw new Error(
      "You do not have permission to update the Discipleship page.",
    );
  }

  const parsed = discipleshipNextStepsSchema.safeParse({
    discipleshipNextEyebrow: formData.get("discipleshipNextEyebrow"),

    discipleshipNextTitle: formData.get("discipleshipNextTitle"),

    discipleshipCard1Eyebrow: formData.get("discipleshipCard1Eyebrow"),

    discipleshipCard1Title: formData.get("discipleshipCard1Title"),

    discipleshipCard1Body: formData.get("discipleshipCard1Body"),

    discipleshipCard1Contact: formData.get("discipleshipCard1Contact"),

    discipleshipCard1Email: formData.get("discipleshipCard1Email"),

    discipleshipCard1Phone: formData.get("discipleshipCard1Phone"),

    discipleshipCard2Eyebrow: formData.get("discipleshipCard2Eyebrow"),

    discipleshipCard2Title: formData.get("discipleshipCard2Title"),

    discipleshipCard2Body: formData.get("discipleshipCard2Body"),

    discipleshipCard2Contact: formData.get("discipleshipCard2Contact"),

    discipleshipCard2Email: formData.get("discipleshipCard2Email"),

    discipleshipCard2Phone: formData.get("discipleshipCard2Phone"),

    discipleshipCard3Eyebrow: formData.get("discipleshipCard3Eyebrow"),

    discipleshipCard3Title: formData.get("discipleshipCard3Title"),

    discipleshipCard3Body: formData.get("discipleshipCard3Body"),

    discipleshipCard3Contact: formData.get("discipleshipCard3Contact"),

    discipleshipCard3Email: formData.get("discipleshipCard3Email"),

    discipleshipCard3Phone: formData.get("discipleshipCard3Phone"),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ?? "The next steps section is invalid.",
    );
  }

  await db.siteContent.upsert({
    where: {
      id: 1,
    },

    update: parsed.data,

    create: {
      id: 1,
      ...parsed.data,
    },
  });

  revalidatePath("/discipleship");
  revalidatePath("/admin");
}
