export interface WorkSession {
  id: number;
  userId: number;
  startTime: string;
  endTime?: string | null;
  totalMinutes?: number | null;
  notes?: string | null;
  isActive: boolean;
}

export interface TodayProgress {
  workedMinutes: number;
  targetMinutes: number;
  progressPercent: number;
  sessionsCount: number;
  isGoalReached: boolean;
}

export interface UserMonitoring {
  userId: number;
  fullName: string;
  email: string;
  isActive: boolean;
  status?: "working" | "idle" | "offline";
  hoursToday: number;
  hoursThisWeek: number;
  lastLogin?: string | null;
}
