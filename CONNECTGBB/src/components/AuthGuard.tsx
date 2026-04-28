"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ROLE_DASHBOARD_PATH, type RoleKey } from "@/lib/roles";
import { useAuth } from "@/components/AuthProvider";

const roleFallback: Record<RoleKey, string> = {
  player: "Player",
  parent: "Parent",
  coach: "Coach",
  organizer: "Organizer",
  admin: "Admin",
};

type AuthGuardProps = {
  allowedRoles: RoleKey[];
  children: React.ReactNode;
};

export default function AuthGuard({ allowedRoles, children }: AuthGuardProps) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user && pathname !== "/login") {
      router.replace("/login");
      return;
    }

    if (user && !profile && pathname !== "/onboarding") {
      router.replace("/onboarding");
      return;
    }

    if (profile && !allowedRoles.includes(profile.role)) {
      router.replace(ROLE_DASHBOARD_PATH[profile.role]);
    }
  }, [allowedRoles, loading, pathname, profile, router, user]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-6 text-sm text-white/70">
        Loading member session...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-6 text-sm text-white/70">
        <p>Redirecting to login...</p>
        <Link href="/login" className="mt-3 inline-flex text-sm font-semibold text-[#fb6c1d]">
          Go to login
        </Link>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-6 text-sm text-white/70">
        <p>Complete onboarding to access this area.</p>
        <Link href="/onboarding" className="mt-3 inline-flex text-sm font-semibold text-[#fb6c1d]">
          Start onboarding
        </Link>
      </div>
    );
  }

  if (!allowedRoles.includes(profile.role)) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-6 text-sm text-white/70">
        <p>
          This area is reserved for {allowedRoles.map((role) => roleFallback[role]).join(", ")}
          .
        </p>
        <Link
          href={ROLE_DASHBOARD_PATH[profile.role]}
          className="mt-3 inline-flex text-sm font-semibold text-[#fb6c1d]"
        >
          Go to your dashboard
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
