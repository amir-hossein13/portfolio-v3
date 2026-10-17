import { NextRequest, NextResponse } from "next/server";
import { setupAdmin, loginAdmin, logoutAdmin, sessionCookie, sessionAge } from "@/lib/admin-auth";
import { apiError, readJson, sameOrigin } from "@/lib/api-helpers";
import { ContentError } from "@/lib/portfolio-model";

export async function POST(request: NextRequest, context: RouteContext<"/api/admin/auth/[action]">) {
  try {
    sameOrigin(request);
    const { action } = await context.params;
    if (action === "logout") {
      logoutAdmin(request.cookies.get(sessionCookie)?.value);
      const response = NextResponse.json({ ok: true });
      response.cookies.set(sessionCookie, "", { httpOnly: true, sameSite: "strict", path: "/", maxAge: 0 });
      return response;
    }
    if (action !== "setup" && action !== "login") throw new ContentError("Not found.", 404);
    const data = await readJson(request);
    if (!data || typeof data.password !== "string" || data.password.length > 200) throw new ContentError("Enter a valid password.");
    let token: string;
    if (action === "setup") {
      if (typeof data.key !== "string" || data.key.length > 100) throw new ContentError("Enter the setup key.");
      token = setupAdmin(data.key.trim(), data.password);
    } else token = loginAdmin(data.password);
    const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
    response.cookies.set(sessionCookie, token, { httpOnly: true, sameSite: "strict", secure: new URL(process.env.PORTFOLIO_ORIGIN || request.url).protocol === "https:", path: "/", maxAge: sessionAge });
    return response;
  } catch (error) { return apiError(error); }
}
