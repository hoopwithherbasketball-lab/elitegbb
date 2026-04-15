import PageLayout from "@/components/PageLayout";
import { EmptyState } from "@/components/ui";
import { getCoachConversations } from "@/lib/adapters/coach";
import { MessagesWorkspaceClient } from "@/app/(coach)/coach/_components/MessagesWorkspaceClient";

export default async function CoachMessagesPage() {
  const conversations = await getCoachConversations();

  return (
    <PageLayout title="Messages" subtitle="Manage coach-player conversations with safety controls." eyebrow="Coach Messaging">
      {conversations.length === 0 ? (
        <EmptyState title="No conversations yet" description="Start a new outreach from Search or Shortlist." />
      ) : (
        <MessagesWorkspaceClient conversations={conversations} />
      )}
    </PageLayout>
  );
}
