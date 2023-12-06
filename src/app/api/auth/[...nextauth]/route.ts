import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
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
        if (!credentials?.email || !credentials.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        return passwordsMatch ? user : null;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

//////////////////////////////////////////////////////////////////////////////////////////////

// import { prisma } from '@/lib/prisma'
// import { compare } from 'bcrypt'
// import CredentialsProvider from 'next-auth/providers/credentials'

// export const authOptions: NextAuthOptions = {
//   session: {
//     strategy: 'jwt'
//   },
//   providers: [
//     CredentialsProvider({
//       name: 'Sign in',
//       credentials: {
//         email: {
//           label: 'Email',
//           type: 'email',
//           placeholder: 'hello@example.com'
//         },
//         password: { label: 'Password', type: 'password' }
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials.password) {
//           return null
//         }

//         const user = await prisma.user.findUnique({
//           where: {
//             email: credentials.email
//           }
//         })

//         if (!user) {
//           return null
//         }

//         const isPasswordValid = await compare(
//           credentials.password,
//           user.password
//         )

//         if (!isPasswordValid) {
//           return null
//         }

//         return {
//           id: user.id + '',
//           email: user.email,
//           name: user.name,
//           randomKey: 'Hey cool'
//         }
//       }
//     })
//   ],
//   callbacks: {
//     session: ({ session, token }) => {
//       console.log('Session Callback', { session, token })
//       return {
//         ...session,
//         user: {
//           ...session.user,
//           id: token.id,
//           randomKey: token.randomKey
//         }
//       }
//     },
//     jwt: ({ token, user }) => {
//       console.log('JWT Callback', { token, user })
//       if (user) {
//         const u = user as unknown as any
//         return {
//           ...token,
//           id: u.id,
//           randomKey: u.randomKey
//         }
//       }
//       return token
//     }
//   }
// }

// const handler = NextAuth(authOptions)
// export { handler as GET, handler as POST }
