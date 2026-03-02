// app/api/auth/[...nextauth]/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import { SanityAdapter } from "next-auth-sanity";
import { client } from "@/sanity/lib/client";
import bcrypt from "bcryptjs";

// Admin email
const ADMIN_EMAILS = ["prodbysmig@gmail.com"];

// Export authOptions so other files can import it
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
      allowDangerousEmailAccountLinking: true,
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID || "",
      clientSecret: process.env.APPLE_SECRET || "",
    }),
    // UPDATED CredentialsProvider with full password verification
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Find user in Sanity
          const user = await client.fetch(
            `*[_type == "user" && email == $email][0] {
              _id,
              name,
              email,
              image,
              password,
              role
            }`,
            { email: credentials.email },
          );

          // If user doesn't exist or has no password (OAuth user), handle signup
          if (!user) {
            // This is a signup attempt (no existing user)
            if (credentials.name) {
              // Create new user with hashed password
              const hashedPassword = await bcrypt.hash(
                credentials.password,
                10,
              );

              const isAdmin = ADMIN_EMAILS.includes(credentials.email);

              const newUser = await client.create({
                _type: "user",
                name: credentials.name,
                email: credentials.email,
                password: hashedPassword,
                role: isAdmin ? "admin" : "customer",
                emailVerified: new Date().toISOString(),
              });

              return {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                image: `https://ui-avatars.com/api/?name=${credentials.email}&background=006241&color=fff&size=128`,
                isAdmin,
                role: isAdmin ? "admin" : "customer",
              };
            }
            return null;
          }

          // If user exists but has no password (OAuth user trying to set password)
          if (!user.password) {
            // Allow them to set a password for the first time
            const hashedPassword = await bcrypt.hash(credentials.password, 10);

            await client
              .patch(user._id)
              .set({ password: hashedPassword })
              .commit();

            const isAdmin =
              user.role === "admin" || ADMIN_EMAILS.includes(user.email);

            return {
              id: user._id,
              name: user.name,
              email: user.email,
              image:
                user.image ||
                `https://ui-avatars.com/api/?name=${user.email}&background=006241&color=fff&size=128`,
              isAdmin,
              role: user.role || (isAdmin ? "admin" : "customer"),
            };
          }

          // Verify password for existing user
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isValid) {
            return null;
          }

          const isAdmin =
            user.role === "admin" || ADMIN_EMAILS.includes(user.email);

          return {
            id: user._id,
            name: user.name,
            email: user.email,
            image:
              user.image ||
              `https://ui-avatars.com/api/?name=${user.email}&background=006241&color=fff&size=128`,
            isAdmin,
            role: user.role || (isAdmin ? "admin" : "customer"),
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("SignIn callback - User:", user.email);
      console.log("Admin emails:", ADMIN_EMAILS);

      // Check if this email should be admin
      const isAdmin = ADMIN_EMAILS.includes(user.email || "");
      console.log("Is admin?", isAdmin);

      // Store admin status in user object
      (user as any).isAdmin = isAdmin;
      (user as any).role = isAdmin ? "admin" : "customer";

      // Update or create user in Sanity with correct role
      try {
        const existingUser = await client.fetch(
          `*[_type == "user" && email == $email][0]`,
          { email: user.email },
        );

        if (existingUser) {
          // Update existing user's role if they're admin
          if (isAdmin) {
            console.log("Updating existing user to admin role");
            await client
              .patch(existingUser._id)
              .set({
                role: "admin",
                name: user.name,
                image: user.image,
              })
              .commit();
          } else if (!existingUser.role) {
            // Set default role for non-admin users
            await client
              .patch(existingUser._id)
              .set({ role: "customer" })
              .commit();
          }
        } else {
          // Create new user with correct role
          console.log(
            "Creating new user with role:",
            isAdmin ? "admin" : "customer",
          );
          await client.create({
            _type: "user",
            name: user.name,
            email: user.email,
            image: user.image,
            role: isAdmin ? "admin" : "customer",
            emailVerified: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error("Error syncing user to Sanity:", error);
      }

      return true;
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub as string;
        session.user.email = (token.email as string) || session.user.email;
        session.user.name = (token.name as string) || session.user.name;
        session.user.image = (token.picture as string) || session.user.image;
        // Add admin status to session
        session.user.isAdmin = (token.isAdmin as boolean) || false;
        session.user.role =
          (token.role as string) || (token.isAdmin ? "admin" : "customer");

        console.log("Session callback - User role:", session.user.role);
        console.log("Session callback - Is admin:", session.user.isAdmin);
      }
      return session;
    },

    async jwt({ token, user, account, profile }) {
      console.log("JWT callback - User email:", user?.email);

      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;

        // FIX: Ensure picture is a string or undefined
        if (user.image) {
          token.picture = user.image;
        }

        // Check if user is admin
        const isAdmin = ADMIN_EMAILS.includes(user.email || "");
        token.isAdmin = isAdmin;
        token.role = isAdmin ? "admin" : "customer";

        console.log("JWT callback - Setting role:", token.role);
        console.log("JWT callback - Setting isAdmin:", token.isAdmin);

        // Try to get role from Sanity
        try {
          const sanityUser = await client.fetch(
            `*[_type == "user" && email == $email][0] { role }`,
            { email: user.email },
          );
          if (sanityUser?.role) {
            token.role = sanityUser.role;
            token.isAdmin = sanityUser.role === "admin";
            console.log("JWT callback - Role from Sanity:", sanityUser.role);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
      return token;
    },

    async redirect({ url, baseUrl }) {
      console.log("Redirect callback - URL:", url);
      console.log("Base URL:", baseUrl);

      // Handle sign-in redirects
      if (url.includes("/api/auth/callback")) {
        // Get the user's email from the session to determine redirect
        try {
          const session = await fetch(`${baseUrl}/api/auth/session`).then(
            (res) => res.json(),
          );
          const isAdmin =
            session?.user?.isAdmin || session?.user?.role === "admin";

          if (isAdmin) {
            console.log("Admin user, redirecting to /admin");
            return `${baseUrl}/admin`;
          }
        } catch (error) {
          console.error("Error determining redirect:", error);
        }
      }

      // Allows relative callback URLs
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) {
        return url;
      }

      return baseUrl;
    },
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
