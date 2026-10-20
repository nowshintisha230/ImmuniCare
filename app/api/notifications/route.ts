import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getDashboardData } from "@/lib/dashboard/data";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { notifications } = await getDashboardData(user);
  return NextResponse.json({ notifications }, { headers: { "Cache-Control": "no-store" } });
}