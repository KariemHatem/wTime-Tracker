import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  WorkSession,
  TodayProgress,
  UserMonitoring,
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

  getUsersMonitoring(): Observable<UserMonitoring[]> {
    return this.httpCall.get<UserMonitoring[]>(
      `${this.endPoint}/admin/users/monitoring`,
    );
  }
}
