import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { enviroment } from "src/enviroments/enviroment";
import { ActivityModel } from "./activity-model";

export interface queryParams {}

@Injectable({
  providedIn: "root",
})
export class Activity {
  private httpCall = inject(HttpClient);
  private readonly endPoint = enviroment.BaseURL;

  //  Login Activity API Calls
  getLoginActivity(): Observable<ActivityModel[]> {
    return this.httpCall.get<ActivityModel[]>(
      `${this.endPoint}/activity/login`,
    );
  }
}
