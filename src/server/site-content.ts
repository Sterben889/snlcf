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
};

export async function getSiteContent() {
  const content = await db.siteContent.findUnique({
    where: {
      id: 1,
    },
  });

  return content ?? defaultSiteContent;
}
