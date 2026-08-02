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
