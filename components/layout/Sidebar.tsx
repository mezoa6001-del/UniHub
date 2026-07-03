"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/firebase/auth";
import { useAuth } from "@/hooks/useAuth";
import { initials } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { href: "/",                icon: "🏠", label: "Dashboard"       },
  { href: "/qbank",           icon: "📝", label: "Question Bank"   },
  { href: "/flashcards",      icon: "⚡", label: "Flashcards"      },
  { href: "/videos",          icon: "🎥", label: "Videos"          },
  { href: "/analytics",       icon: "📊", label: "Analytics"       },
  { href: "/leaderboard",     icon: "🏆", label: "Leaderboard"     },
  { href: "/bookmarks",       icon: "🔖", label: "Bookmarks"       },
  { href: "/wrong-questions", icon: "❌", label: "Wrong Questions" },
  { href: "/subscription",    icon: "💳", label: "Subscription"    },
];

const ADMIN_ITEMS = [
  { href: "/admin",            icon: "🛡️", label: "Admin Overview" },
  { href: "/admin/questions",  icon: "📝", label: "Questions"      },
  { href: "/admin/chapters",   icon: "📚", label: "Chapters"       },
  { href: "/admin/flashcards", icon: "⚡", label: "Flashcards"     },
  { href: "/admin/videos",     icon: "🎥", label: "Videos"         },
  { href: "/admin/users",      icon: "👥", label: "Users"          },
];

export function Sidebar() {
  const pathname = usePathname();
  const { profile, sub, isAdmin } = useAuth();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside className="w-[230px] bg-navy fixed top-0 left-0 h-screen z-50 flex flex-col border-r border-white/6">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-secondary flex items-center justify-center text-lg">💊</div>
          <div>
            <p className="text-[17px] font-extrabold text-white leading-none">Pharma Core</p>
            <p className="text-[9px] text-secondary font-bold tracking-[2px] uppercase mt-0.5">Dr. Mazen Ashraf</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all",
              isActive(item.href)
                ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}>
            <span className="text-base w-5 text-center">{item.icon}</span>
            {item.label}
          </Link>
        ))}

        {isAdmin && (
          <>
            <div className="pt-3 pb-1 px-3">
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Admin</p>
            </div>
            {ADMIN_ITEMS.map((item) => (
              <Link key={item.href} href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all",
                  isActive(item.href)
                    ? "bg-navy-light text-white font-semibold"
                    : "text-slate-500 hover:text-white hover:bg-white/5"
                )}>
                <span className="text-base w-5 text-center">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </>
        )}
      </nav>

      {/* User card */}
      <div className="px-3 py-3 border-t border-white/6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary flex items-center justify-center text-[11px] font-bold text-white shrink-0">
            {initials(profile?.displayName ?? "PC")}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[12px] font-semibold truncate">{profile?.displayName ?? "Loading…"}</p>
            <p className={cn("text-[10px] font-semibold", sub?.isActive ? "text-secondary" : "text-red-400")}>
              {sub?.isActive ? "✓ Active" : "No subscription"}
            </p>
          </div>
          <button onClick={() => logout()} title="Sign out"
            className="text-slate-500 hover:text-slate-300 text-lg transition-colors p-1">↩</button>
        </div>
      </div>
    </aside>
  );
}
