import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  MonthlyReport,
  WeeklyAnalytics,
  MonthlyAnalytics,
} from "./analytics-model";
import { enviroment } from "src/enviroments/enviroment";

@Injectable({
  providedIn: "root",
})
export class AnalyticsService {
  private httpCall = inject(HttpClient);
  private readonly endPoint = enviroment.BaseURL;

  private buildYearMonthParams(year?: number, month?: number): HttpParams {
    let params = new HttpParams();
    if (year !== undefined) params = params.set("year", year);
    if (month !== undefined) params = params.set("month", month);
    return params;
  }

  getMonthlyReport(year?: number, month?: number): Observable<MonthlyReport> {
    return this.httpCall.get<MonthlyReport>(
      `${this.endPoint}/reports/monthly`,
      { params: this.buildYearMonthParams(year, month) },
    );
  }

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
    return this.httpCall.get<MonthlyAnalytics>(
      `${this.endPoint}/admin/analytics/monthly`,
      {
        params: this.buildYearMonthParams(year, month),
      },
    );
  }
}
