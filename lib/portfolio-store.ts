import "server-only";
import { DatabaseSync } from "node:sqlite";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { randomBytes, createHash } from "node:crypto";
import { initialContent } from "./portfolio-defaults";
import { ContentError, type PortfolioDocument, type PortfolioContent } from "./portfolio-model";

// Mutable runtime data is kept outside the deployment bundle.
export const dataDirectory = path.resolve(/* turbopackIgnore: true */ process.env.PORTFOLIO_DATA_DIR || path.join(process.cwd(), ".data"));
let database: DatabaseSync | undefined;
export const digest = (value: string) => createHash("sha256").update(value).digest("hex");

export function db() {
  if (database) return database;
  mkdirSync(dataDirectory, { recursive: true, mode: 0o700 });
  const connection = new DatabaseSync(path.join(dataDirectory, "portfolio.sqlite"));
  connection.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS content (id INTEGER PRIMARY KEY CHECK(id=1), value TEXT NOT NULL, revision INTEGER NOT NULL, updated_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, expires_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS login_attempts (key TEXT PRIMARY KEY, attempts INTEGER NOT NULL, reset_at INTEGER NOT NULL);`);
  connection.prepare("INSERT OR IGNORE INTO content VALUES(1, ?, 1, ?)").run(JSON.stringify(initialContent), new Date().toISOString());
  const admin = connection.prepare("SELECT value FROM settings WHERE key='admin_password'").get();
  const setup = connection.prepare("SELECT value FROM settings WHERE key='setup_token'").get();
  if (!admin && !setup) {
    const token = randomBytes(24).toString("hex");
    connection.prepare("INSERT INTO settings(key,value) VALUES('setup_token',?)").run(digest(token));
    writeFileSync(path.join(dataDirectory, "setup-key.txt"), token + "\n", { mode: 0o600 });
  }
  database = connection;
  return connection;
}

export function readPortfolio(): PortfolioDocument {
  const row = db().prepare("SELECT value, revision, updated_at FROM content WHERE id=1").get() as {value: string; revision: number; updated_at: string};
  const content = JSON.parse(row.value) as PortfolioContent;
  content.profile = Object.assign({ phone: "", whatsapp: "", siteUrl: "", seoTitle: "", seoDescription: "" }, content.profile);
  return { content, revision: row.revision, updatedAt: row.updated_at };
}

export function savePortfolio(content: PortfolioContent, revision: number): PortfolioDocument {
  const updatedAt = new Date().toISOString();
  const result = db().prepare("UPDATE content SET value=?, revision=revision+1, updated_at=? WHERE id=1 AND revision=?").run(JSON.stringify(content), updatedAt, revision);
  if (!result.changes) throw new ContentError("This portfolio was changed in another tab. Reload the latest version before saving; your current edits are still here.", 409);
  return { content, revision: revision + 1, updatedAt };
}
