import { connection, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { feedbackSchema } from "@/lib/validations/feedback";

export async function GET() {
  await connection();
  const items = await prisma.feedback.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
    take: 6,
    select: { id: true, name: true, rating: true, message: true },
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  try {
    const parsed = feedbackSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    const user = await getCurrentUser();
    await prisma.feedback.create({
      data: { ...parsed.data, userId: user?.id ?? null },
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}