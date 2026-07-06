import { inject, Injectable } from "@angular/core";
import { User } from "../auth/user";
import { HttpClient } from "@angular/common/http";
import { enviroment } from "src/enviroments/enviroment";
import { Observable } from "rxjs";
import { UserCreate, UserUpdate } from "../users/users-model";

@Injectable({
  providedIn: "root",
})
export class AdminUsers {
  private httpCall = inject(HttpClient);
  private readonly endPoint = enviroment.BaseURL;

  // Users API Calls
  listUsers(): Observable<User[]> {
    return this.httpCall.get<User[]>(`${this.endPoint}/users`);
  }

  createUser(data: UserCreate): Observable<User> {
    return this.httpCall.post<User>(`${this.endPoint}/users`, data);
  }

  updateUser(id: number, data: UserUpdate): Observable<User> {
    return this.httpCall.patch<User>(`${this.endPoint}/users/${id}`, data);
  }

  deleteUser(id: number): Observable<void> {
    return this.httpCall.delete<void>(`${this.endPoint}/users/${id}`);
  }
}
