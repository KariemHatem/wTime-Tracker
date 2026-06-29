import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  WorkSession,
  TodayProgress,
  WeeklyReport,
  MonthlyReport,
  DailyReportRow,
  AdminStats,
  UserMonitoring,
  LoginActivity,
  WeeklyAnalytics,
  MonthlyAnalytics,
  User,
  UserCreate,
  UserUpdate,
} from "../models/api.models";
import { enviroment } from "src/enviroments/enviroment";

@Injectable({ providedIn: "root" })
export class ApiService {
  private httpCall = inject(HttpClient);
  private readonly endPoint = enviroment.BaseURL;

  // Sessions API Calls
  listSessions(from?: string, to?: string): Observable<WorkSession[]> {
    let params = new HttpParams();
    if (from) params = params.set("from", from);
    if (to) params = params.set("to", to);
    return this.httpCall.get<WorkSession[]>(`${this.endPoint}/sessions`, {
      params,
    });
  }

  getActiveSession(): Observable<WorkSession | null> {
    return this.httpCall.get<WorkSession | null>(
      `${this.endPoint}/sessions/active`,
    );
  }

  getTodayProgress(): Observable<TodayProgress> {
    return this.httpCall.get<TodayProgress>(`${this.endPoint}/sessions/today`);
  }

  startSession(notes?: string): Observable<WorkSession> {
    return this.httpCall.post<WorkSession>(`${this.endPoint}/sessions/start`, {
      notes,
    });
  }

  endSession(): Observable<WorkSession> {
    return this.httpCall.post<WorkSession>(`${this.endPoint}/sessions/end`, {});
  }

  // Reports API Calls
  getDailyReport(date: string): Observable<DailyReportRow[]> {
    return this.httpCall.get<DailyReportRow[]>(
      `${this.endPoint}/reports/daily`,
      {
        params: { date },
      },
    );
  }

  getWeeklyReport(week?: string): Observable<WeeklyReport> {
    let params = new HttpParams();
    if (week) params = params.set("week", week);
    return this.httpCall.get<WeeklyReport>(`${this.endPoint}/reports/weekly`, {
      params,
    });
  }

  getMonthlyReport(year?: number, month?: number): Observable<MonthlyReport> {
    let params = new HttpParams();
    if (year) params = params.set("year", year);
    if (month) params = params.set("month", month);
    return this.httpCall.get<MonthlyReport>(
      `${this.endPoint}/reports/monthly`,
      { params },
    );
  }

  // Admin API Calls
  getAdminStats(): Observable<AdminStats> {
    return this.httpCall.get<AdminStats>(`${this.endPoint}/admin/stats`);
  }

  getUsersMonitoring(): Observable<UserMonitoring[]> {
    return this.httpCall.get<UserMonitoring[]>(
      `${this.endPoint}/admin/users/monitoring`,
    );
  }

  // Users API Calls
  listUsers(): Observable<User[]> {
    return this.httpCall.get<User[]>(`${this.endPoint}/users`);
  }

  createUser(data: UserCreate): Observable<User> {
    return this.httpCall.post<User>(`${this.endPoint}/users`, data);
  }

  updateUser(id: number, data: UserUpdate): Observable<User> {
    return this.httpCall.put<User>(`${this.endPoint}/users/${id}`, data);
  }

  deleteUser(id: number): Observable<void> {
    return this.httpCall.delete<void>(`${this.endPoint}/users/${id}`);
  }

  //  Login Activity API Calls
  getLoginActivity(limit = 50): Observable<LoginActivity[]> {
    return this.httpCall.get<LoginActivity[]>(
      `${this.endPoint}/activity/login`,
      {
        params: { limit },
      },
    );
  }

  //  Analytics API Calls
  getWeeklyAnalytics(week?: string): Observable<WeeklyAnalytics> {
    let params = new HttpParams();
    if (week) params = params.set("week", week);
    return this.httpCall.get<WeeklyAnalytics>(
      `${this.endPoint}/admin/analytics/weekly`,
      {
        params,
      },
    );
  }

  getMonthlyAnalytics(
    year?: number,
    month?: number,
  ): Observable<MonthlyAnalytics> {
    let params = new HttpParams();
    if (year) params = params.set("year", year);
    if (month) params = params.set("month", month);
    return this.httpCall.get<MonthlyAnalytics>(
      `${this.endPoint}/admin/analytics/monthly`,
      {
        params,
      },
    );
  }
}
