import { Component, OnInit, OnDestroy, inject, signal } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Subscription } from "rxjs";
import { TabsModule } from "primeng/tabs";
import { DatePickerModule } from "primeng/datepicker";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { ChartModule } from "primeng/chart";
import { ApiService } from "../../services/api.service";
import { MonthlyReport } from "../../services/analytics/analytics-model";
import { AnalyticsService } from "src/app/services/analytics/analytics-service";
import { Report, WeeklyReport } from "src/app/services/reports/admin-report";
import { AdminReports } from "src/app/services/reports/admin-reports";

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
export class ReportsComponent implements OnInit, OnDestroy {
  // Priv Properties
  private analyticsService = inject(AnalyticsService);
  private report = inject(AdminReports);

  // Data
  dailyDate = new Date();
  weekDate = this.startOfWeek(new Date());
  daily = new Date();
  dailyRows = signal<Report[]>([]);
  weekly?: WeeklyReport;
  monthly?: MonthlyReport;
  loadingDaily = signal(true);
  weeklyChartData: any = null;
  monthlyChartData: any = null;
  chartOpts = CHART_OPTS;
  Math = Math;

  private subs = new Subscription();

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadDaily();
    this.loadWeekly();
    this.loadMonthly();
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // Priv Methods

  // Daily Report
  private loadDaily(): void {
    this.loadingDaily.set(true);
    this.subs.add(
      this.report.getDailyReport(this.fmt(this.dailyDate)).subscribe({
        next: (res) => {
          this.dailyRows.set(res);
          this.loadingDaily.set(false);
        },
      }),
    );
  }

  // Weekly Report
  private loadWeekly(): void {
    this.subs.add(
      this.report.getWeeklyReport(this.fmt(this.weekDate)).subscribe((w) => {
        this.weekly = w;
        this.weeklyChartData = {
          labels: w.dailyBreakdown.map((d) => d.dayName.slice(0, 3)),
          datasets: [
            {
              label: "Target (h)",
              data: w.dailyBreakdown.map(
                (d) => +(d.targetMinutes / 60).toFixed(1),
              ),
              backgroundColor: "rgba(148,163,184,0.2)",
            },
            {
              label: "Worked (h)",
              data: w.dailyBreakdown.map(
                (d) => +(d.workedMinutes / 60).toFixed(1),
              ),
              backgroundColor: "#3b82f6",
            },
          ],
        };
      }),
    );
  }

  loadMonthly(): void {
    const now = new Date();
    this.subs.add(
      this.analyticsService
        .getMonthlyReport(now.getFullYear(), now.getMonth() + 1)
        .subscribe((m) => {
          this.monthly = m;
          this.monthlyChartData = {
            labels: m.weeklyBreakdown.map((w) => `W${w.weekNumber}`),
            datasets: [
              {
                label: "Target (h)",
                data: m.weeklyBreakdown.map(
                  (w) => +(w.targetMinutes / 60).toFixed(1),
                ),
                backgroundColor: "rgba(148,163,184,0.2)",
              },
              {
                label: "Worked (h)",
                data: m.weeklyBreakdown.map(
                  (w) => +(w.workedMinutes / 60).toFixed(1),
                ),
                backgroundColor: "#22c55e",
              },
            ],
          };
        }),
    );
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

  fmtMins(n?: number | null): string {
    const v = n ?? 0;
    const h = Math.floor(v / 60),
      m = v % 60;
    return h === 0 ? `${m}m` : m === 0 ? `${h}h` : `${h}h ${m}m`;
  }

  startOfWeek(d: Date): Date {
    const day = d.getDay(),
      diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }

  fmt(d: Date): string {
    return d.toISOString().split("T")[0];
  }
}
