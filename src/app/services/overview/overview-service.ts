import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AdminStats } from "../overview/admin-stats";
import { enviroment } from "src/enviroments/enviroment";

@Injectable({
  providedIn: "root",
})
export class OverviewService {
  private httpCall = inject(HttpClient);
  private readonly endPoint = enviroment.BaseURL;

  // Admin API Calls
  getAdminStats(): Observable<AdminStats> {
    return this.httpCall.get<AdminStats>(`${this.endPoint}/admin/stats`);
  }
}
