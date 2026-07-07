import {
  Component,
  OnInit,
  inject,
  DestroyRef,
  signal,
  computed,
} from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { DatePickerModule } from "primeng/datepicker";
import { ButtonModule } from "primeng/button";
import { AdminReports } from "src/app/services/reports/admin-reports";
import { Report } from "src/app/services/reports/admin-report";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { HeaderSection } from "src/app/shared/header-section/header-section";
import { DataTable } from "src/app/shared/data-table/data-table/data-table";
import {
  formatMinutes,
  formatDateForApi,
} from "src/app/shared/utils/date-time.util";

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
    HeaderSection,
    DataTable,
  ],
  templateUrl: "./admin-reports.html",
  styleUrl: "./admin-reports.scss",
})
export class AdminReportsComponent implements OnInit {
  // Priv Prop
  private reports = inject(AdminReports);
  private destroyRef = inject(DestroyRef);

  // Data
  report = signal<Report[]>([]);
  loading = signal(true);
  selectedDate = new Date();
  Math = Math;
  fmt = formatDateForApi;
  fmtMins = formatMinutes;

  // Lifecycle
  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.reports
      .getDailyReport(this.fmt(this.selectedDate))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.report.set(res);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  totalWorked = computed(() =>
    this.report().reduce((s, r) => s + r.workedMinutes, 0),
  );

  avgCompletion = computed(() => {
    const r = this.report();
    if (!r.length) return 0;
    return Math.round(
      r.reduce((s, x) => s + (x.completionPercent ?? 0), 0) / r.length,
    );
  });

  exportCsv(): void {
    const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
    const rows = this.report().map(
      (r) =>
        `${escape(r.userFullName)},${escape(r.date)},${r.workedMinutes},${r.targetMinutes},${(r.completionPercent ?? 0).toFixed(0)}`,
    );
    const csv = ["Name,Date,Worked(min),Target(min),Completion%", ...rows].join(
      "\n",
    );
    const a = document.createElement("a");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.href = url;
    a.download = `admin-report-${this.fmt(this.selectedDate)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
