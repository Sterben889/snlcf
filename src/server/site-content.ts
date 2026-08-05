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

  aboutWhoTitle: "Who We Are",

  aboutWhoParagraph1:
    "Saskatoon New Life Community Fellowship is a vibrant, Christ-centered church family located in the heart of Saskatoon, Saskatchewan. We are a community of believers who have been transformed by the love of Jesus Christ and are passionate about sharing that love with others.",

  aboutWhoParagraph2:
    "Our church family comes from diverse backgrounds, ages, and walks of life, but we are united by our common faith in Jesus Christ. We believe that every person has value and worth in God's eyes, and we strive to create an environment where everyone feels welcomed, loved, and accepted.",

  aboutWhoParagraph3:
    "Whether you're taking your first steps in faith, have been walking with Jesus for years, or are simply curious about Christianity, we invite you to join us as we grow together in our relationship with God and with one another.",

  aboutMissionTitle: "Purpose and Mission Statement",

  aboutVisionTitle: "Vision Prayer",

  aboutCtaTitle: "Ready to Join Our Family?",

  aboutCtaBody:
    "We'd love to meet you and help you take your next steps in faith. Come as you are — you belong here.",

  aboutCtaVisitText: "Visit Us This Sunday",

  aboutCtaVisitUrl:
    "https://www.google.com/maps/dir/?api=1&destination=3532+Fairlight+Dr,+Saskatoon,+SK+S7M+4T3",

  aboutCtaEventsText: "See Our Events",

  aboutCtaEventsUrl: "/events",

  eventsHeroTitle: "Upcoming Events",

  eventsHeroSubtitle:
    "See what's coming up and find a place to connect with our community.",
};

export async function getSiteContent() {
  const content = await db.siteContent.findUnique({
    where: {
      id: 1,
    },
  });

  return content ?? defaultSiteContent;
}
