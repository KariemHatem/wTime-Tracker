import { inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { Router } from "@angular/router";
import { enviroment } from "../../../enviroments/enviroment";
import { User, AuthResponse } from "./user";

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly TOKEN_KEY = "wt_token";
  private readonly USER_KEY = "wt_user";
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API = enviroment.BaseURL;

  userSignal = signal<User | null>(this.loadStoredUser());

  get currentUser(): User | null {
    return this.userSignal();
  }
  get isAdmin(): boolean {
    return this.userSignal()?.isAdmin ?? false;
  }
  get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private loadStoredUser(): User | null {
    try {
      const json = localStorage.getItem(this.USER_KEY);
      return json ? JSON.parse(json) : null;
    } catch {
      return null;
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API}/auth/login`, { email, password })
      .pipe(
        tap((res) => {
          localStorage.setItem(this.TOKEN_KEY, res.token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
          this.userSignal.set(res.user);
        }),
      );
  }

  logout(): void {
    this.http
      .post(`${this.API}/auth/logout`, {})
      .subscribe({ error: () => {} });
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.userSignal.set(null);
    this.router.navigate(["/login"]);
  }

  refreshUser(): Observable<User> {
    return this.http.get<User>(`${this.API}/auth/me`).pipe(
      tap((u) => {
        localStorage.setItem(this.USER_KEY, JSON.stringify(u));
        this.userSignal.set(u);
      }),
    );
  }
}
