import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes, scryptSync } from "node:crypto";
import { DatabaseSync } from "node:sqlite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("portfolio backend: authenticated editing, publishing, uploads, and persistence", { timeout: 90000 }, async t => {
  const directory = await mkdtemp(path.join(tmpdir(), "amir-portfolio-test-"));
  const probe = createServer();
  await new Promise(resolve => probe.listen(0, "127.0.0.1", resolve));
  const port = probe.address().port;
  await new Promise(resolve => probe.close(resolve));
  const origin = `http://127.0.0.1:${port}`;
  let server; let output = ""; let cookie = ""; let document;
  const password = randomBytes(20).toString("hex");

  async function start() {
    server = spawn(process.execPath, [path.join(root, "node_modules/next/dist/bin/next"), "start", "--hostname", "127.0.0.1", "--port", String(port)], { cwd: root, env: { ...process.env, PORTFOLIO_DATA_DIR: directory, PORTFOLIO_ORIGIN: "" }, stdio: ["ignore", "pipe", "pipe"] });
    server.stdout.on("data", bytes => { output += bytes; });
    server.stderr.on("data", bytes => { output += bytes; });
    for (let i = 0; i < 80; i++) {
      try { const response = await fetch(`${origin}/api/portfolio`); if (response.ok) return; } catch {}
      if (server.exitCode !== null) break;
      await new Promise(resolve => setTimeout(resolve, 150));
    }
    throw new Error(`Test server did not become ready: ${output}`);
  }
  async function stop() {
    if (!server || server.exitCode !== null) return;
    const exited = new Promise(resolve => server.once("exit", resolve)); server.kill(); await exited;
  }
  async function request(endpoint, method = "GET", body, authenticated = true, suppliedOrigin = origin) {
    const headers = { Origin: suppliedOrigin };
    if (authenticated && cookie) headers.Cookie = cookie;
    if (body !== undefined) headers["Content-Type"] = "application/json";
    return fetch(`${origin}${endpoint}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  }
  async function save(content = document.content, revision = document.revision) {
    const response = await request("/api/admin/content", "PUT", { content, revision });
    assert.equal(response.status, 200, await response.clone().text());
    document = await response.json(); return document;
  }
  const getPublic = async () => (await request("/api/portfolio", "GET", undefined, false)).json();
  try {
    await start();
    await t.test("personal details are seeded without fake career entries", async () => {
      const data = await getPublic();
      assert.equal(data.firstName, "Amir.H"); assert.equal(data.lastName, "Attarnia"); assert.equal(data.role, "Full Stack Developer");
      assert.equal(data.email, "amirattarnia7@gmail.com"); assert.equal(data.projects.length, 0); assert.equal(data.experience.length, 1);
      assert.equal(data.experience[0].company, "Webino"); assert.equal(data.experience[0].role, "Frontend Developer");
      assert.ok(data.socials.some(link => link.name === "GitHub"));
      assert.equal(data.phone, "+989934904062"); assert.equal(data.whatsapp, "+989934904062");
    });
    await t.test("local installations are unindexed and phone links render on the server", async () => {
      const html = await (await fetch(origin, { headers: { "User-Agent": "Twitterbot" } })).text();
      assert.match(html, /name="robots" content="noindex, nofollow"/);
      assert.ok(html.includes('href="tel:+989934904062"')); assert.ok(html.includes('href="https://wa.me/989934904062"'));
      assert.match(await (await fetch(`${origin}/robots.txt`)).text(), /Disallow: \//);
      assert.ok(!(await (await fetch(`${origin}/sitemap.xml`)).text()).includes("<loc>"));
      assert.match((await fetch(`${origin}/admin`)).headers.get("x-robots-tag"), /noindex/);
    });
    await t.test("private content and writes require sign-in; cross-site writes are rejected", async () => {
      assert.equal((await request("/api/admin/content", "GET", undefined, false)).status, 401);
      assert.equal((await request("/api/admin/content", "PUT", {}, false)).status, 401);
      assert.equal((await request("/api/admin/uploads", "POST", {}, false)).status, 401);
      assert.equal((await request("/api/admin/auth/login", "POST", { password }, false, "https://untrusted.example")).status, 403);
    });
    await t.test("first setup requires the local key; passwords are hashed; cookies are private", async () => {
      assert.equal((await request("/api/admin/auth/setup", "POST", { key: "wrong", password }, false)).status, 403);
      const key = (await readFile(path.join(directory, "setup-key.txt"), "utf8")).trim();
      const response = await request("/api/admin/auth/setup", "POST", { key, password }, false);
      assert.equal(response.status, 200); const header = response.headers.get("set-cookie");
      assert.match(header, /HttpOnly/i); assert.match(header, /SameSite=strict/i); cookie = header.split(";")[0];
      const database = new DatabaseSync(path.join(directory, "portfolio.sqlite"));
      const stored = database.prepare("SELECT value FROM settings WHERE key='admin_password'").get().value;
      assert.notEqual(stored, password); assert.match(stored, /^[a-f0-9]{32}:[a-f0-9]{128}$/);
      assert.equal(database.prepare("SELECT value FROM settings WHERE key='setup_token'").get(), undefined); database.close();
      document = await (await request("/api/admin/content")).json();
      const adminPage = await fetch(`${origin}/admin`, { headers: { Cookie: cookie } });
      assert.equal(adminPage.status, 200); assert.ok((await adminPage.text()).includes("Your portfolio"));
    });
    await t.test("SEO follows saved content and domain with safe JSON-LD and a real sharing image", async () => {
      document.content.profile.siteUrl = "https://portfolio.example";
      document.content.profile.seoTitle = "Amir — Full Stack Portfolio";
      document.content.profile.seoDescription = "Custom portfolio description.";
      document.content.profile.description = "Safe </script><script>test</script> bio";
      await save();
      const html = await (await fetch(origin, { headers: { "User-Agent": "Twitterbot" } })).text();
      assert.ok(html.includes('<title>Amir — Full Stack Portfolio</title>'));
      assert.ok(html.includes('rel="canonical" href="https://portfolio.example/"'));
      assert.match(html, /name="robots" content="index, follow"/);
      assert.ok(html.includes('name="twitter:card" content="summary_large_image"'));
      assert.ok(html.includes('content="Custom portfolio description."'));
      const json = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
      assert.equal(json["@graph"][0].telephone, "+989934904062");
      assert.equal(json["@graph"][0].description, document.content.profile.description);
      assert.ok(json["@graph"][0].sameAs.includes("https://github.com/amir-hossein13/"));
      assert.match(await (await fetch(`${origin}/robots.txt`)).text(), /Sitemap: https:\/\/portfolio.example\/sitemap.xml/);
      const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text();
      assert.ok(sitemap.includes("<loc>https://portfolio.example/</loc>")); assert.ok(!sitemap.includes("/admin"));
      const image = await fetch(`${origin}/opengraph-image`); assert.equal(image.status, 200); assert.match(image.headers.get("content-type"), /image\/png/);
      const png = Buffer.from(await image.arrayBuffer()); assert.equal(png.readUInt32BE(16), 1200); assert.equal(png.readUInt32BE(20), 630);
      const bad = structuredClone(document); bad.content.profile.phone = "not-a-phone"; assert.equal((await request("/api/admin/content", "PUT", bad)).status, 400);
      bad.content.profile.phone = "+989934904062"; bad.content.profile.siteUrl = "https://portfolio.example/some-path"; assert.equal((await request("/api/admin/content", "PUT", bad)).status, 400);
      document.content.profile.description = ""; document.content.profile.siteUrl = ""; document.content.profile.seoTitle = ""; document.content.profile.seoDescription = ""; await save();
    });
    await t.test("draft projects and experience are excluded from public JSON and HTML", async () => {
      document.content.projects.push({ id: "draft-project", title: "PRIVATE DRAFT PROJECT", category: "Projects", tag: "Full stack", image: "", preview: "editorial", description: "A draft.", url: "", published: false });
      document.content.experience.push({ id: "draft-experience", company: "PRIVATE DRAFT EXPERIENCE", role: "Developer", period: "Dates", description: "", url: "", published: false });
      await save(); const data = await getPublic(); assert.equal(data.projects.length, 0); assert.equal(data.experience.length, 1);
      const html = await (await fetch(origin)).text(); assert.ok(!html.includes("PRIVATE DRAFT PROJECT")); assert.ok(!html.includes("PRIVATE DRAFT EXPERIENCE"));
    });
    await t.test("revision conflicts, invalid URLs, and incomplete published records are rejected", async () => {
      assert.equal((await request("/api/admin/content", "PUT", { ...document, revision: document.revision - 1 })).status, 409);
      const unsafe = structuredClone(document); unsafe.content.profile.socials[0].href = "javascript:alert(1)";
      assert.equal((await request("/api/admin/content", "PUT", unsafe)).status, 400);
      const incomplete = structuredClone(document); incomplete.content.projects[0].published = true; incomplete.content.projects[0].title = "";
      assert.equal((await request("/api/admin/content", "PUT", incomplete)).status, 400);
      assert.equal((await request("/api/admin/content", "PUT", { content: "x".repeat(300000), revision: 1 })).status, 413);
    });
    let uploaded;
    await t.test("image uploads are authenticated, validated, and served after saving", async () => {
      const bytes = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aY4sAAAAASUVORK5CYII=", "base64");
      const form = new FormData(); form.set("file", new Blob([bytes], { type: "image/png" }), "cover.png");
      const response = await fetch(`${origin}/api/admin/uploads`, { method: "POST", headers: { Cookie: cookie, Origin: origin }, body: form });
      assert.equal(response.status, 201, await response.clone().text()); uploaded = (await response.json()).url;
      const media = await fetch(origin + uploaded); assert.equal(media.status, 200); assert.equal(media.headers.get("content-type"), "image/png"); assert.equal(media.headers.get("x-content-type-options"), "nosniff"); assert.deepEqual(Buffer.from(await media.arrayBuffer()), bytes);
      const invalid = new FormData(); invalid.set("file", new Blob(["<svg><script>alert(1)</script></svg>"], { type: "image/svg+xml" }), "unsafe.svg");
      assert.equal((await fetch(`${origin}/api/admin/uploads`, { method: "POST", headers: { Cookie: cookie, Origin: origin }, body: invalid })).status, 415);
      assert.equal((await fetch(`${origin}/api/media/portfolio.sqlite`)).status, 404);
    });
    await t.test("publishing and ordering update the public page immediately", async () => {
      document.content.profile.description = "Backend persistence verified.";
      document.content.projects[0] = { ...document.content.projects[0], title: "Published project", image: uploaded, url: "https://example.com/", published: true };
      document.content.projects.push({ ...document.content.projects[0], id: "second-project", title: "Second published project" });
      document.content.projects.reverse(); await save();
      const data = await getPublic(); assert.equal(data.projects.length, 2); assert.equal(data.projects[0].id, "second-project"); assert.equal(data.navigation[0].count, "2"); assert.equal(data.description, "Backend persistence verified.");
      const html = await (await fetch(origin)).text(); assert.ok(html.includes("Backend persistence verified.")); assert.ok(html.includes("Published project"));
    });
    await t.test("content, image files, and sessions survive a server restart", async () => {
      await stop(); await start();
      const response = await request("/api/admin/content"); assert.equal(response.status, 200); const stored = await response.json();
      assert.equal(stored.revision, document.revision); assert.equal(stored.content.profile.description, "Backend persistence verified.");
      assert.equal((await fetch(origin + uploaded)).status, 200);
    });
    await t.test("expired sessions and signed-out sessions cannot edit", async () => {
      const logout = await request("/api/admin/auth/logout", "POST"); assert.equal(logout.status, 200);
      assert.equal((await request("/api/admin/content")).status, 401);
      const login = await request("/api/admin/auth/login", "POST", { password }, false); assert.equal(login.status, 200); cookie = login.headers.get("set-cookie").split(";")[0];
      const database = new DatabaseSync(path.join(directory, "portfolio.sqlite")); database.prepare("UPDATE sessions SET expires_at=0").run(); database.close();
      assert.equal((await request("/api/admin/content")).status, 401);
    });
    await t.test("repeated incorrect login attempts are rate limited", async () => {
      for (let i = 0; i < 8; i++) assert.equal((await request("/api/admin/auth/login", "POST", { password: "incorrect" }, false)).status, 401);
      assert.equal((await request("/api/admin/auth/login", "POST", { password: "incorrect" }, false)).status, 429);
    });
    assert.doesNotMatch(output, /Error: Route.*encountered/);
  } finally {
    await stop();
    if (process.env.PORTFOLIO_KEEP_TEST_DATA === "1") {
      // Disposable local QA credentials only; never applied to the real portfolio.
      const database = new DatabaseSync(path.join(directory, "portfolio.sqlite")); const salt = randomBytes(16).toString("hex");
      database.prepare("UPDATE settings SET value=? WHERE key='admin_password'").run(`${salt}:${scryptSync("Visual-preview-only-2026", salt, 64).toString("hex")}`);
      database.exec("DELETE FROM login_attempts; DELETE FROM sessions;"); database.close();
      console.log(`Disposable QA data: ${directory}`);
    } else {
      assert.equal(path.dirname(directory), path.resolve(tmpdir())); assert.ok(path.basename(directory).startsWith("amir-portfolio-test-"));
      await rm(directory, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
    }
  }
});
