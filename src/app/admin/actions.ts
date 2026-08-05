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
