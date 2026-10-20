import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getDashboardData } from "@/lib/dashboard/data";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json(await getDashboardData(user), {
    headers: { "Cache-Control": "no-store" },
  });
}