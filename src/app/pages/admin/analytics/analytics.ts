import { Component, OnInit, OnDestroy, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Subscription } from "rxjs";
import { TabsModule } from "primeng/tabs";
import { ChartModule } from "primeng/chart";
import { TableModule } from "primeng/table";
import { ApiService } from "../../../services/api.service";
import {
  WeeklyAnalytics,
  MonthlyAnalytics,
} from "../../../services/analytics/analytics-model";
import { AnalyticsService } from "src/app/services/analytics/analytics-service";

const CHART_OPTS = {
  responsive: true,
  plugins: { legend: { labels: { color: "#94a3b8" } } },
  scales: {
    x: {
      ticks: { color: "#94a3b8" },
      grid: { color: "rgba(148,163,184,0.08)" },
    },
    y: {
      ticks: { color: "#94a3b8" },
      grid: { color: "rgba(148,163,184,0.08)" },
      beginAtZero: true,
    },
  },
};

const LINE_OPTS = {
  ...CHART_OPTS,
  elements: { line: { tension: 0.3 } },
};

@Component({
  selector: "app-admin-analytics",
  standalone: true,
  imports: [CommonModule, TabsModule, ChartModule, TableModule],
  templateUrl: "./analytics.html",
  styleUrl: "./analytics.scss",
})
export class AdminAnalyticsComponent implements OnInit, OnDestroy {
  // Priv Properties
  private analyticsService = inject(AnalyticsService);
  weekly?: WeeklyAnalytics;
  monthly?: MonthlyAnalytics;
  weeklyBarData: any = null;
  weeklyLineData: any = null;
  monthlyBarData: any = null;
  chartOpts = CHART_OPTS;
  lineOpts = LINE_OPTS;
  Math = Math;
  private subs = new Subscription();

  fmtDay(d: string): string {
    return d.slice(5, 10).replace("-", "/");
  }
  fmtMonth(m: number): string {
    return m.toString().padStart(2, "0");
  }

  ngOnInit(): void {
    const now = new Date();
    this.subs.add(
      this.analyticsService
        .getWeeklyAnalytics(now.toISOString().split("T")[0])
        .subscribe((w) => {
          this.weekly = w;
          this.weeklyBarData = {
            labels: w.days.map((d) => d.dayName.slice(0, 3)),
            datasets: [
              {
                label: "Target (h)",
                data: w.days.map((d) => +(d.targetMinutes / 60).toFixed(1)),
                backgroundColor: "rgba(148,163,184,0.2)",
              },
              {
                label: "Worked (h)",
                data: w.days.map((d) => +(d.workedMinutes / 60).toFixed(1)),
                backgroundColor: "#3b82f6",
              },
            ],
          };
          this.weeklyLineData = {
            labels: w.days.map((d) => d.dayName.slice(0, 3)),
            datasets: [
              {
                label: "Productivity %",
                data: w.days.map((d) => Math.round(d.productivityPercent)),
                borderColor: "#22c55e",
                backgroundColor: "rgba(34,197,94,.1)",
                fill: true,
              },
            ],
          };
        }),
    );
    this.subs.add(
      this.analyticsService
        .getMonthlyAnalytics(now.getFullYear(), now.getMonth() + 1)
        .subscribe((m) => {
          this.monthly = m;
          this.monthlyBarData = {
            labels: m.weeks.map((w) => `W${w.weekNumber}`),
            datasets: [
              {
                label: "Target (h)",
                data: m.weeks.map((w) => +(w.targetMinutes / 60).toFixed(1)),
                backgroundColor: "rgba(148,163,184,0.2)",
              },
              {
                label: "Worked (h)",
                data: m.weeks.map((w) => +(w.workedMinutes / 60).toFixed(1)),
                backgroundColor: "#22c55e",
              },
            ],
          };
        }),
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
