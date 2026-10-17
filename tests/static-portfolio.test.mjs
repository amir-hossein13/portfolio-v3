import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { portfolioContent } from "../lib/portfolio-data.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const urls = ["https://standup-io.vercel.app/", "https://omdehforoosh.com/", "https://hatef-project-v2.vercel.app/", "https://khoodro24.com/"];

test("the static object contains the requested projects and bundled covers", async () => {
  assert.deepEqual(portfolioContent.projects.map(p => p.url), urls);
  assert.equal(new Set(portfolioContent.projects.map(p => p.id)).size, 4);
  for (const project of portfolioContent.projects) {
    assert.equal(project.published, true);
    assert.ok(project.title && project.description);
    assert.match(project.image, /^\/projects\//);
    assert.ok((await stat(path.join(root, "public", project.image))).size > 1000);
  }
  assert.equal(portfolioContent.profile.phone, "+989934904062");
  assert.equal(portfolioContent.profile.whatsapp, "+989934904062");
  assert.equal(portfolioContent.experience[0].period, "Oct 2025 – Jan 2026");
});

test("the production portfolio renders with no database or writable data directory", { timeout: 30000 }, async () => {
  const probe = createServer();
  await new Promise(resolve => probe.listen(0, "127.0.0.1", resolve));
  const port = probe.address().port;
  await new Promise(resolve => probe.close(resolve));
  const origin = `http://127.0.0.1:${port}`;
  // A file cannot be used as a directory. Any attempted old storage initialization would fail.
  const server = spawn(process.execPath, [path.join(root, "node_modules/next/dist/bin/next"), "start", "--hostname", "127.0.0.1", "--port", String(port)], {
    cwd: root, env: { ...process.env, PORTFOLIO_DATA_DIR: path.join(root, "package.json") }, stdio: ["ignore", "pipe", "pipe"],
  });
  let logs = "";
  server.stdout.on("data", bytes => { logs += bytes; }); server.stderr.on("data", bytes => { logs += bytes; });
  try {
    let response;
    for (let attempt = 0; attempt < 60; attempt++) {
      try { response = await fetch(origin); if (response.ok) break; } catch {}
      if (server.exitCode !== null) throw new Error(logs);
      await new Promise(resolve => setTimeout(resolve, 150));
    }
    assert.equal(response?.status, 200, logs);
    const html = await response.text();
    for (const project of portfolioContent.projects) { assert.ok(html.includes(project.title)); assert.ok(html.includes(project.url)); }
    assert.ok(html.includes('href="tel:+989934904062"'));
    assert.ok(html.includes('href="https://wa.me/989934904062"'));
    assert.ok(html.includes("application/ld+json"));
    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    assert.equal(schema["@graph"][0].telephone, "+989934904062");
    assert.ok(html.includes("summary_large_image"));
    for (const project of portfolioContent.projects) {
      const image = await fetch(origin + project.image); assert.equal(image.status, 200); assert.match(image.headers.get("content-type"), /image\//);
    }
    for (const route of ["/admin", "/api/portfolio", "/api/admin/content", "/api/media/6df01ba9ee95cc0909e0b8fdfadbc5a1.jpg"]) assert.equal((await fetch(origin + route)).status, 404);
    assert.equal((await fetch(`${origin}/api/admin/auth/setup`, { method: "POST" })).status, 404);
    const sitemap = await fetch(`${origin}/sitemap.xml`); assert.equal(sitemap.status, 200);
    const robots = await fetch(`${origin}/robots.txt`); assert.equal(robots.status, 200);
    const image = await fetch(`${origin}/opengraph-image`); assert.equal(image.status, 200); assert.match(image.headers.get("content-type"), /image\/png/);
    const png = Buffer.from(await image.arrayBuffer()); assert.equal(png.readUInt32BE(16), 1200); assert.equal(png.readUInt32BE(20), 630);
    const prerenders = JSON.parse(await readFile(path.join(root, ".next/prerender-manifest.json"), "utf8"));
    assert.ok(prerenders.routes["/"], "Homepage must be prerendered, not dependent on a runtime database.");
    assert.doesNotMatch(logs, /SQLITE|EROFS|EACCES|Error: Route/);
  } finally {
    if (server.exitCode === null) { const exited = new Promise(resolve => server.once("exit", resolve)); server.kill(); await exited; }
  }
});
