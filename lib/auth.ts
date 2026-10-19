import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  const sessionCookie = (await cookies()).get("session")?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);

    return await prisma.user.upsert({
      where: { firebaseUid: decoded.uid },
      update: {},
      create: {
        firebaseUid: decoded.uid,
        email: decoded.email ?? `${decoded.uid}@no-email.local`,
        name: decoded.name ?? null,
      },
    });
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}