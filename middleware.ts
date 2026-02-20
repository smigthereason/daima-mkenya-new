import { withAuth } from "next-auth/middleware";

export default withAuth(
  // The custom middleware function
  function middleware(req) {
    // You can add custom logic here if needed
  },
  {
    callbacks: {
      // Returns true if the user has a token (is logged in)
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

// Protect these routes. If a user tries to go here while logged out, 
// it redirects them to /login automatically.
export const config = { 
  matcher: ["/profile/:path*", "/checkout/:path*"] 
};