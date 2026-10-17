import { NextResponse, connection } from "next/server";
import { readPortfolio } from "@/lib/portfolio-store";
import { publicPortfolio } from "@/lib/portfolio-model";

export async function GET() {
  await connection();
  return NextResponse.json(publicPortfolio(readPortfolio().content), { headers: { "Cache-Control": "no-store" } });
}
