import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { ChartData } from "chart.js";
import { AnalyticsService } from "src/app/services/analytics/analytics-service";
import { MonthlyReport as monthReport } from "../../../services/analytics/analytics-model";
import { buildBarData } from "src/app/shared/utils/builder-bar.util";
import { CHART_OPTS, CHART_COLORS } from "src/app/shared/const";
import { formatMinutes } from "src/app/shared/utils/date-time.util";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { UIChart } from "primeng/chart";
import { Summary } from "src/app/shared/model";
import { SummaryCards } from "src/app/shared/summary-cards/summary-cards";
import { TranslatePipe } from "@ngx-translate/core";
@Component({
  selector: "app-monthly-report",
  imports: [UIChart, SummaryCards, TranslatePipe],
  templateUrl: "./monthly-report.html",
  styleUrl: "./monthly-report.scss",
})
export class MonthlyReport implements OnInit {
  // Priv Properties
  private analyticsService = inject(AnalyticsService);
  private destroyRef = inject(DestroyRef);

  // Data
  monthlyChartData?: ChartData<"bar">;
  monthly = signal<monthReport | undefined>(undefined);
  chartOpts = CHART_OPTS;
  chartColors = CHART_COLORS;

  // Utils
  buildHoursBarData = buildBarData;
  fmtMins = formatMinutes;

  // Lifecycle
  ngOnInit(): void {
    this.loadMonthly();
  }

  // Monthly Report
  loadMonthly(): void {
    const now = new Date();
    this.analyticsService
      .getMonthlyReport(now.getFullYear(), now.getMonth() + 1)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((m) => {
        this.monthly.set(m);
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

  // Summary
  monthlySummary = computed<Summary[]>(() => {
    const sm = this.monthly();
    if (!sm) return [];
    return [
      {
        label: "MONTHLY_REPORT.SUMMARY.TOTAL_WORKED",
        value: this.fmtMins(sm.totalWorkedMinutes),
        color: this.chartColors.workedBlue,
      },
      {
        label: "MONTHLY_REPORT.SUMMARY.TARGET",
        value: this.fmtMins(sm.totalTargetMinutes),
        color: "var(--text-color)",
      },
      {
        label: "MONTHLY_REPORT.SUMMARY.OVERTIME",
        value: this.fmtMins(sm.overtimeMinutes ?? 0),
        color: this.chartColors.workedGreen,
      },
      {
        label: "MONTHLY_REPORT.SUMMARY.PRODUCTIVITY",
        value: `${(sm.productivityPercent ?? 0).toFixed(0)}%`,
        color: "#a78bfa",
      },
    ];
  });
}
