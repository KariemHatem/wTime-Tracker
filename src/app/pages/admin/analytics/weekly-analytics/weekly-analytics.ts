import { Component, DestroyRef, inject, OnInit, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ChartData } from "chart.js";
import { AnalyticsService } from "src/app/services/analytics/analytics-service";
import { CHART_COLORS, CHART_OPTS, LINE_OPTS } from "src/app/shared/const";
import { buildBarData } from "src/app/shared/utils/builder-bar.util";
import { WeeklyAnalytics as wAnalytics } from "../../../../services/analytics/analytics-model";
import { UIChart } from "primeng/chart";
import { CommonModule } from "@angular/common";
import { DataTable } from "src/app/shared/data-table/data-table/data-table";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "app-weekly-analytics",
  imports: [UIChart, CommonModule, DataTable, TranslatePipe],
  templateUrl: "./weekly-analytics.html",
  styleUrl: "./weekly-analytics.scss",
})
export class WeeklyAnalytics implements OnInit {
  // Priv Properties
  private analyticsService = inject(AnalyticsService);
  private destroyRef = inject(DestroyRef);

  // Data Properties
  weekly = signal<wAnalytics | any>(undefined);

  weeklyBarData?: ChartData<"bar">;
  weeklyLineData?: ChartData<"line">;
  now = new Date();
  chartOpts = CHART_OPTS;
  lineOpts = LINE_OPTS;
  chartColors = CHART_COLORS;
  Math = Math;

  // Building Bars
  buildHoursBarData = buildBarData;

  // Lifecycle
  ngOnInit(): void {
    this.getWeeklyAnalytics();
  }

  fmtDay(d: string): string {
    return d.slice(5, 10).replace("-", "/");
  }

  // Building Bars
  private getWeeklyAnalytics() {
    this.analyticsService
      .getWeeklyAnalytics(this.now.toISOString().split("T")[0])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((w) => {
        this.weekly.set(w);
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
}
