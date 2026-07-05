import { Component, OnInit, inject, DestroyRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TabsModule } from "primeng/tabs";
import { ChartModule } from "primeng/chart";
import { TableModule } from "primeng/table";
import {
  WeeklyAnalytics,
  MonthlyAnalytics,
} from "../../../services/analytics/analytics-model";
import { AnalyticsService } from "src/app/services/analytics/analytics-service";
import { CHART_OPTS, LINE_OPTS, CHART_COLORS } from "../../../shared/const";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ChartData } from "chart.js";

@Component({
  selector: "app-admin-analytics",
  standalone: true,
  imports: [CommonModule, TabsModule, ChartModule, TableModule],
  templateUrl: "./analytics.html",
  styleUrl: "./analytics.scss",
})
export class AdminAnalyticsComponent implements OnInit {
  // Priv Properties
  private analyticsService = inject(AnalyticsService);
  private destroyRef = inject(DestroyRef);

  // Data Properties
  weekly?: WeeklyAnalytics;
  monthly?: MonthlyAnalytics;
  weeklyBarData?: ChartData<"bar">;
  weeklyLineData?: ChartData<"line">;
  monthlyBarData?: ChartData<"bar">;
  chartOpts = CHART_OPTS;
  lineOpts = LINE_OPTS;
  chartColors = CHART_COLORS;
  Math = Math;
  now = new Date();

  fmtDay(d: string): string {
    return d.slice(5, 10).replace("-", "/");
  }
  fmtMonth(m: number): string {
    return m.toString().padStart(2, "0");
  }

  ngOnInit(): void {
    this.getWeeklyAnalytics();
    this.getMonthlyAnalytics();
  }

  // Private Methods

  // Building Bars
  private buildHoursBarData(
    labels: string[],
    targetMinutes: number[],
    workedMinutes: number[],
    workedColor: string,
  ): ChartData<"bar"> {
    return {
      labels,
      datasets: [
        {
          label: "Target (h)",
          data: targetMinutes,
          backgroundColor: this.chartColors.target,
        },
        {
          label: "Worked (h)",
          data: workedMinutes,
          backgroundColor: workedColor,
        },
      ],
    };
  }

  private getWeeklyAnalytics() {
    this.analyticsService
      .getWeeklyAnalytics(this.now.toISOString().split("T")[0])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((w) => {
        this.weekly = w;
        const labels = w.days.map((d) => d.dayName.slice(0, 3));
        // Build Bar
        this.weeklyBarData = this.buildHoursBarData(
          labels,
          w.days.map((d) => +(d.targetMinutes / 60).toFixed(1)),
          w.days.map((d) => +(d.workedMinutes / 60).toFixed(1)),
          this.chartColors.workedBlue,
        );

        // Line Data
        this.weeklyLineData = {
          labels,
          datasets: [
            {
              label: "Productivity %",
              data: w.days.map((d) => Math.round(d.productivityPercent)),
              borderColor: this.chartColors.productivity,
              backgroundColor: this.chartColors.productivityFill,
              fill: true,
            },
          ],
        };
      });
  }

  private getMonthlyAnalytics() {
    this.analyticsService
      .getMonthlyAnalytics(this.now.getFullYear(), this.now.getMonth() + 1)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((m) => {
        this.monthly = m;

        // Build Bar
        this.monthlyBarData = this.buildHoursBarData(
          m.weeks.map((w) => `W${w.weekNumber}`),
          m.weeks.map((w) => +(w.targetMinutes / 60).toFixed(1)),
          m.weeks.map((w) => +(w.workedMinutes / 60).toFixed(1)),
          this.chartColors.workedGreen,
        );
      });
  }
}
