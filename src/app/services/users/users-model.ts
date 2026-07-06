export interface UserCreate {
  fullName: string;
  email: string;
  password: string;
  targetHoursPerDay: number;
  workingDays: number[];
  isAdmin: boolean;
}

export interface UserUpdate {
  fullName?: string;
  email?: string;
  targetHoursPerDay?: number;
  workingDays?: number[];
  isActive?: boolean;
  isAdmin?: boolean;
}
