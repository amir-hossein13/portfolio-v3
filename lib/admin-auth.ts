import "server-only";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { db, digest } from "./portfolio-store";
import { ContentError } from "./portfolio-model";

export const sessionCookie = "portfolio_admin";
export const sessionAge = 60 * 60 * 24 * 7;

export function needsSetup() { return !db().prepare("SELECT value FROM settings WHERE key='admin_password'").get(); }

export function validSession(token?: string) {
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return false;
  return Boolean(db().prepare("SELECT 1 FROM sessions WHERE token_hash=? AND expires_at>?").get(digest(token), Date.now()));
}

export function requireSession(token?: string) {
  if (!validSession(token)) throw new ContentError("Your session has expired. Sign in again; your unsaved edits are still here.", 401);
}

function checkAttempts() {
  const row = db().prepare("SELECT attempts,reset_at FROM login_attempts WHERE key='admin'").get() as {attempts: number; reset_at: number} | undefined;
  if (row && row.reset_at > Date.now() && row.attempts >= 8) throw new ContentError("Too many attempts. Try again in 15 minutes.", 429);
  db().prepare("INSERT INTO login_attempts VALUES('admin',1,?) ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN reset_at<=? THEN 1 ELSE attempts+1 END, reset_at=CASE WHEN reset_at<=? THEN excluded.reset_at ELSE reset_at END").run(Date.now() + 15 * 60 * 1000, Date.now(), Date.now());
}

function makeSession() {
  const token = randomBytes(32).toString("hex");
  db().prepare("DELETE FROM sessions WHERE expires_at<=?").run(Date.now());
  db().prepare("INSERT INTO sessions VALUES(?,?)").run(digest(token), Date.now() + sessionAge * 1000);
  db().prepare("DELETE FROM login_attempts WHERE key='admin'").run();
  return token;
}

export function setupAdmin(key: string, password: string) {
  checkAttempts();
  if (!needsSetup()) throw new ContentError("An administrator already exists. Sign in instead.", 409);
  const stored = db().prepare("SELECT value FROM settings WHERE key='setup_token'").get() as {value: string} | undefined;
  if (!stored || !timingSafeEqual(Buffer.from(digest(key)), Buffer.from(stored.value))) throw new ContentError("The setup key is incorrect.", 403);
  if (password.length < 12 || password.length > 200) throw new ContentError("Use a password between 12 and 200 characters.");
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  db().exec("BEGIN IMMEDIATE");
  try {
    // Re-check inside the transaction so first setup cannot be claimed twice.
    if (!needsSetup()) throw new ContentError("An administrator already exists.", 409);
    db().prepare("INSERT INTO settings VALUES('admin_password',?)").run(`${salt}:${hash}`);
    db().prepare("DELETE FROM settings WHERE key='setup_token'").run();
    db().exec("COMMIT");
  } catch (error) { db().exec("ROLLBACK"); throw error; }
  return makeSession();
}

export function loginAdmin(password: string) {
  checkAttempts();
  const stored = db().prepare("SELECT value FROM settings WHERE key='admin_password'").get() as {value: string} | undefined;
  // Run scrypt even before setup to keep failure behavior consistent.
  const [salt, expected] = stored?.value.split(":") || ["unconfigured", "00".repeat(64)];
  const actual = scryptSync(password, salt, 64);
  if (!stored || !timingSafeEqual(actual, Buffer.from(expected, "hex"))) throw new ContentError("The password is incorrect.", 401);
  return makeSession();
}

export function logoutAdmin(token?: string) {
  if (token) db().prepare("DELETE FROM sessions WHERE token_hash=?").run(digest(token));
}
