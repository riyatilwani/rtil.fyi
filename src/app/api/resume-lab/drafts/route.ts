import { NextResponse, type NextRequest } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { listResumeDrafts } from "@/lib/resume-store";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const drafts = await listResumeDrafts();
    return NextResponse.json({ drafts });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load drafts" }, { status: 500 });
  }
}
