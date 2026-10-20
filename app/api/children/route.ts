import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { childSchema } from "@/lib/validations/dashboard";

const MAX_CHILDREN = 10;

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = childSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const count = await prisma.child.count({ where: { parentId: user.id } });
  if (count >= MAX_CHILDREN) return NextResponse.json({ error: "limit" }, { status: 400 });

  const child = await prisma.child.create({
    data: {
      name: parsed.data.childName,
      dateOfBirth: new Date(parsed.data.dateOfBirth),
      sex: parsed.data.sex,
      parentId: user.id,
    },
  });

  return NextResponse.json({ id: child.id }, { status: 201 });
}