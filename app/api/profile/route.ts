import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { profileSchema } from "@/lib/validations/dashboard";

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = profileSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: parsed.data.parentName,
      phone: parsed.data.phone,
      ...(typeof parsed.data.emailReminders === "boolean"
        ? { emailReminders: parsed.data.emailReminders }
        : {}),
    },
  });

  return NextResponse.json({ ok: true });
}