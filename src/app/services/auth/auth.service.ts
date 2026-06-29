import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { Router } from "@angular/router";
import {  ProfileUpdate } from "../../models/api.models";
import { enviroment } from "../../../enviroments/enviroment";
import { User,AuthResponse } from "./user";

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly TOKEN_KEY = "wt_token";
  private readonly USER_KEY = "wt_user";

  private readonly API = enviroment.BaseURL;

  private userSubject = new BehaviorSubject<User | null>(this.loadStoredUser());
  user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  get currentUser(): User | null {
    return this.userSubject.value;
  }
  get isAdmin(): boolean {
    return this.userSubject.value?.isAdmin ?? false;
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
          this.userSubject.next(res.user);
        }),
      );
  }

  logout(): void {
    this.http
      .post(`${this.API}/auth/logout`, {})
      .subscribe({ error: () => {} });
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.userSubject.next(null);
    this.router.navigate(["/login"]);
  }

  refreshUser(): Observable<User> {
    return this.http.get<User>(`${this.API}/auth/me`).pipe(
      tap((u) => {
        localStorage.setItem(this.USER_KEY, JSON.stringify(u));
        this.userSubject.next(u);
      }),
    );
  }

  updateProfile(data: ProfileUpdate): Observable<User> {
    return this.http.put<User>(`${this.API}/users/profile`, data).pipe(
      tap((u) => {
        localStorage.setItem(this.USER_KEY, JSON.stringify(u));
        this.userSubject.next(u);
      }),
    );
  }
}
