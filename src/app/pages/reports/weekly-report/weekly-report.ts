import { Component, DestroyRef, OnInit, inject, signal } from "@angular/core";
import { AdminReports } from "src/app/services/reports/admin-reports";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { buildBarData } from "src/app/shared/utils/builder-bar.util";
import {
  formatDateForApi,
  formatMinutes,
} from "src/app/shared/utils/date-time.util";
import { ChartData } from "chart.js";
import { WeeklyReport as weekReport } from "src/app/services/reports/admin-report";
import { CHART_COLORS, CHART_OPTS } from "src/app/shared/const";
import { DatePicker } from "primeng/datepicker";
import { FormsModule } from "@angular/forms";
import { ChartModule } from "primeng/chart";

@Component({
  selector: "app-weekly-report",
  imports: [DatePicker, FormsModule, ChartModule],
  templateUrl: "./weekly-report.html",
  styleUrl: "./weekly-report.scss",
})
export class WeeklyReport implements OnInit {
  // Priv Properties
  private report = inject(AdminReports);
  private destroyRef = inject(DestroyRef);

  // Data
  weekDate = this.startOfWeek(new Date());
  weeklyChartData?: ChartData<"bar">;
  weekly?: weekReport;
  chartColors = CHART_COLORS;
  chartOpts = CHART_OPTS;

  // Utils
  fmt = formatDateForApi;
  fmtMins = formatMinutes;
  buildHoursBarData = buildBarData;

  // Lifecycle
  ngOnInit(): void {
    this.loadWeekly();
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

  // Summary
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

  startOfWeek(d: Date): Date {
    const day = d.getDay(),
      diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }
}
