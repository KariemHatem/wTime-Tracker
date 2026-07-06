import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { enviroment } from "src/enviroments/enviroment";
import { AdminReport } from "./admin-report";

@Injectable({
  providedIn: "root",
})
export class AdminReports {
   private httpCall = inject(HttpClient);
  private readonly endPoint = enviroment.BaseURL;
  
  getDailyReport(date: string): Observable<AdminReport[]> {
    return this.httpCall.get<AdminReport[]>(
      `${this.endPoint}/reports/daily`,
      {
        params: { date },
      },
    );
  }
}
