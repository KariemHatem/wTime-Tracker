import { Component, inject } from "@angular/core";
import { AuthService } from "src/app/services/auth/auth.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-user-info",
  imports: [DatePipe],
  templateUrl: "./user-info.html",
  styleUrl: "./user-info.scss",
})
export class UserInfo {
  private authService = inject(AuthService);

  get user() {
    return this.authService.currentUser;
  }
}
