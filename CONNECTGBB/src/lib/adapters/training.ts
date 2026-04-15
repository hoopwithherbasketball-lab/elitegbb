export type TrainingCategory = "All" | "Ball Handling" | "Shooting" | "Defense" | "Conditioning" | "Recruiting Ed";
export type TrainingLevel = "beginner" | "intermediate" | "advanced";

export interface TrainingVideo {
  id: string;
  title: string;
  thumbnail: string;
  durationMinutes: number;
  difficulty: TrainingLevel;
  category: Exclude<TrainingCategory, "All">;
  completed: boolean;
  progressPercent: number;
}

export interface DrillItem {
  id: string;
  title: string;
  icon: string;
  category: Exclude<TrainingCategory, "All">;
  equipment: string;
}

export interface TrainingDashboardData {
  featuredProgram: {
    title: string;
    description: string;
    progressPercent: number;
  };
  videos: TrainingVideo[];
  drills: DrillItem[];
}

const videos: TrainingVideo[] = [
  {
    id: "tv1",
    title: "Pressure Ball Handling Series",
    thumbnail: "🏀",
    durationMinutes: 18,
    difficulty: "intermediate",
    category: "Ball Handling",
    completed: false,
    progressPercent: 64,
  },
  {
    id: "tv2",
    title: "Game-Speed Catch & Shoot",
    thumbnail: "🎯",
    durationMinutes: 14,
    difficulty: "beginner",
    category: "Shooting",
    completed: true,
    progressPercent: 100,
  },
  {
    id: "tv3",
    title: "Defensive Angles & Footwork",
    thumbnail: "🛡️",
    durationMinutes: 20,
    difficulty: "intermediate",
    category: "Defense",
    completed: false,
    progressPercent: 40,
  },
  {
    id: "tv4",
    title: "Explosive First Step",
    thumbnail: "⚡",
    durationMinutes: 16,
    difficulty: "advanced",
    category: "Conditioning",
    completed: false,
    progressPercent: 25,
  },
  {
    id: "tv5",
    title: "Coach Outreach Best Practices",
    thumbnail: "📬",
    durationMinutes: 11,
    difficulty: "beginner",
    category: "Recruiting Ed",
    completed: false,
    progressPercent: 0,
  },
];

const drills: DrillItem[] = [
  { id: "d1", title: "Two-Ball Rhythm", icon: "🏀", category: "Ball Handling", equipment: "2 basketballs" },
  { id: "d2", title: "5 Spot Shooting", icon: "🎯", category: "Shooting", equipment: "Basketballs + cones" },
  { id: "d3", title: "Mirror Slide", icon: "🛡️", category: "Defense", equipment: "Partner" },
  { id: "d4", title: "Ladder Burst", icon: "⚡", category: "Conditioning", equipment: "Agility ladder" },
];

export async function getTrainingDashboardData(): Promise<TrainingDashboardData> {
  return {
    featuredProgram: {
      title: "Elite Guard Essentials — Week 2",
      description: "Continue your personalized weekly plan combining skill development, conditioning, and recruiting prep.",
      progressPercent: 52,
    },
    videos,
    drills,
  };
}
