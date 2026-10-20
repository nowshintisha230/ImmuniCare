import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminAuth } from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE } from "@/lib/session";

export async function getCurrentUser() {
  const sessionCookie = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!sessionCookie) return null;

  let decoded;
  try {
    decoded = await getAdminAuth().verifySessionCookie(sessionCookie, true);
  } catch (error) {
    console.error("verifySessionCookie failed:", error);
    return null;
  }

  const email = decoded.email ?? `${decoded.uid}@no-email.local`;

  try {
    const existing = await prisma.user.findUnique({ where: { firebaseUid: decoded.uid } });
    if (existing) return existing;

    const sameEmail = await prisma.user.findUnique({ where: { email } });
    if (sameEmail) {
      if (!decoded.email_verified) return null;
      return await prisma.user.update({
        where: { id: sameEmail.id },
        data: { firebaseUid: decoded.uid },
      });
    }

    return await prisma.user.create({
      data: { firebaseUid: decoded.uid, email, name: decoded.name ?? null },
    });
  } catch (error) {
    console.error("getCurrentUser database error:", error);
    // another request may have created the row at the same moment
    return prisma.user.findUnique({ where: { firebaseUid: decoded.uid } }).catch(() => null);
  }
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}