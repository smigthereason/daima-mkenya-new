/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import { SanityAdapter } from "next-auth-sanity";
import { client } from "@/sanity/lib/client";
import bcrypt from "bcryptjs";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "prodbysmig@gmail.com")
  .split(",")
  .map((email) => email.trim());

export const authOptions: NextAuthOptions = {
  adapter: SanityAdapter(client as any),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID || "",
      clientSecret: process.env.APPLE_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const user = await client.fetch(
          `*[_type == "user" && email == $email][0]{
            _id, name, email, password, role, isAdmin, image
          }`,
          { email: credentials.email },
        );

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isValid) throw new Error("Invalid credentials");

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isAdmin: user.isAdmin,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        // Check database flag OR environment variable list
        token.isAdmin = user.isAdmin || ADMIN_EMAILS.includes(user.email || "");
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role || "customer";
        session.user.isAdmin = token.isAdmin || false;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  session: { strategy: "jwt" },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
