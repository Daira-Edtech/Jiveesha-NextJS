import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const publicPaths = ["/login", "/register", "/"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const sessionCookie = await getSessionCookie(request);
  const isAuthenticated = !!sessionCookie;

  const isPublicPath = publicPaths.includes(pathname);

  if (isAuthenticated) {
    if (pathname === "/login" || pathname === "/register") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } else {
    if (!isPublicPath) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect_to", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
