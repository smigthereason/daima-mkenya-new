// // app/proxy.ts
// import { withAuth } from "next-auth/middleware";

// export default withAuth(
//   function middleware(req) {
//     // You can add custom logic here if needed
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => !!token,
//     },
//     pages: {
//       signIn: "/login",
//     },
//   }
// );

// export const config = {
//   matcher: ["/profile/:path*", "/checkout/:path*"]
// };
// middleware.ts (in root directory, not in app folder)
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

    // Allow access to admin routes only for admins
    if (isAdminRoute) {
      const isAdmin =
        token?.role === "admin" ||
        token?.email === "prodbysmig@gmail.com" ||
        process.env.ADMIN_EMAILS?.split(",")
          .map((e) => e.trim())
          .includes(token?.email || "");

      if (!isAdmin) {
        // Redirect non-admins to home page
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Always allow the request to proceed - we'll handle authorization in the middleware function
        // This prevents premature redirects before session is established
        return true;
      },
    },
    pages: {
      signIn: "/login",
    },
  },
);

export const config = {
  matcher: [
    "/profile/:path*",
    "/checkout/:path*",
    "/admin/:path*", // Add admin routes to the matcher
  ],
};
