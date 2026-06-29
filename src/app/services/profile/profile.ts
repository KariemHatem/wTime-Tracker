export interface Profile {
  fullName?: string;
  email?: string;
  targetHoursPerDay?: number;
  workingDays?: number[];
  currentPassword?: string;
  newPassword?: string;
}
