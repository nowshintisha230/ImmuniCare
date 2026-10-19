"use client";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase-client";

async function createServerSession(idToken: string) {
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) throw new Error("Failed to create session");
}

export async function registerWithEmail(name: string, email: string, password: string) {
  const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
  await updateProfile(cred.user, { displayName: name });
  await createServerSession(await cred.user.getIdToken(true));
}

export async function loginWithEmail(email: string, password: string) {
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