import { Component, DestroyRef, OnInit, inject, signal } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { TabsModule } from "primeng/tabs";
import { Report } from "src/app/services/reports/admin-report";
import { AdminReports } from "src/app/services/reports/admin-reports";
import {
  formatMinutes,
  formatDateForApi,
} from "src/app/shared/utils/date-time.util";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DailyReport } from "./daily-report/daily-report";
import { DataTable } from "src/app/shared/data-table/data-table/data-table";
import { WeeklyReport } from "./weekly-report/weekly-report";
import { MonthlyReport } from "./monthly-report/monthly-report";
import { HeaderSection } from "src/app/shared/header-section/header-section";

@Component({
  selector: "app-reports",
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    TabsModule,
    DailyReport,
    DataTable,
    WeeklyReport,
    MonthlyReport,
    HeaderSection
],
  templateUrl: "./reports.html",
  styleUrl: "./reports.scss",
})
export class ReportsComponent implements OnInit {
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

  ngOnInit(): void {
    this.loadDaily();
  }

  // Daily Report
  loadDaily(): void {
    this.loadingDaily.set(true);
    this.report
      .getDailyReport(this.fmt(this.dailyDate))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.dailyRows.set(res);
          this.loadingDaily.set(false);
        },
      });
  }
}
