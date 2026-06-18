import { NextResponse, type NextRequest } from "next/server";
import { adminCookieName, adminSessionToken, isAdminRequest } from "./src/lib/auth";

export function middleware(request: NextRequest) {
  if (isAdminRequest(request)) {
    const response = NextResponse.next();
    const token = adminSessionToken();

    if (token) {
      response.cookies.set(adminCookieName, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/"
      });
    }

    return response;
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="rtil.fyi admin"'
    }
  });
}

export const config = {
  matcher: ["/admin/:path*", "/api/content/:path*", "/api/resume-lab/:path*", "/resume-lab/:path*"]
};
