import { NextResponse, NextRequest } from "next/server";

const protectedRoutes = [
  "/play",
  "/about",
  "/how-to-play",
  "/high-scores",
  "/profile",
];

const publicRoutes = ["/", "/login", "/signup"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  console.log("Middleware running for path:", path);

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );

  // Get the access token from cookies
  const accessToken = req.cookies.get("accessToken")?.value;
  console.log("Access token exists:", !!accessToken);

  // If trying to access protected route without token, redirect to login
  if (isProtectedRoute && !accessToken) {
    console.log("No token, redirecting to login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If token exists and route is protected, validate the token
  if (isProtectedRoute && accessToken) {
    try {
      // Validate token using the dedicated endpoint
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/validate-token`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Cookie: `accessToken=${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        // Token is invalid, try to refresh it
        const refreshResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Cookie: `accessToken=${accessToken}`,
            },
            body: JSON.stringify({ accessToken }),
          }
        );

        if (!refreshResponse.ok) {
          console.log("Token refresh failed, redirecting to login");
          return NextResponse.redirect(new URL("/login", req.url));
        }

        console.log("Token refreshed successfully");
      } else {
        console.log("Token validated successfully");
      }
    } catch (error) {
      console.error("Error validating token:", error);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // If trying to access login/signup while already logged in, redirect to home
  if ((path === "/login" || path === "/signup") && accessToken) {
    console.log("Already logged in, redirecting to home");
    return NextResponse.redirect(new URL("/", req.url));
  }

  // For all other cases, allow the request to proceed
  console.log("Allowing request to proceed");
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
