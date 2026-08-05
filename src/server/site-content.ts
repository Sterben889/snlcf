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

  missionTitle: "O GOD, WITH ALL OUR HEARTS WE LONG FOR YOU.",

  missionTransformation:
    "Come TRANSFORM US to be Christ-centered, Spirit-empowered, Mission-focused People",

  missionDisciplesTitle: "MULTIPLYING DISCIPLES",

  missionDisciplesSubtitle: "EVERYWHERE",

  missionStatement:
    "To glorify God by fulfilling the Great Commission through building Christ-committed followers in Saskatoon and beyond.",

  aboutHeroTitle: "About Us",

  aboutHeroSubtitle:
    "Learn more about our heart, mission, and the people who make up our church family",
};

export async function getSiteContent() {
  const content = await db.siteContent.findUnique({
    where: {
      id: 1,
    },
  });

  return content ?? defaultSiteContent;
}
