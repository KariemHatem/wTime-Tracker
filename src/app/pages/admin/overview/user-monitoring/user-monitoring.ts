import {
  Component,
  OnInit,
  inject,
  DestroyRef,
  signal,
  ChangeDetectionStrategy,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ApiService } from "src/app/services/api.service";
import { UserMonitoring as UserMonitor } from "../../../../models/api.models";
import { DataTable } from "src/app/shared/data-table/data-table/data-table";
import { TranslatePipe } from "@ngx-translate/core";
import { finalize } from "rxjs/operators";

@Component({
  selector: "app-user-monitoring",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, DataTable, TranslatePipe],
  templateUrl: "./user-monitoring.html",
  styleUrl: "./user-monitoring.scss",
})
export class UserMonitoring implements OnInit {
  // Priv Properties
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
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (m) => {
          this.monitoring = m;
        },
      });
  }

  // statusBadge(s?: string): string {
  //   if (s === "working") return "badge-working";
  //   if (s === "idle") return "badge-idle";
  //   return "badge-offline";
  // }
}
