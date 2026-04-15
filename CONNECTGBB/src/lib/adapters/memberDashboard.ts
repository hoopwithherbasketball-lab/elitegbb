import { publicEvents, type PublicEvent } from "@/lib/adapters/events";

export interface DashboardStat {
  label: string;
  value: string;
  delta: string;
}

export interface RecentConnection {
  id: string;
  name: string;
  organization: string;
  messagePreview: string;
  type: "request" | "message";
  createdAt: string;
}

export interface TrainingRecommendation {
  id: string;
  title: string;
  category: string;
  level: string;
}

export interface MemberDashboardData {
  profileCompletion: {
    percent: number;
    missingFields: string[];
  };
  continueWatching: {
    title: string;
    thumbnail: string;
    progressPercent: number;
  } | null;
  stats: DashboardStat[];
  recentConnections: RecentConnection[];
  upcomingEvents: PublicEvent[];
  recommendedTraining: TrainingRecommendation[];
}

export async function getMemberDashboardData(): Promise<MemberDashboardData> {
  return {
    profileCompletion: {
      percent: 74,
      missingFields: ["Add SAT/ACT range", "Upload one more highlight", "Complete intended major"],
    },
    continueWatching: {
      title: "Pressure Ball Handling Series",
      thumbnail: "🏀",
      progressPercent: 64,
    },
    stats: [
      { label: "Profile Views", value: "127", delta: "+18 this week" },
      { label: "Connections", value: "12", delta: "+3 pending" },
      { label: "Training Hours", value: "41h", delta: "+2.5 this week" },
      { label: "Coach Saves", value: "9", delta: "+1 this week" },
    ],
    recentConnections: [
      {
        id: "rc1",
        name: "Coach Avery Lewis",
        organization: "River City Prep",
        messagePreview: "Would love to see your latest game film.",
        type: "message",
        createdAt: "2026-04-14T18:10:00.000Z",
      },
      {
        id: "rc2",
        name: "Coach Dana Mitchell",
        organization: "Summit Hoops",
        messagePreview: "Sent a new connection request.",
        type: "request",
        createdAt: "2026-04-13T15:40:00.000Z",
      },
      {
        id: "rc3",
        name: "Coach Riley Brooks",
        organization: "Metro Academy",
        messagePreview: "Thanks for sharing your progress update.",
        type: "message",
        createdAt: "2026-04-12T12:30:00.000Z",
      },
    ],
    upcomingEvents: publicEvents.filter((event) => event.period === "upcoming").slice(0, 2),
    recommendedTraining: [
      { id: "rt1", title: "Pick-and-Roll Reads", category: "IQ / Film", level: "Intermediate" },
      { id: "rt2", title: "Finishing Through Contact", category: "Shooting", level: "Advanced" },
      { id: "rt3", title: "Coach Outreach Template Workshop", category: "Recruiting", level: "All" },
    ],
  };
}
