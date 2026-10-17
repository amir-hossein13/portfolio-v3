import { readFile } from "node:fs/promises";
import path from "node:path";
import { dataDirectory } from "@/lib/portfolio-store";

export async function GET(_request: Request, context: RouteContext<"/api/media/[filename]">) {
  const { filename } = await context.params;
  if (!/^[a-f0-9]{32}\.(png|jpg|webp)$/.test(filename)) return new Response("Not found", { status: 404 });
  try {
    const bytes = await readFile(path.join(dataDirectory, "uploads", filename));
    const type = filename.endsWith(".png") ? "image/png" : filename.endsWith(".jpg") ? "image/jpeg" : "image/webp";
    return new Response(new Uint8Array(bytes), { headers: { "Content-Type": type, "X-Content-Type-Options": "nosniff", "Content-Disposition": `inline; filename="${filename}"`, "Cache-Control": "public, max-age=31536000, immutable", "Content-Security-Policy": "default-src 'none'; sandbox" } });
  } catch { return new Response("Not found", { status: 404 }); }
}
