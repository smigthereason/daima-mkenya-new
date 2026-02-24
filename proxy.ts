// app/proxy.ts
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // You can add custom logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = { 
  matcher: ["/profile/:path*", "/checkout/:path*"] 
};