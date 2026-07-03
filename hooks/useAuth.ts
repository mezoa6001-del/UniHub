"use client";
import { useState, useEffect } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { subscribeToUserProfile, subscribeToSubscription } from "@/lib/firebase/firestore";
import type { UserDoc, SubscriptionDoc } from "@/types";

export interface AuthState {
  user:        User | null;
  profile:     UserDoc | null;
  sub:         (SubscriptionDoc & { isActive: boolean }) | null;
  loading:     boolean;
  isSubscribed: boolean;
  isAdmin:     boolean;
  isSuperAdmin: boolean;
}

export function useAuth(): AuthState {
  const [user,    setUser]    = useState<User | null | undefined>(undefined);
  const [profile, setProfile] = useState<UserDoc | null>(null);
  const [sub,     setSub]     = useState<(SubscriptionDoc & { isActive: boolean }) | null>(null);

  useEffect(() => {
    let unsubProfile: (() => void) | null = null;
    let unsubSub:     (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, (fbUser) => {
      setUser(fbUser);
      unsubProfile?.();
      unsubSub?.();

      if (!fbUser) { setProfile(null); setSub(null); return; }

      unsubProfile = subscribeToUserProfile(fbUser.uid, setProfile);
      unsubSub     = subscribeToSubscription(fbUser.uid, setSub);
    });

    return () => {
      unsubAuth();
      unsubProfile?.();
      unsubSub?.();
    };
  }, []);

  const loading     = user === undefined;
  const isSubscribed = sub?.isActive === true || profile?.role === "admin" || profile?.role === "superadmin";
  const isAdmin      = profile?.role === "admin" || profile?.role === "superadmin";
  const isSuperAdmin = profile?.role === "superadmin";

  return { user: user ?? null, profile, sub, loading, isSubscribed, isAdmin, isSuperAdmin };
}
