import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { enviroment } from "src/enviroments/enviroment";
import { Report } from "./admin-report";
import { WeeklyReport } from "./admin-report";

@Injectable({
  providedIn: "root",
})
export class AdminReports {
  private httpCall = inject(HttpClient);
  private readonly endPoint = enviroment.BaseURL;

  getDailyReport(date: string): Observable<Report[]> {
    return this.httpCall.get<Report[]>(`${this.endPoint}/reports/daily`, {
      params: { date },
    });
  }

  // Reports API Calls
  getWeeklyReport(week?: string): Observable<WeeklyReport> {
    let params = new HttpParams();
    if (week) params = params.set("week", week);
    return this.httpCall.get<WeeklyReport>(`${this.endPoint}/reports/weekly`, {
      params,
    });
  }
}
