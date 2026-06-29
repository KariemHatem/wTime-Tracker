import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { User } from "../auth/user";
import { enviroment } from "src/enviroments/enviroment";
import { HttpClient } from "@angular/common/http";
import { Profile } from "./profile";

@Injectable({
  providedIn: "root",
})
export class Users {
  private readonly USER_KEY = "wt_user";
  private readonly API = enviroment.BaseURL;
  private http = inject(HttpClient);

  private userSubject = new BehaviorSubject<User | null>(this.loadStoredUser());

  private loadStoredUser(): User | null {
    try {
      const json = localStorage.getItem(this.USER_KEY);
      return json ? JSON.parse(json) : null;
    } catch {
      return null;
    }
  }

  updateProfile(data: Profile): Observable<User> {
    return this.http.put<User>(`${this.API}/users/profile`, data).pipe(
      tap((u) => {
        localStorage.setItem(this.USER_KEY, JSON.stringify(u));
        this.userSubject.next(u);
      }),
    );
  }
}
