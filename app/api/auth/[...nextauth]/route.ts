/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import { SanityAdapter } from "next-auth-sanity";
import { client } from "@/sanity/lib/client";

// Export authOptions so other files can import it
export const authOptions: NextAuthOptions = {
  // The adapter handles saving Google/Facebook/Manual users into Sanity documents
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
      allowDangerousEmailAccountLinking: true,
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID || "",
      clientSecret: process.env.APPLE_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" }
      },
      async authorize(credentials) {
        if (credentials?.email && credentials?.password) {
          return { 
            id: credentials.email, 
            name: credentials.name || "Member", 
            email: credentials.email,
            image: `https://ui-avatars.com/api/?name=${credentials.email}&background=000&color=fff&size=128` 
          };
        }
        return null;
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        // Add the user ID from the token to the session
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
};

// Create the handler using authOptions
const handler = NextAuth(authOptions);

// Export the handler methods
export { handler as GET, handler as POST };