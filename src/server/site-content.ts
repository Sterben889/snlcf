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

  giveHeroTitle: "Give",

  giveHeroSubtitle:
    "Your generosity helps us fulfill our mission and bless our community",

  giveVerseReference: "Malachi 3:10",

  giveVerseText:
    "“Bring the whole tithe into the storehouse, that there may be food in my house. Test me in this,” says the Lord Almighty, “and see if I will not throw open the floodgates of heaven and pour out so much blessing that there will not be room enough to store it.”",
  giveWaysTitle: "Ways of Giving",

  giveThanksTitle: "Thank You for Your Generosity",

  giveThanksBody:
    "Every gift, no matter the size, makes a difference in the lives of those we serve. Thank you for partnering with us in ministry.",

  gatherHeroTitle: "Gather",

  gatherHeroSubtitle:
    "There's a place for you at our table. Find a gathering to connect, grow, and belong.",

  gatherWaysTitle: "Ways to Gather",

  gatherCtaTitle: "We Can't Wait to Meet You",

  gatherCtaBody:
    "Whether it's your first time or you've been around a while, there's a place for you here. Come and gather with us.",

  gatherCtaEventsText: "See Upcoming Events",

  gatherCtaAboutText: "Learn About Us",

  serveHeroTitle: "Join the Team",

  serveHeroSubtitle: "Use your gifts and passions to make a difference!",

  serveIntroTitle: "You Were Made for This",

  serveMinistriesTitle: "Where You Can Serve",

  serveIntroBody:
    "God has created you to make a difference in the lives of those around you, and we believe real fulfillment comes when you live with greater purpose using YOUR unique gifts! We're all different, but we all have a place on the team. We'd love to help you discover your best fit.",

  serveCtaEyebrow: "NOT SURE WHERE TO START?",

  serveCtaTitle: "Let's find your fit together.",

  serveCtaBody:
    "You don't need to have it all figured out. We'd love to help you explore the different ways you can serve and discover where your gifts fit best.",

  serveCtaButtonText: "Find Your Fit",

  serveCtaButtonUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLSfbm8OMz8uNuUzK48sxgqysPKmv5wsjavHjepfwrnOpKH7QCw/viewform?usp=header",

  serveCtaImageUrl: "",

  discipleshipHeroEyebrow: "GROW TOGETHER",

  discipleshipHeroTitle: "Discipleship is a life we live together.",

  discipleshipHeroSubtitle:
    "Following Jesus is not a solo journey. Find meaningful community, take your next step, and discover how God can work through your story.",

  discipleshipTestimoniesEyebrow: "STORIES OF GRACE",

  discipleshipTestimoniesTitle: "Testimonies",

  discipleshipTestimoniesIntro:
    "Real stories from people discovering the transforming love of Jesus in everyday life.",

  discipleshipExploreEyebrow: "KEEP EXPLORING",

  discipleshipExploreTitle: "Your story matters here.",

  discipleshipExploreBody:
    "Discipleship looks different for everyone. Find community, ask questions, and take your next step with people who will walk alongside you.",

  discipleshipExploreButtonText: "Explore discipleship",

  discipleshipNextEyebrow: "YOUR NEXT STEP",

  discipleshipNextTitle: "There is a place for you to grow.",

  discipleshipCard1Eyebrow: "FIND COMMUNITY",

  discipleshipCard1Title: "Join a small group",

  discipleshipCard1Body:
    "A small group is a welcoming circle of people who meet regularly to build friendships, study Scripture, pray, and encourage one another through everyday life.\n\nNot sure where to start? We would love to help you find a group that fits your season of life.",

  discipleshipCard1Contact: "Ministry Contact",

  discipleshipCard1Email: "info@saskatoonnewlife.ca",

  discipleshipCard1Phone: "(306) 683-1950",

  discipleshipCard2Eyebrow: "TAKE YOUR NEXT STEP",

  discipleshipCard2Title: "Baptism",

  discipleshipCard2Body:
    "Baptism is a public expression of your faith in Jesus: a meaningful step of obedience and a celebration with your church family.\n\nIf you are considering baptism or want to learn more, our team is ready to walk with you.",

  discipleshipCard2Contact: "Ministry Contact",

  discipleshipCard2Email: "info@saskatoonnewlife.ca",

  discipleshipCard2Phone: "(306) 683-1950",

  discipleshipCard3Eyebrow: "LIVE SENT",

  discipleshipCard3Title: "Mission involvements",

  discipleshipCard3Body:
    "We partner with people and organizations that are bringing hope, practical care, and the good news of Jesus to our city and around the world.\n\nThere are many ways to participate through prayer, generosity, serving, and going.",

  discipleshipCard3Contact: "Ministry Contact",

  discipleshipCard3Email: "info@saskatoonnewlife.ca",

  discipleshipCard3Phone: "(306) 683-1950",
};

export async function getSiteContent() {
  const content = await db.siteContent.findUnique({
    where: {
      id: 1,
    },
  });

  return content ?? defaultSiteContent;
}
