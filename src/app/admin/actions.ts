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
