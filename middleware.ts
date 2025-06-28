import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("firebaseAuth")?.value;
  const protectedPaths = [
    "/profile",
    "/add-goal",
    "/achieved-goals",
    "/ongoing-goals",
  ];

  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile",
    "/add-goal",
    "/achieved-goals",
    "/ongoing-goals",
  ],
};
