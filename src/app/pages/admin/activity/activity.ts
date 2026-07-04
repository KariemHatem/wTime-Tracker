import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  DestroyRef,
  signal,
} from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { SelectModule } from "primeng/select";
import { ActivityModel } from "./../../../services/activity/activity-model";
import { Activity } from "./../../../services/activity/activity";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
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
  limit = 50;
  limitOptions = [
    { label: "25 records", value: 25 },
    { label: "50 records", value: 50 },
    { label: "100 records", value: 100 },
    { label: "200 records", value: 200 },
  ];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.activityServices
      .getLoginActivity(this.limit)
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
    return [a.browser, a.operatingSystem].filter(Boolean).join(" / ") || "—";
  }
}
