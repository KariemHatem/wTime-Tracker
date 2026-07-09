import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TabsModule } from "primeng/tabs";
import { DailyReport } from "./daily-report/daily-report";
import { WeeklyReport } from "./weekly-report/weekly-report";
import { MonthlyReport } from "./monthly-report/monthly-report";
import { HeaderSection } from "src/app/shared/header-section/header-section";
import { TranslatePipe } from "@ngx-translate/core";
@Component({
  selector: "app-reports",
  standalone: true,
  imports: [
    CommonModule,
    TabsModule,
    DailyReport,
    WeeklyReport,
    MonthlyReport,
    HeaderSection,
    TranslatePipe,
  ],
  templateUrl: "./reports.html",
  styleUrl: "./reports.scss",
})
export class ReportsComponent {}
