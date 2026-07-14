import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ChartData } from "chart.js";
import { AnalyticsService } from "src/app/services/analytics/analytics-service";
import { CHART_OPTS, LINE_OPTS, CHART_COLORS } from "src/app/shared/const";
import { MonthlyAnalytics as mAnalytics } from "../../../../services/analytics/analytics-model";
import { buildBarData } from "src/app/shared/utils/builder-bar.util";
import { UIChart } from "primeng/chart";
import { DataTable } from "src/app/shared/data-table/data-table/data-table";
import { TranslatePipe } from "@ngx-translate/core";
@Component({
  selector: "app-monthly-analytics",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIChart, DataTable, TranslatePipe],
  templateUrl: "./monthly-analytics.html",
  styleUrl: "./monthly-analytics.scss",
})
export class MonthlyAnalytics implements OnInit {
  // Priv Properties
  private analyticsService = inject(AnalyticsService);
  private destroyRef = inject(DestroyRef);

  // Data Properties
  monthly = signal<mAnalytics | any>(undefined);
  monthlyBarData?: ChartData<"bar">;
  chartOpts = CHART_OPTS;
  lineOpts = LINE_OPTS;
  chartColors = CHART_COLORS;
  now = new Date();

  // Lifecycle
  ngOnInit() {
    this.getMonthlyAnalytics();
  }

  // Building Bars Util
  buildHoursBarData = buildBarData;

  fmtMonth(m: number | any): string {
    return m.toString().padStart(2, "0");
  }

  private getMonthlyAnalytics() {
    this.analyticsService
      .getMonthlyAnalytics(this.now.getFullYear(), this.now.getMonth() + 1)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((m) => {
        this.monthly.set(m);

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
