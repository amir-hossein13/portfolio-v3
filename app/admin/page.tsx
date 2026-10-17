import { Suspense } from "react";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { needsSetup, validSession, sessionCookie } from "@/lib/admin-auth";
import { readPortfolio } from "@/lib/portfolio-store";
import { AdminLogin } from "./login";
import { AdminEditor } from "./editor";

export const metadata = { title: "Portfolio editor — Amir.H Attarnia", robots: { index: false, follow: false } };

async function AdminScreen() {
  await connection();
  const cookie = (await cookies()).get(sessionCookie)?.value;
  if (needsSetup()) return <AdminLogin setup />;
  if (!validSession(cookie)) return <AdminLogin />;
  return <AdminEditor initial={readPortfolio()} />;
}

export default function AdminPage() {
  return <Suspense fallback={<div className="flex min-h-dvh items-center justify-center bg-[#f6f7f9] text-sm text-[#667085]">Opening your editor…</div>}><AdminScreen /></Suspense>;
}
