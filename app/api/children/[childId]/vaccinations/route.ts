import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfTodayDhaka } from "@/lib/vaccination/status";
import { markDoseSchema } from "@/lib/validations/dashboard";

type Ctx = { params: Promise<{ childId: string }> };

export async function POST(req: Request, { params }: Ctx) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { childId } = await params;
  const child = await prisma.child.findFirst({ where: { id: childId, parentId: user.id } });
  if (!child) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const parsed = markDoseSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const today = startOfTodayDhaka();
  const givenAt = parsed.data.givenAt ? new Date(parsed.data.givenAt) : today;

  if (Number.isNaN(givenAt.getTime()) || givenAt > today || givenAt < child.dateOfBirth) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  const { doseCode } = parsed.data;
  await prisma.vaccinationRecord.upsert({
    where: { childId_doseCode: { childId, doseCode } },
    update: { givenAt },
    create: { childId, doseCode, givenAt },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, { params }: Ctx) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { childId } = await params;
  const doseCode = new URL(req.url).searchParams.get("doseCode");
  if (!doseCode) return NextResponse.json({ error: "doseCode required" }, { status: 400 });

  const child = await prisma.child.findFirst({ where: { id: childId, parentId: user.id } });
  if (!child) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.vaccinationRecord.deleteMany({ where: { childId, doseCode } });
  return NextResponse.json({ ok: true });
}