import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { auth } from "./config";
import { createUserProfile, getUserProfile } from "./firestore";

export async function signInWithEmail(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const prof = await getUserProfile(cred.user.uid);
  if (!prof) {
    await createUserProfile(cred.user.uid, {
      email,
      displayName: cred.user.displayName ?? email.split("@")[0],
    });
  }
  return cred;
}

export async function signUpWithEmail(email: string, password: string, displayName: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName });
  await createUserProfile(cred.user.uid, { email, displayName });
  return cred;
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  const prof = await getUserProfile(cred.user.uid);
  if (!prof) {
    await createUserProfile(cred.user.uid, {
      email: cred.user.email ?? "",
      displayName: cred.user.displayName ?? "Student",
      photoURL: cred.user.photoURL ?? null,
    });
  }
  return cred;
}

export async function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email);
}

export async function logout() {
  return signOut(auth);
}

export function onAuthChange(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, cb);
}
