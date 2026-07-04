import { Component, OnInit, inject, DestroyRef, signal } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { SelectModule } from "primeng/select";
import { ActivityModel } from "./../../../services/activity/activity-model";
import { Activity } from "./../../../services/activity/activity";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { TablePageEvent } from "primeng/table";

@Component({
  selector: "app-admin-activity",
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, TableModule, SelectModule],
  templateUrl: "./activity.html",
  styleUrl: "./activity.scss",
})
export class AdminActivityComponent implements OnInit {
  // Priv Properties
  private activityServices = inject(Activity);
  private destroyRef = inject(DestroyRef);

  // Data
  activity: ActivityModel[] = [];
  loading = signal(true);

  params = {
    pageSize: signal<number>(10),
    pageNumber: signal<number>(1),
  };

  ngOnInit(): void {
    this.load();
  }

  pageChange(event: TablePageEvent) {
    this.params.pageNumber.set(event.first);
    this.params.pageSize.set(event.rows);
  }

  load(): void {
    this.loading.set(true);
    this.params.pageNumber.set(0);
    this.activityServices
      .getLoginActivity()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.activity = res;
          this.loading.set(false);
        },
      });
  }

  deviceIcon(device?: string | null): string {
    return device?.toLowerCase().includes("mobile")
      ? "pi pi-mobile"
      : "pi pi-desktop";
  }

  browserLabel(a: ActivityModel): string {
    return (
      [a.browser, a.device, a.operatingSystem].filter(Boolean).join(" / ") ||
      "—"
    );
  }
}
