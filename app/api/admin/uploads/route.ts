import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { requireSession, sessionCookie } from "@/lib/admin-auth";
import { dataDirectory } from "@/lib/portfolio-store";
import { sameOrigin, apiError, limitedBody } from "@/lib/api-helpers";
import { ContentError } from "@/lib/portfolio-model";

export async function POST(request: NextRequest) {
  try {
    sameOrigin(request);
    requireSession(request.cookies.get(sessionCookie)?.value);
    if (!request.headers.get("content-type")?.startsWith("multipart/form-data;")) throw new ContentError("Choose an image file.", 415);
    const body = await limitedBody(request, 9 * 1024 * 1024);
    const form = await new Response(new Uint8Array(body), { headers: { "Content-Type": request.headers.get("content-type")! } }).formData();
    const file = form.get("file");
    if (!(file instanceof File) || !file.size || file.size > 8 * 1024 * 1024) throw new ContentError("Choose a PNG, JPEG, or WebP image up to 8 MB.");
    const bytes = Buffer.from(await file.arrayBuffer());
    let extension = "";
    if (bytes.length > 24 && bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) extension = "png";
    else if (bytes.length > 4 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) extension = "jpg";
    else if (bytes.length > 16 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") extension = "webp";
    if (!extension) throw new ContentError("Only PNG, JPEG, and WebP images are supported.", 415);
    const filename = `${randomBytes(16).toString("hex")}.${extension}`;
    const directory = path.join(dataDirectory, "uploads");
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, filename), bytes, { flag: "wx", mode: 0o600 });
    return NextResponse.json({ url: `/api/media/${filename}` }, { status: 201 });
  } catch (error) { return apiError(error); }
}
