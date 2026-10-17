"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

export function AdminLogin({ setup = false }: { setup?: boolean }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setBusy(true);
    const fields = new FormData(event.currentTarget);
    const password = String(fields.get("password") || "");
    if (setup && password !== fields.get("confirm")) { setError("The passwords do not match."); setBusy(false); return; }
    try {
      const response = await fetch(`/api/admin/auth/${setup ? "setup" : "login"}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password, key: fields.get("key") }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Sign in failed.");
      window.location.reload();
    } catch (error) { setError(error instanceof Error ? error.message : "Could not connect. Please try again."); setBusy(false); }
  }
  const input = "mt-2 min-h-12 w-full rounded-lg border border-[#d9dee7] bg-white px-3 text-[15px] outline-none focus:border-[#252c39] focus:ring-2 focus:ring-[#252c39]/10";
  return <main className="flex min-h-dvh items-center justify-center bg-[#f6f7f9] px-5 py-10 text-[#202632]">
    <div className="w-full max-w-[440px]"><Link className="mb-8 inline-flex items-center gap-3 text-sm text-[#667085] hover:text-[#202632]" href="/">← Back to portfolio</Link>
      <div className="rounded-2xl border border-[#e0e4eb] bg-white p-7 shadow-[0_12px_40px_#16203a08] sm:p-9">
        <span className="mb-7 inline-flex size-11 items-center justify-center rounded-xl bg-[#202632] font-mono text-sm text-white">AH</span>
        <h1 className="mb-3 text-[28px] leading-tight font-semibold tracking-[-.04em] text-inherit">{setup ? "Set up your editor" : "Welcome back, Amir."}</h1>
        <p className="mb-7 text-sm leading-relaxed text-[#667085]">{setup ? "Create your private admin password. You’ll only need the setup key this once." : "Sign in to update your profile, projects, and experience."}</p>
        <form onSubmit={submit} className="space-y-5">
          {setup && <label className="block text-sm font-medium">Setup key<input required name="key" autoComplete="off" className={input} /><span className="mt-2 block text-xs leading-relaxed font-normal text-[#667085]">Copy the key from <code>.data/setup-key.txt</code> in your project folder. It proves you own this installation.</span></label>}
          <label className="block text-sm font-medium">{setup ? "Create password" : "Password"}<input required name="password" type="password" minLength={setup ? 12 : undefined} maxLength={200} autoComplete={setup ? "new-password" : "current-password"} className={input} />{setup && <span className="mt-2 block text-xs font-normal text-[#667085]">At least 12 characters. A short passphrase works well.</span>}</label>
          {setup && <label className="block text-sm font-medium">Confirm password<input required name="confirm" type="password" minLength={12} maxLength={200} autoComplete="new-password" className={input} /></label>}
          {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button disabled={busy} className="min-h-12 w-full cursor-pointer rounded-lg bg-[#202632] px-5 text-sm font-medium text-white hover:bg-[#343d4f] disabled:opacity-60" type="submit">{busy ? "Please wait…" : setup ? "Create admin account" : "Sign in"}</button>
        </form>
      </div>
    </div>
  </main>;
}
