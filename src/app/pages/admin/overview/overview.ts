import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Subscription } from "rxjs";
import { TableModule } from "primeng/table";
import { ApiService } from "../../../services/api.service";
import { AdminStats, UserMonitoring } from "../../../models/api.models";

@Component({
  selector: "app-admin-overview",
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: "./overview.html",
  styleUrl: "./overview.scss",
  styles: [
    `
      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.4;
        }
      }
    `,
  ],
})
export class AdminOverviewComponent implements OnInit {
  // Priv Properties
  stats?: AdminStats;
  monitoring: UserMonitoring[] = [];
  loading = true;
  private subs = new Subscription();

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.subs.add(this.api.getAdminStats().subscribe((s) => (this.stats = s)));
    this.subs.add(
      this.api.getUsersMonitoring().subscribe((m) => {
        this.monitoring = m;
        this.loading = false;
      }),
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  get statCards() {
    if (!this.stats) return [];
    return [
      {
        label: "Total Users",
        value: this.stats.totalUsers,
        icon: "pi-users",
        color: "#3b82f6",
      },
      {
        label: "Active Today",
        value: this.stats.activeUsersToday,
        icon: "pi-bolt",
        color: "#22c55e",
      },
      {
        label: "Total Logins",
        value: this.stats.totalLogins,
        icon: "pi-sign-in",
        color: "#f59e0b",
      },
      {
        label: "Avg Productivity",
        value: `${Math.round(this.stats.avgDailyProductivity)}%`,
        icon: "pi-chart-line",
        color: "#a78bfa",
      },
    ];
  }

  statusBadge(s?: string): string {
    if (s === "working") return "badge-working";
    if (s === "idle") return "badge-idle";
    return "badge-offline";
  }
}
