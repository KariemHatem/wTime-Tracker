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
