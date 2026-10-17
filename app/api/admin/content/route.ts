import { NextRequest, NextResponse } from "next/server";
import { requireSession, sessionCookie } from "@/lib/admin-auth";
import { readPortfolio, savePortfolio } from "@/lib/portfolio-store";
import { apiError, readJson, sameOrigin } from "@/lib/api-helpers";
import { ContentError, validateContent } from "@/lib/portfolio-model";

export async function GET(request: NextRequest) {
  try {
    requireSession(request.cookies.get(sessionCookie)?.value);
    return NextResponse.json(readPortfolio(), { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) { return apiError(error); }
}

export async function PUT(request: NextRequest) {
  try {
    sameOrigin(request);
    requireSession(request.cookies.get(sessionCookie)?.value);
    const data = await readJson(request);
    if (!data || !Number.isSafeInteger(data.revision) || Number(data.revision) < 1) throw new ContentError("The version is missing. Reload the editor and try again.");
    return NextResponse.json(savePortfolio(validateContent(data.content), Number(data.revision)), { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) { return apiError(error); }
}
