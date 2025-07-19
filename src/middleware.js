import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/auth/login", "/auth/register", "/about"];

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;

  // Allow public paths without auth
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Get token from cookie
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  // If no token, redirect to login with callback
  if (!token) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user is on auth pages but logged in, redirect based on role
  if (pathname.startsWith("/auth")) {
    if (token.role === "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/admin", req.url));
    } else if (token.role === "CANDIDATE") {
      return NextResponse.redirect(new URL("/dashboard/candidate", req.url));
    }
  }

  // Protect dashboard routes by role
  if (pathname.startsWith("/dashboard/admin") && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (pathname.startsWith("/dashboard/candidate") && token.role !== "CANDIDATE") {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Otherwise allow
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*", "/about", "/"],
};
