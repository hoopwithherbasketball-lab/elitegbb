"use client";

import { useState } from "react";
import { EmptyState, StatusBadge } from "@/components/ui";

export interface ConnectionItem {
  id: string;
  coachName: string;
  org: string;
  message: string;
}

interface ConnectionsTabsClientProps {
  requests: ConnectionItem[];
  connected: ConnectionItem[];
  pending: ConnectionItem[];
  underReview: boolean;
  needsParentApproval: boolean;
}

export function ConnectionsTabsClient({ requests, connected, pending, underReview, needsParentApproval }: ConnectionsTabsClientProps) {
  const [tab, setTab] = useState<"requests" | "connected" | "pending">("requests");

  const items = tab === "requests" ? requests : tab === "connected" ? connected : pending;

  return (
    <div className="space-y-4">
      {needsParentApproval ? (
        <div className="rounded-lg border border-white/15 bg-black/40 p-4 text-sm text-white/80">Parent approval is required for athletes under 18 before connections become active.</div>
      ) : null}
      {underReview ? (
        <div className="rounded-lg border border-[var(--brand-secondary)]/50 bg-[var(--brand-secondary)]/10 p-4 text-sm text-white/85">One or more connections is under moderator review.</div>
      ) : null}

      <div className="flex gap-2">
        {([
          { id: "requests", label: "Requests" },
          { id: "connected", label: "Connected" },
          { id: "pending", label: "Pending" },
        ] as const).map((item) => (
          <button key={item.id} type="button" onClick={() => setTab(item.id)} className={`rounded-full px-3 py-1.5 text-sm ${tab === item.id ? "bg-[var(--brand-primary)] text-white" : "border border-white/20 text-white/80"}`}>
            {item.label}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <EmptyState title={`No ${tab} connections`} description="As you engage with coaches, activity will appear here." />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <article key={item.id} className="rounded-xl border border-white/10 bg-[var(--surface)] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-white">{item.coachName}</h3>
                  <p className="text-xs text-white/60">{item.org}</p>
                </div>
                <StatusBadge variant={tab === "connected" ? "active" : "pending"} />
              </div>
              <p className="mt-2 text-sm text-white/75">{item.message}</p>
              <div className="mt-3 flex gap-2">
                {tab === "requests" ? (
                  <>
                    <button type="button" className="rounded-md bg-[var(--brand-primary)] px-3 py-1.5 text-xs font-semibold text-white">Approve</button>
                    <button type="button" className="rounded-md border border-white/20 px-3 py-1.5 text-xs text-white/80">Decline</button>
                  </>
                ) : null}
                {tab === "connected" ? <button type="button" className="rounded-md bg-[var(--brand-primary)] px-3 py-1.5 text-xs font-semibold text-white">Message</button> : null}
                {tab === "pending" ? <button type="button" className="rounded-md border border-white/20 px-3 py-1.5 text-xs text-white/80">Cancel request</button> : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
