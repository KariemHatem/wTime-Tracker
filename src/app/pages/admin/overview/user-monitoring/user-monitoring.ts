import { Component, OnInit, inject, DestroyRef, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OverviewService } from "src/app/services/overview/overview-service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ApiService } from "src/app/services/api.service";
import { UserMonitoring as UserMonitor } from "../../../../models/api.models";
import { DataTable } from "src/app/shared/data-table/data-table/data-table";

@Component({
  selector: "app-user-monitoring",
  imports: [CommonModule, DataTable],
  templateUrl: "./user-monitoring.html",
  styleUrl: "./user-monitoring.scss",
})
export class UserMonitoring implements OnInit {
  // Priv Properties
  private overviewService = inject(OverviewService);
  private api = inject(ApiService);
  private destroyRef = inject(DestroyRef);

  // Data Properties
  monitoring: UserMonitor[] = [];
  loading = signal(true);

  // Lifecycle
  ngOnInit(): void {
    this.getUserMonitoring();
  }

  // Get UserMonitoring
  private getUserMonitoring() {
    this.api
      .getUsersMonitoring()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (m) => {
          this.monitoring = m;
          this.loading.set(false);
        },
      });
  }

  // statusBadge(s?: string): string {
  //   if (s === "working") return "badge-working";
  //   if (s === "idle") return "badge-idle";
  //   return "badge-offline";
  // }
}
