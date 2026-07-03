"use client";
import { useEffect, useState } from "react";
import { onSnapshot, collection, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { updateUserProfile } from "@/lib/firebase/firestore";
import { Badge, EmptyState, Spinner, Toast } from "@/components/ui";
import { initials } from "@/lib/utils/formatters";
import type { UserDoc } from "@/types";

export default function AdminUsersPage() {
  const [users,   setUsers]   = useState<UserDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast,   setToast]   = useState<{ msg: string; type: "success"|"error" } | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, "users"), orderBy("createdAt", "desc"), limit(100)),
      (snap) => { setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as UserDoc))); setLoading(false); }
    );
    return unsub;
  }, []);

  const makeAdmin = async (uid: string) => {
    await updateUserProfile(uid, { role: "admin" });
    setToast({ msg: "User promoted to admin", type: "success" });
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size={40} /></div>;

  return (
    <div className="space-y-5">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <div className="bg-navy-card rounded-2xl border border-white/8 overflow-hidden">
        <div className="px-5 py-3 border-b border-white/8 flex justify-between items-center">
          <span className="font-bold text-white text-sm">All Users</span>
          <span className="text-xs text-slate-400">{users.length} total</span>
        </div>
        {users.length === 0
          ? <EmptyState icon="👥" title="No users yet" desc="Users appear here after they register" />
          : users.map((u) => (
            <div key={(u as any).id} className="px-5 py-3.5 border-b border-white/5 last:border-0 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-secondary flex items-center justify-center text-[11px] font-extrabold text-white shrink-0">
                {initials(u.displayName ?? u.email ?? "U")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{u.displayName ?? "–"}</p>
                <p className="text-xs text-slate-400">{u.email} · {u.questionsAnswered ?? 0} Qs · {u.role}</p>
              </div>
              <Badge color={u.role === "admin" || u.role === "superadmin" ? "#EF4444" : "#2FA084"}>{u.role}</Badge>
              {u.role === "student" && (
                <button onClick={() => makeAdmin((u as any).id)}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-lg text-primary-400 border border-primary-500/30 shrink-0">
                  Make Admin
                </button>
              )}
            </div>
          ))
        }
      </div>
    </div>
  );
}
