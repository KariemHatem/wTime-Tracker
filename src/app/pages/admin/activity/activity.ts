import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Subscription } from "rxjs";
import { TableModule } from "primeng/table";
import { SelectModule } from "primeng/select";
import { ApiService } from "../../../services/api.service";
import { LoginActivity } from "../../../models/api.models";

@Component({
  selector: "app-admin-activity",
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, TableModule, SelectModule],
  templateUrl: "./activity.html",
  styleUrl: "./activity.scss",
})
export class AdminActivityComponent implements OnInit, OnDestroy {
  activity: LoginActivity[] = [];
  loading = true;
  limit = 50;
  limitOptions = [
    { label: "25 records", value: 25 },
    { label: "50 records", value: 50 },
    { label: "100 records", value: 100 },
    { label: "200 records", value: 200 },
  ];
  private sub?: Subscription;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.load();
  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  load(): void {
    this.loading = true;
    this.sub?.unsubscribe();
    this.sub = this.api.getLoginActivity(this.limit).subscribe({
      next: (a) => {
        this.activity = a;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  deviceIcon(device?: string | null): string {
    return device?.toLowerCase().includes("mobile")
      ? "pi pi-mobile"
      : "pi pi-desktop";
  }

  browserLabel(a: LoginActivity): string {
    return [a.browser, a.operatingSystem].filter(Boolean).join(" / ") || "—";
  }
}
