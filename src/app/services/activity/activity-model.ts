export interface ActivityModel {
  id: number;
  userId: number;
  userFullName?: string;
  userEmail?: string;
  loginTime: string;
  logoutTime?: string;
  ipAddress?: string;
  browser?: string;
  operatingSystem?: string;
  device?: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  country?: string;
  address?: string;
}
