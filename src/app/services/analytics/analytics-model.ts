export interface MonthlyReport {
  year: number;
  month: number;
  totalWorkedMinutes: number;
  totalTargetMinutes: number;
  overtimeMinutes?: number;
  productivityPercent?: number;
  weeklyBreakdown: WeeklyBreakdown[];
}

export interface MonthlyAnalytics {
  year: number;
  month: number;
  weeks: WeeklyBreakdown[];
  mostProductiveDays: string[];
  avgHoursWorked?: number;
}

export interface WeeklyAnalytics {
  weekStart: string;
  days: DayAnalytics[];
}

export interface DayAnalytics {
  date: string;
  dayName: string;
  workedMinutes: number;
  targetMinutes: number;
  productivityPercent: number;
}

export interface WeeklyBreakdown {
  weekNumber: number;
  workedMinutes: number;
  targetMinutes: number;
}
