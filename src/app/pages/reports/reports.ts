import { Component, DestroyRef, OnInit, inject, signal } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TabsModule } from "primeng/tabs";
import { DatePickerModule } from "primeng/datepicker";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { ChartModule } from "primeng/chart";
import { MonthlyReport } from "../../services/analytics/analytics-model";
import { AnalyticsService } from "src/app/services/analytics/analytics-service";
import { Report, WeeklyReport } from "src/app/services/reports/admin-report";
import { AdminReports } from "src/app/services/reports/admin-reports";
import {
  formatMinutes,
  formatDateForApi,
} from "src/app/shared/utils/date-time.util";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { CHART_COLORS, CHART_OPTS } from "src/app/shared/const";
import { ChartData } from "chart.js";
import { buildBarData } from "src/app/shared/utils/builder-bar.util";

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
  ],
  templateUrl: "./reports.html",
  styleUrl: "./reports.scss",
})
export class ReportsComponent implements OnInit {
  // Priv Properties
  private analyticsService = inject(AnalyticsService);
  private report = inject(AdminReports);
  private destroyRef = inject(DestroyRef);

  // Data
  dailyDate = new Date();
  weekDate = this.startOfWeek(new Date());
  daily = new Date();
  dailyRows = signal<Report[]>([]);
  weekly?: WeeklyReport;
  monthly?: MonthlyReport;
  loadingDaily = signal(true);
  weeklyChartData?: ChartData<"bar">;
  monthlyChartData?: ChartData<"bar">;
  chartOpts = CHART_OPTS;
  chartColors = CHART_COLORS;
  Math = Math;

  // Utils
  fmt = formatDateForApi;
  fmtMins = formatMinutes;
  buildHoursBarData = buildBarData;

  ngOnInit(): void {
    this.loadDaily();
    this.loadWeekly();
    this.loadMonthly();
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

  // Weekly Report
  loadWeekly(): void {
    this.report
      .getWeeklyReport(this.fmt(this.weekDate))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((w) => {
        this.weekly = w;

        const labels = w.dailyBreakdown.map((d) => d.dayName.slice(0, 3));
        this.weeklyChartData = this.buildHoursBarData(
          labels,
          w.dailyBreakdown.map((d) => +(d.targetMinutes / 60).toFixed(1)),
          w.dailyBreakdown.map((d) => +(d.workedMinutes / 60).toFixed(1)),
          this.chartColors.target,
        );

        this.weeklyChartData = this.buildHoursBarData(
          labels,
          w.dailyBreakdown.map((d) => +(d.targetMinutes / 60).toFixed(1)),
          w.dailyBreakdown.map((d) => +(d.workedMinutes / 60).toFixed(1)),
          this.chartColors.workedBlue,
        );
      });
  }

  // Monthly Report
  loadMonthly(): void {
    const now = new Date();
    this.analyticsService
      .getMonthlyReport(now.getFullYear(), now.getMonth() + 1)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((m) => {
        this.monthly = m;
        const labels = m.weeklyBreakdown.map((w) => `W${w.weekNumber}`);
        this.monthlyChartData = this.buildHoursBarData(
          labels,
          m.weeklyBreakdown.map((d) => +(d.targetMinutes / 60).toFixed(1)),
          m.weeklyBreakdown.map((d) => +(d.workedMinutes / 60).toFixed(1)),
          this.chartColors.target,
        );

        this.monthlyChartData = this.buildHoursBarData(
          labels,
          m.weeklyBreakdown.map((d) => +(d.targetMinutes / 60).toFixed(1)),
          m.weeklyBreakdown.map((d) => +(d.workedMinutes / 60).toFixed(1)),
          this.chartColors.workedGreen,
        );
      });
  }

  get weeklySummary() {
    if (!this.weekly) return [];
    return [
      {
        label: "Worked",
        val: this.fmtMins(this.weekly.totalWorkedMinutes),
        color: "#3b82f6",
      },
      {
        label: "Target",
        val: this.fmtMins(this.weekly.totalTargetMinutes),
        color: "var(--text-color)",
      },
      {
        label: "Missing",
        val: this.fmtMins(this.weekly.missingMinutes ?? 0),
        color: "#f59e0b",
      },
      {
        label: "Overtime",
        val: this.fmtMins(this.weekly.overtimeMinutes ?? 0),
        color: "#22c55e",
      },
    ];
  }

  get monthlySummary() {
    if (!this.monthly) return [];
    return [
      {
        label: "Total Worked",
        val: this.fmtMins(this.monthly.totalWorkedMinutes),
        color: "#3b82f6",
      },
      {
        label: "Target",
        val: this.fmtMins(this.monthly.totalTargetMinutes),
        color: "var(--text-color)",
      },
      {
        label: "Overtime",
        val: this.fmtMins(this.monthly.overtimeMinutes ?? 0),
        color: "#22c55e",
      },
      {
        label: "Productivity",
        val: `${(this.monthly.productivityPercent ?? 0).toFixed(0)}%`,
        color: "#a78bfa",
      },
    ];
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

  startOfWeek(d: Date): Date {
    const day = d.getDay(),
      diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }
}
