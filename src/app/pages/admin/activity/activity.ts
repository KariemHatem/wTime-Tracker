import { Component, OnInit, inject, DestroyRef, signal } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { SelectModule } from "primeng/select";
import { ActivityModel } from "./../../../services/activity/activity-model";
import { Activity } from "./../../../services/activity/activity";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DataTable } from "src/app/shared/data-table/data-table/data-table";
import { HeaderSection } from "src/app/shared/header-section/header-section";
import { TranslatePipe } from "@ngx-translate/core";
import { Dialog } from "primeng/dialog";
import { Location } from "src/app/shared/map/location/location";
import { finalize } from "rxjs/operators";
@Component({
  selector: "app-admin-activity",
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    TableModule,
    SelectModule,
    DataTable,
    HeaderSection,
    TranslatePipe,
    Dialog,
    Location,
  ],
  templateUrl: "./activity.html",
  styleUrl: "./activity.scss",
})
export class AdminActivityComponent implements OnInit {
  // Priv Properties
  private activityServices = inject(Activity);
  private destroyRef = inject(DestroyRef);

  // Data
  activity = signal<ActivityModel[]>([]);
  loading = signal(true);
  mapVisibile = signal(false);
  selectedActivity = signal<ActivityModel | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    // this.params.pageNumber.set(0);
    this.activityServices
      .getLoginActivity()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (res) => {
          this.activity.set(res);
        },
      });
  }

  // Location
  openLocation(activity: ActivityModel): void {
    this.selectedActivity.set(activity);
    this.mapVisibile.set(true);
  }

  deviceIcon(device?: string | null): string {
    return device?.toLowerCase().includes("mobile")
      ? "pi pi-mobile"
      : "pi pi-desktop";
  }

  deviceLabel(a: ActivityModel): string {
    return [a.device, a.operatingSystem].filter(Boolean).join(" / ") || "—";
  }
  browserLabel(a: ActivityModel): string {
    const ua = a.browser || "";
    if (/edg/i.test(ua)) return "Edge";
    if (/chrome/i.test(ua)) return "Chrome";
    if (/firefox/i.test(ua)) return "Firefox";
    if (/safari/i.test(ua)) return "Safari";
    return "Unknown";
  }
}
