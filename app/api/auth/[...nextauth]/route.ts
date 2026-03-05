// // app/api/auth/[...nextauth]/route.ts
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import NextAuth, { NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import FacebookProvider from "next-auth/providers/facebook";
// import AppleProvider from "next-auth/providers/apple";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { SanityAdapter } from "next-auth-sanity";
// import { client } from "@/sanity/lib/client";
// import bcrypt from "bcryptjs";

// const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "prodbysmig@gmail.com")
//   .split(",")
//   .map((email) => email.trim());

// export const authOptions: NextAuthOptions = {
//   adapter: SanityAdapter(client as any),
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID || "",
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
//       allowDangerousEmailAccountLinking: true,
//     }),
//     FacebookProvider({
//       clientId: process.env.FACEBOOK_CLIENT_ID || "",
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
//     }),
//     AppleProvider({
//       clientId: process.env.APPLE_ID || "",
//       clientSecret: process.env.APPLE_SECRET || "",
//     }),
//     CredentialsProvider({
//       name: "credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Invalid credentials");
//         }

//         const user = await client.fetch(
//           `*[_type == "user" && email == $email][0]`,
//           { email: credentials.email },
//         );

//         if (!user || !user.password) {
//           throw new Error("Invalid credentials");
//         }

//         const isCorrectPassword = await bcrypt.compare(
//           credentials.password,
//           user.password,
//         );

//         if (!isCorrectPassword) {
//           throw new Error("Invalid credentials");
//         }

//         return {
//           id: user._id,
//           email: user.email,
//           name: user.name,
//           role: user.role || "customer",
//         };
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/login",
//     error: "/login",
//   },
//   callbacks: {
//     async jwt({ token, user }: any) {
//       if (user) {
//         token.role = user.role;
//         token.email = user.email;
//       }
//       return token;
//     },
//     async session({ session, token }: any) {
//       if (session.user) {
//         session.user.role = token.role || "customer";
//         session.user.isAdmin = ADMIN_EMAILS.includes(token.email);
//         session.user.email = token.email;
//       }
//       return session;
//     },
//     async redirect({ url, baseUrl }) {
//       // Simple logic: If it's an internal link, go there. Otherwise, go home.
//       if (url.startsWith("/")) return `${baseUrl}${url}`;
//       else if (new URL(url).origin === baseUrl) return url;
//       return baseUrl;
//     },
//   },
//   session: {
//     strategy: "jwt",
//   },
//   debug: process.env.NODE_ENV === "development",
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };
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
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        try {
          // Check if user exists
          let user = await client.fetch(
            `*[_type == "user" && email == $email][0]`,
            { email: credentials.email },
          );

          // If user doesn't exist and we have a name, create new user (SIGN UP)
          if (!user && credentials.name) {
            // Hash the password
            const hashedPassword = await bcrypt.hash(credentials.password, 10);

            // Create new user in Sanity
            const newUser = await client.create({
              _type: "user",
              email: credentials.email,
              name: credentials.name,
              password: hashedPassword,
              role: "customer",
              emailVerified: new Date().toISOString(),
            });

            console.log("New user created:", newUser.email);
            user = newUser;
          }
          // If user doesn't exist and no name provided, they're trying to sign in without an account
          else if (!user) {
            throw new Error(
              "No account found with this email. Please sign up first.",
            );
          }
          // If user exists, verify password (SIGN IN)
          else {
            const isCorrectPassword = await bcrypt.compare(
              credentials.password,
              user.password,
            );

            if (!isCorrectPassword) {
              throw new Error("Invalid password");
            }
          }

          console.log("Authorize returning user:", {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
          });

          // Return user object with ALL necessary fields
          return {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role || "customer",
          };
        } catch (error: any) {
          console.error("Authorization error:", error.message);
          throw new Error(error.message);
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      console.log("JWT callback - Before:", { token, user, account });

      // Initial sign in
      if (account && user) {
        // Make sure to include ALL user data in the token
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
      }

      console.log("JWT callback - After:", token);
      return token;
    },
    async session({ session, token }) {
      console.log("Session callback - Before:", { session, token });

      if (session?.user) {
        // Ensure all token data is passed to the session
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = (token.role as string) || "customer";
        // Check admin status based on email
        session.user.isAdmin = ADMIN_EMAILS.includes(session.user.email);
      }

      console.log("Session callback - After:", session);
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
