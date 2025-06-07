import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const publicPaths = ["/login", "/register"];

export async function middleware(request) {
  const pathname = request.nextUrl.pathname.replace(/\/$/, "");

  const sessionCookie = await getSessionCookie(request);
  const isAuthenticated = !!sessionCookie;

  const isAccessingPublicPath = publicPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isAccessingPublicPath && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!isAccessingPublicPath && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect_to", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
