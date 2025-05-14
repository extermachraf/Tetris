import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { url } from "inspector";

const protectedRoutes = [
  "/play",
  "about",
  "/how-to-play",
  "/high-scores",
  "/profile",
];

const publicRoutes = ["/", "login", "signup"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  //check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );

  //check if the current rout is public
  const isPublicRoute = publicRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );

  // Get the token from cookies
  const authToken = req.cookies.get("authToken")?.value;

  // If trying to access protected route without token, redirect to login
  if (isProtectedRoute && !authToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If trying to access login/signup while already logged in, redirect to home
  if ((path === "/login" || path == "signup") && authToken) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
