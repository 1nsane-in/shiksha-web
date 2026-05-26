import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/admin", "/student", "/parents"] as const;

const roleDefaults: Record<string, string> = {
  admin: "/admin/dashboard",
  super_admin: "/admin/dashboard",
  student: "/student/dashboard",
  parents: "/parents/dashboard",
};

function decodeToken(token: string): { role?: string } | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public university pages without authentication
  if (pathname.startsWith("/student/university/")) {
    return NextResponse.next();
  }

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get("token")?.value;
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = decodeToken(token);
  if (!payload) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = payload.role?.toLowerCase() ?? "";

  const routeMatch = protectedRoutes.find((route) =>
    pathname.startsWith(route)
  );
  if (routeMatch) {
    const expectedRole = routeMatch.replace("/", "");
    if (role !== expectedRole && role !== "super_admin") {
      const defaultDest = roleDefaults[role];
      if (defaultDest) {
        return NextResponse.redirect(new URL(defaultDest, request.url));
      }
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*", "/parents/:path*"],
};
