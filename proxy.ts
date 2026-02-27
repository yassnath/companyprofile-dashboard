import { NextResponse } from "next/server";

import { auth } from "@/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const session = req.auth;

  if (pathname.startsWith("/app") && !session?.user) {
    const signInUrl = new URL("/auth/sign-in", nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(signInUrl);
  }

  if (pathname.startsWith("/admin")) {
    if (!session?.user) {
      const signInUrl = new URL("/auth/sign-in", nextUrl.origin);
      signInUrl.searchParams.set("callbackUrl", nextUrl.pathname + nextUrl.search);
      return NextResponse.redirect(signInUrl);
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/app", nextUrl.origin));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/app/:path*", "/admin/:path*"],
};
