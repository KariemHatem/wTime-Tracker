import { Component, DestroyRef, inject, OnInit, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AdminReports } from "src/app/services/reports/admin-reports";
import { buildBarData } from "src/app/shared/utils/builder-bar.util";
import {
  formatDateForApi,
  formatMinutes,
} from "src/app/shared/utils/date-time.util";
import { Report } from "src/app/services/reports/admin-report";
import { DatePicker } from "primeng/datepicker";
import { ButtonModule } from "primeng/button";
import { FormsModule } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { DataTable } from "src/app/shared/data-table/data-table/data-table";
import { TranslatePipe } from "@ngx-translate/core";
import { finalize } from "rxjs/operators";

@Component({
  selector: "app-daily-report",
  imports: [
    DatePicker,
    ButtonModule,
    FormsModule,
    DatePipe,
    DataTable,
    TranslatePipe,
  ],
  templateUrl: "./daily-report.html",
  styleUrl: "./daily-report.scss",
})
export class DailyReport implements OnInit {
  // Priv Properties
  private report = inject(AdminReports);
  private destroyRef = inject(DestroyRef);

  // Data
  dailyDate = new Date();
  daily = new Date();
  dailyRows = signal<Report[]>([]);
  loadingDaily = signal(true);
  Math = Math;

  // Utils
  fmt = formatDateForApi;
  fmtMins = formatMinutes;
  buildHoursBarData = buildBarData;

  ngOnInit(): void {
    this.loadDaily();
  }

  // Daily Report
  loadDaily(): void {
    this.loadingDaily.set(true);
    this.report
      .getDailyReport(this.fmt(this.dailyDate))
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loadingDaily.set(false)),
      )
      .subscribe({
        next: (res) => {
          this.dailyRows.set(res);
        },
      });
  }

  exportDaily(): void {
    const rows = this.dailyRows().map(
      (r) =>
        `"${r.userFullName}","${r.date}","${r.workedMinutes}","${r.targetMinutes}","${(r.completionPercent ?? 0).toFixed(0)}"`,
    );
    const csv = ["Name,Date,Worked(min),Target(min),Completion%", ...rows].join(
      "\n",
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `report-${this.fmt(this.dailyDate)}.csv`;
    a.click();
  }
}
