import { Component, DestroyRef, OnInit, inject, signal } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TabsModule } from "primeng/tabs";
import { DatePickerModule } from "primeng/datepicker";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { ChartModule } from "primeng/chart";
import { AnalyticsService } from "src/app/services/analytics/analytics-service";
import { Report } from "src/app/services/reports/admin-report";
import { AdminReports } from "src/app/services/reports/admin-reports";
import {
  formatMinutes,
  formatDateForApi,
} from "src/app/shared/utils/date-time.util";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { buildBarData } from "src/app/shared/utils/builder-bar.util";
import { WeeklyReport } from "./weekly-report/weekly-report";
import { MonthlyReport } from "./monthly-report/monthly-report";
import { DailyReport } from "./daily-report/daily-report";

@Component({
  selector: "app-reports",
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    TabsModule,
    DatePickerModule,
    ButtonModule,
    TableModule,
    ChartModule,
    WeeklyReport,
    MonthlyReport,
    DailyReport,
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
