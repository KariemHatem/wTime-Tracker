import {
  Component,
  OnInit,
  computed,
  inject,
  DestroyRef,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { ApiService } from "../../../services/api.service";
import { OverviewService } from "src/app/services/overview/overview-service";
import { AdminStats } from "src/app/services/overview/admin-stats";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { StatCard } from "src/app/shared/model";
import { HeaderSection } from "src/app/shared/header-section/header-section";
import { UserMonitoring } from "./user-monitoring/user-monitoring";
@Component({
  selector: "app-admin-overview",
  standalone: true,
  imports: [CommonModule, HeaderSection, UserMonitoring],
  templateUrl: "./overview.html",
  styleUrl: "./overview.scss",
})
export class AdminOverviewComponent implements OnInit {
  // Priv Properties
  private overviewService = inject(OverviewService);
  private api = inject(ApiService);
  private destroyRef = inject(DestroyRef);

  // Data Properties
  stats = signal<AdminStats | undefined>(undefined);
  loading = signal(true);

  // Lifecycle
  ngOnInit(): void {
    this.getAdmins();
  }

  // Priv Methods

  // Get Admins
  private getAdmins() {
    this.overviewService
      .getAdminStats()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.stats.set(res);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  statCards = computed<StatCard[]>(() => {
    const s = this.stats();
    if (!s) return [];
    return [
      {
        label: "Total Users",
        value: s.totalUsers,
        icon: "pi-users",
        color: "#3b82f6",
      },
      {
        label: "Active Today",
        value: s.activeUsersToday,
        icon: "pi-bolt",
        color: "#22c55e",
      },
      {
        label: "Total Logins",
        value: s.totalLogins,
        icon: "pi-sign-in",
        color: "#f59e0b",
      },
      {
        label: "Avg Productivity",
        value: `${Math.round(s.avgDailyProductivity)}%`,
        icon: "pi-chart-line",
        color: "#a78bfa",
      },
    ];
  });
}
