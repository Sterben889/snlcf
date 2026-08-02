/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { UserRole } from "@prisma/client";
import { compare } from "bcryptjs";
import type { DefaultSession, NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import { db } from "~/server/db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }
}

type AuthenticatedUser = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: UserRole;
};

function isUserRole(value: unknown): value is UserRole {
  return value === "ADMIN" || value === "EDITOR";
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const authConfig = {
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    Credentials({
      name: "Email and password",

      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "admin@example.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const email = parsed.data.email.trim().toLowerCase();

        const user = await db.user.findUnique({
          where: {
            email,
          },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            passwordHash: true,
            role: true,
            active: true,
          },
        });

        if (!user?.active || !user.passwordHash) {
          return null;
        }

        const passwordIsCorrect = await compare(
          parsed.data.password,
          user.passwordHash,
        );

        if (!passwordIsCorrect) {
          return null;
        }

        const authenticatedUser: AuthenticatedUser = {
          id: user.id,
          name: user.name,
          email: user.email ?? email,
          image: user.image,
          role: user.role,
        };

        return authenticatedUser;
      },
    }),
  ],

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        const authenticatedUser = user as AuthenticatedUser;

        token.id = authenticatedUser.id;
        token.role = authenticatedUser.role;
      }

      return token;
    },

    session({ session, token }) {
      if (typeof token.id !== "string" || !isUserRole(token.role)) {
        throw new Error(
          "Authenticated session token is missing required user fields.",
        );
      }

      session.user.id = token.id;
      session.user.role = token.role;

      return session;
    },
  },
} satisfies NextAuthConfig;
