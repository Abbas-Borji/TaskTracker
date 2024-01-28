import { AuthOptions, DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcrypt";
import prisma from "prisma/client";

interface Organization {
  id: number;
  name: string;
  urlSegment: string;
  role: "USER" | "MANAGER" | "ADMIN";
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      organizations: Organization[];
      currentOrganization: Organization;
    } & DefaultSession["user"];
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("User not found");
        }

        const passwordsMatch = await bcrypt.compare(
          credentials.password,
          user.password!,
        );

        if (!passwordsMatch) {
          throw new Error("Incorrect password");
        }

        return { ...user, id: user.id.toString() };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: profile.role ? profile.role : "USER",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, trigger, session }) {
      if (trigger === "update" && session?.name) {
        token.name = session.name
      }

      if (!token.sub) return token;
      const existingUser = await prisma.user.findUnique({
        where: { id: token.sub },
        include: {
          OrganizationMembership: {
            include: {
              organization: true,
            },
          },
        },
      });
      if (!existingUser) return token;
      token.organizations = existingUser.OrganizationMembership.map(
        (membership) => ({
          id: membership.organizationId,
          name: membership.organization.name,
          urlSegment: membership.organization.urlSegment,
          role: membership.role as "USER" | "MANAGER" | "ADMIN",
        }),
      );
      return token;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.organizations && session.user) {
        session.user.organizations = token.organizations as Organization[];
        session.user.currentOrganization = session.user.organizations[0] as Organization;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
};
