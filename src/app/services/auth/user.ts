export interface User {
  id: number;
  fullName: string;
  email: string;
  targetHoursPerDay: number;
  workingDays: number[];
  isAdmin: boolean;
  isActive: boolean;
  createdAt: string;
}
export interface AuthResponse {
  token: string;
  user: User;
}
