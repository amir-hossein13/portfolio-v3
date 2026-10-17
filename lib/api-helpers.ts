import { NextRequest, NextResponse } from "next/server";
import { ContentError } from "./portfolio-model";

export function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const expected = process.env.PORTFOLIO_ORIGIN || new URL(request.url).origin;
  if (!origin || origin !== expected) throw new ContentError("This request is not allowed from another website.", 403);
}

export async function limitedBody(request: Request, limit = 256 * 1024) {
  if (Number(request.headers.get("content-length")) > limit) throw new ContentError("This upload is too large.", 413);
  const reader = request.body?.getReader();
  if (!reader) throw new ContentError("The request is empty.");
  const chunks: Uint8Array[] = []; let size = 0;
  while (true) {
    const { done, value } = await reader.read(); if (done) break;
    size += value.length;
    if (size > limit) { await reader.cancel(); throw new ContentError("This upload is too large.", 413); }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

export async function readJson(request: NextRequest) {
  if (!request.headers.get("content-type")?.includes("application/json")) throw new ContentError("Send the form as JSON.", 415);
  const data = await limitedBody(request);
  try { return JSON.parse(data.toString("utf8")) as Record<string, unknown>; }
  catch { throw new ContentError("The request contains invalid JSON."); }
}

export function apiError(error: unknown) {
  if (error instanceof ContentError) return NextResponse.json({ error: error.message }, { status: error.status, headers: { "Cache-Control": "no-store" } });
  console.error("Portfolio request failed:", error);
  return NextResponse.json({ error: "The server could not complete this request. Please try again." }, { status: 500, headers: { "Cache-Control": "no-store" } });
}
