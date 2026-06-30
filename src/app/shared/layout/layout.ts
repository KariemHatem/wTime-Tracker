import { Component, inject, OnInit } from "@angular/core";
import { RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../services/auth/auth.service";
import { User } from "src/app/services/auth/user";

@Component({
  selector: "app-layout",
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: "./layout.html",
  styleUrl: "./layout.scss",
})
export class LayoutComponent {
  // Priv Prop
  private auth = inject(AuthService);

  // Data Source
  userSignal = this.auth.userSignal;

  get initials(): string {
    const user = this.userSignal();
    return (user?.fullName ?? "")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  logout(): void {
    this.auth.logout();
  }
}
