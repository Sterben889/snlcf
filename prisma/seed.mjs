import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const name = process.env.INITIAL_ADMIN_NAME?.trim();
const email = process.env.INITIAL_ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.INITIAL_ADMIN_PASSWORD;

if (!name) {
  throw new Error("INITIAL_ADMIN_NAME is missing from .env");
}

if (!email) {
  throw new Error("INITIAL_ADMIN_EMAIL is missing from .env");
}

if (!password || password.length < 12) {
  throw new Error("INITIAL_ADMIN_PASSWORD must contain at least 12 characters");
}

try {
  const passwordHash = await hash(password, 12);

  const administrator = await prisma.user.upsert({
    where: { email },

    update: {
      name,
      passwordHash,
      role: "ADMIN",
      active: true,
    },

    create: {
      name,
      email,
      passwordHash,
      role: "ADMIN",
      active: true,
    },

    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  console.log("Administrator ready:");
  console.log(administrator);
} finally {
  await prisma.$disconnect();
}
const secondAdminName = process.env.SECOND_ADMIN_NAME?.trim();

const secondAdminEmail = process.env.SECOND_ADMIN_EMAIL?.trim().toLowerCase();

const secondAdminPassword = process.env.SECOND_ADMIN_PASSWORD;

if (secondAdminName && secondAdminEmail && secondAdminPassword) {
  const secondAdminPasswordHash = await hash(secondAdminPassword, 12);

  const secondAdmin = await prisma.user.upsert({
    where: {
      email: secondAdminEmail,
    },

    update: {
      name: secondAdminName,
      passwordHash: secondAdminPasswordHash,
      role: "ADMIN",
      active: true,
    },

    create: {
      name: secondAdminName,
      email: secondAdminEmail,
      passwordHash: secondAdminPasswordHash,
      role: "ADMIN",
      active: true,
    },
  });

  console.log("Second administrator ready:");
  console.log({
    id: secondAdmin.id,
    name: secondAdmin.name,
    email: secondAdmin.email,
    role: secondAdmin.role,
  });
}
