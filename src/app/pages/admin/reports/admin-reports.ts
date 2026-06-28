import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Subscription } from "rxjs";
import { TableModule } from "primeng/table";
import { DatePickerModule } from "primeng/datepicker";
import { ButtonModule } from "primeng/button";
import { ApiService } from "../../../services/api.service";
import { DailyReportRow } from "../../../models/api.models";

@Component({
  selector: "app-admin-reports",
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    TableModule,
    DatePickerModule,
    ButtonModule,
  ],
  templateUrl: "./admin-reports.html",
  styleUrl: "./admin-reports.scss",
})
export class AdminReportsComponent implements OnInit, OnDestroy {
  report: DailyReportRow[] = [];
  loading = true;
  selectedDate = new Date();
  Math = Math;
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
    this.sub = this.api.getDailyReport(this.fmt(this.selectedDate)).subscribe({
      next: (r) => {
        this.report = r;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  get totalWorked(): number {
    return this.report.reduce((s, r) => s + r.workedMinutes, 0);
  }
  get avgCompletion(): number {
    if (!this.report.length) return 0;
    return Math.round(
      this.report.reduce((s, r) => s + (r.completionPercent ?? 0), 0) /
        this.report.length,
    );
  }

  fmtMins(n?: number | null): string {
    const v = n ?? 0;
    const h = Math.floor(v / 60),
      m = v % 60;
    return h === 0 ? `${m}m` : m === 0 ? `${h}h` : `${h}h ${m}m`;
  }

  fmt(d: Date): string {
    return d.toISOString().split("T")[0];
  }

  exportCsv(): void {
    const rows = this.report.map(
      (r) =>
        `"${r.userFullName}","${r.date}","${r.workedMinutes}","${r.targetMinutes}","${(r.completionPercent ?? 0).toFixed(0)}"`,
    );
    const csv = ["Name,Date,Worked(min),Target(min),Completion%", ...rows].join(
      "\n",
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `admin-report-${this.fmt(this.selectedDate)}.csv`;
    a.click();
  }
}
