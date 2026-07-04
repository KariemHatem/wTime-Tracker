export interface ActivityModel {
  id: number;
  userId: number;
  userFullName?: string;
  userEmail?: string;
  loginTime: string;
  logoutTime?: string | null;
  ipAddress?: string | null;
  browser?: string | null;
  operatingSystem?: string | null;
  device?: string | null;
}
