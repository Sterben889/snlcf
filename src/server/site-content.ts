/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import "server-only";

import { db } from "~/server/db";

export const defaultSiteContent = {
  id: 1,
  heroTitle: "To Glorify God",
  heroSubtitle: "by fulfilling the Great Commission",
  heroImageUrl: "/filter.png",

  descTitle: "Sunday Service",
  descBody:
    "Join us every Sunday as we worship God, learn from His Word, and grow together as a church family.",
  descImageUrl: "",
  descTime: "10:00 am",
  descLocation: "3532 Fairlight Dr. Saskatoon, SK",
  descButtonText: "Learn more",
  descButtonUrl: "#",
};

export async function getSiteContent() {
  const content = await db.siteContent.findUnique({
    where: {
      id: 1,
    },
  });

  return content ?? defaultSiteContent;
}
