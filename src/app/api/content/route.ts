import { NextResponse, type NextRequest } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { getSiteContent, saveSiteContent, type SiteContent } from "@/lib/content";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return unauthorized();
  }

  return NextResponse.json(await getSiteContent());
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return unauthorized();
  }

  const body = (await request.json()) as SiteContent;
  const mode = await saveSiteContent(body);
  return NextResponse.json({ mode });
}

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="rtil.fyi admin"'
    }
  });
}
