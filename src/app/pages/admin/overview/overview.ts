import {
  Component,
  OnInit,
  computed,
  inject,
  DestroyRef,
  signal,
  ChangeDetectionStrategy,
} from "@angular/core";
import { OverviewService } from "src/app/services/overview/overview-service";
import { AdminStats } from "src/app/services/overview/admin-stats";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { StatCard } from "src/app/shared/model";
import { HeaderSection } from "src/app/shared/header-section/header-section";
import { UserMonitoring } from "./user-monitoring/user-monitoring";
import { TranslatePipe } from "@ngx-translate/core";
import { finalize } from "rxjs/operators";
@Component({
  selector: "app-admin-overview",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [HeaderSection, UserMonitoring, TranslatePipe],
  templateUrl: "./overview.html",
  styleUrl: "./overview.scss",
})
export class AdminOverviewComponent implements OnInit {
  // Priv Properties
  private overviewService = inject(OverviewService);
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
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (res) => {
          this.stats.set(res);
        },
      });
  }

  statCards = computed<StatCard[]>(() => {
    const s = this.stats();
    if (!s) return [];
    return [
      {
        label: "ADMIN_OVERVIEW.STATS.TOTAL_USERS",
        value: s.totalUsers,
        icon: "pi pi-users",
        color: "#3b82f6",
      },
      {
        label: "ADMIN_OVERVIEW.STATS.ACTIVE_TODAY",
        value: s.activeUsersToday,
        icon: "pi pi-bolt",
        color: "#22c55e",
      },
      {
        label: "ADMIN_OVERVIEW.STATS.TOTAL_LOGINS",
        value: s.totalLogins,
        icon: "pi pi-sign-in",
        color: "#f59e0b",
      },
      {
        label: "ADMIN_OVERVIEW.STATS.AVG_PRODUCTIVITY",
        value: `${Math.round(s.avgDailyProductivity)}%`,
        icon: "pi pi-chart-line",
        color: "#a78bfa",
      },
    ];
  });
}
