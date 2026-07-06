export interface Report {
  userId: number;
  userFullName: string;
  date: string;
  startTime?: string | null;
  endTime?: string | null;
  workedMinutes: number;
  targetMinutes: number;
  completionPercent?: number;
}

export interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  totalWorkedMinutes: number;
  totalTargetMinutes: number;
  overtimeMinutes?: number;
  missingMinutes?: number;
  dailyBreakdown: DailyBreakdownItem[];
}

export interface DailyBreakdownItem {
  date: string;
  dayName: string;
  workedMinutes: number;
  targetMinutes: number;
}
