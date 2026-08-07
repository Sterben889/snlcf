/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use server";

import { put } from "@vercel/blob";
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
