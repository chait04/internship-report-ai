import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Allow public access to these routes
  const publicPaths = ["/", "/onboarding", "/dashboard"];
  if (publicPaths.includes(path)) {
    return NextResponse.next();
  }

  // Check for authentication for other routes
  const token = request.cookies.get("a_session_");
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};