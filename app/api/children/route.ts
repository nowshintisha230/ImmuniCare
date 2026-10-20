import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRecords } from "@/lib/vaccination/records";
import { startOfTodayDhaka, toDateKey } from "@/lib/vaccination/status";
import { childSchema } from "@/lib/validations/dashboard";
import { recordsSchema } from "@/lib/validations/records";

const MAX_CHILDREN = 10;

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = childSchema.safeParse(body);
  const records = recordsSchema.safeParse(body?.records);
  if (!parsed.success || !records.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  if (checkRecords(parsed.data.dateOfBirth, records.data, toDateKey(startOfTodayDhaka()))) {
    return NextResponse.json({ error: "Invalid records" }, { status: 400 });
  }

  const count = await prisma.child.count({ where: { parentId: user.id } });
  if (count >= MAX_CHILDREN) return NextResponse.json({ error: "limit" }, { status: 400 });

  const child = await prisma.child.create({
    data: {
      name: parsed.data.childName,
      dateOfBirth: new Date(parsed.data.dateOfBirth),
      sex: parsed.data.sex,
      parentId: user.id,
      records: {
        create: records.data.map((r) => ({ doseCode: r.doseCode, givenAt: new Date(r.givenAt) })),
      },
    },
  });

  return NextResponse.json({ id: child.id }, { status: 201 });
}