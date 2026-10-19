"use client";

import {
  createUserWithEmailAndPassword,
  deleteUser,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase-client";
import type { TranslationKey } from "@/lib/i18n/dictionary";
import type { LoginInput, RegisterInput } from "@/lib/validations/auth";

async function createServerSession(idToken: string) {
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) throw new Error("session-failed");
}

export async function registerWithEmail(input: RegisterInput) {
  const { password, ...profile } = input;
  const cred = await createUserWithEmailAndPassword(firebaseAuth, profile.email, password);

  try {
    await updateProfile(cred.user, { displayName: profile.parentName });
    const idToken = await cred.user.getIdToken(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...profile, idToken }),
    });
    if (!res.ok) throw new Error("register-failed");
  } catch (error) {
    // roll back so the email is not left half-registered
    await deleteUser(cred.user).catch(() => {});
    throw error;
  }
}

export async function loginWithEmail({ email, password }: LoginInput) {
  const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);
  await createServerSession(await cred.user.getIdToken());
}

export async function loginWithGoogle() {
  const cred = await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
  await createServerSession(await cred.user.getIdToken());
}

export async function logout() {
  await fetch("/api/auth/session", { method: "DELETE" });
  await signOut(firebaseAuth);
}

export function getAuthErrorKey(error: unknown): TranslationKey {
  const code = (error as { code?: string })?.code;
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "error.invalidCredentials";
    case "auth/email-already-in-use":
      return "error.emailInUse";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "error.popupClosed";
    case "auth/network-request-failed":
      return "error.network";
    default:
      return "error.generic";
  }
}