"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ProfileAvatar, SearchBar } from "@/components/ui";
import type { CoachConversation } from "@/lib/adapters/coach";

interface MessagesWorkspaceClientProps {
  conversations: CoachConversation[];
}

export function MessagesWorkspaceClient({ conversations }: MessagesWorkspaceClientProps) {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string>(conversations[0]?.id ?? "");
  const [draft, setDraft] = useState("");

  const filtered = useMemo(
    () => conversations.filter((conversation) => conversation.playerName.toLowerCase().includes(query.toLowerCase())),
    [conversations, query]
  );
  const active = filtered.find((conversation) => conversation.id === activeId) ?? filtered[0] ?? null;

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      <aside className="rounded-xl border border-white/10 bg-[var(--surface)] p-4">
        <SearchBar value={query} onChange={setQuery} placeholder="Search conversations" />
        <div className="mt-3 space-y-2">
          {filtered.map((conversation) => (
            <button key={conversation.id} onClick={() => setActiveId(conversation.id)} className={`flex w-full items-center justify-between rounded-md px-2 py-2 text-left ${active?.id === conversation.id ? "bg-white/10" : "hover:bg-white/5"}`}>
              <div className="flex items-center gap-2"><ProfileAvatar initials={conversation.initials} size="sm" /><div><p className="text-sm text-white">{conversation.playerName}</p><p className="text-xs text-white/60">{conversation.lastPreview}</p></div></div>
              <div className="text-right text-xs text-white/60">{conversation.timestamp}{conversation.unread > 0 ? <span className="ml-1 rounded-full bg-[var(--brand-primary)] px-2 py-0.5 text-[10px] text-white">{conversation.unread}</span> : null}</div>
            </button>
          ))}
        </div>
      </aside>

      {!active ? (
        <section className="rounded-xl border border-white/10 bg-[var(--surface)] p-6 text-sm text-white/70">Select a conversation to view messages.</section>
      ) : (
        <section className="rounded-xl border border-white/10 bg-[var(--surface)] p-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div><p className="text-sm font-semibold text-white">{active.playerName}</p><Link href={active.profileHref} className="text-xs text-[var(--brand-primary)]">View profile</Link></div>
          </div>
          <div className="mt-3 space-y-2">
            <div className="rounded-md bg-black/30 p-2 text-xs text-white/70">Safe messaging notice: All conversations are logged and moderated for platform safety.</div>
            {active.pendingParentApproval ? <div className="rounded-md border border-amber-400/50 bg-amber-500/10 p-2 text-xs text-amber-100">Messages are pending parent/guardian approval.</div> : null}
            {active.underReview ? <div className="rounded-md border border-[var(--brand-secondary)]/50 bg-[var(--brand-secondary)]/10 p-2 text-xs text-white">This thread is under moderator review.</div> : null}
            {active.messages.map((message) => (
              <div key={message.id} className={`max-w-[80%] rounded-md px-3 py-2 text-sm ${message.sender === "coach" ? "ml-auto bg-[var(--brand-primary)] text-white" : "bg-black/40 text-white/85"}`}>
                {message.text}
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <textarea value={draft} onChange={(e) => setDraft(e.target.value)} disabled={active.moderationHold} className="min-h-[80px] flex-1 rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white" placeholder={active.moderationHold ? "Messaging is disabled during moderation hold." : "Write a message"} />
            <button disabled={active.moderationHold || draft.trim().length === 0} className="self-end rounded-md bg-[var(--brand-primary)] px-3 py-2 text-sm font-semibold text-white disabled:opacity-40">Send</button>
          </div>
        </section>
      )}
    </div>
  );
}
