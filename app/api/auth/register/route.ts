import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";
import { attachSessionCookie } from "@/lib/session";
import { checkRecords } from "@/lib/vaccination/records";
import { startOfTodayDhaka, toDateKey } from "@/lib/vaccination/status";
import { registerProfileSchema } from "@/lib/validations/auth";
import { recordsSchema } from "@/lib/validations/records";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const idToken = body?.idToken;
    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json({ error: "idToken required" }, { status: 400 });
    }

    const parsed = registerProfileSchema.safeParse(body);
    const records = recordsSchema.safeParse(body?.records);
    if (!parsed.success || !records.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    const data = parsed.data;

    if (checkRecords(data.dateOfBirth, records.data, toDateKey(startOfTodayDhaka()))) {
      return NextResponse.json({ error: "Invalid records" }, { status: 400 });
    }

    const decoded = await getAdminAuth().verifyIdToken(idToken);

    await prisma.user.upsert({
      where: { firebaseUid: decoded.uid },
      update: { name: data.parentName, phone: data.phone },
      create: {
        firebaseUid: decoded.uid,
        email: decoded.email ?? data.email,
        name: data.parentName,
        phone: data.phone,
        children: {
          create: {
            name: data.childName,
            dateOfBirth: new Date(data.dateOfBirth),
            sex: data.sex,
            records: {
              create: records.data.map((r) => ({
                doseCode: r.doseCode,
                givenAt: new Date(r.givenAt),
              })),
            },
          },
        },
      },
    });

    return await attachSessionCookie(NextResponse.json({ ok: true }), idToken);
  } catch (error) {
    console.error("register error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}