import { Component, OnInit } from "@angular/core";
import { RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../services/auth.service";
import { User } from "../../models/api.models";

@Component({
  selector: "app-layout",
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: "./layout.html",
  styleUrl: "./layout.scss",
})
export class LayoutComponent implements OnInit {
  user: User | null = null;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.user$.subscribe((u) => (this.user = u));
  }

  get initials(): string {
    return (this.user?.fullName ?? "")
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
