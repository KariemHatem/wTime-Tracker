import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TabsModule } from "primeng/tabs";
import { HeaderSection } from "src/app/shared/header-section/header-section";
import { MonthlyAnalytics } from "./monthly-analytics/monthly-analytics";
import { WeeklyAnalytics } from "./weekly-analytics/weekly-analytics";
import { TranslatePipe } from "@ngx-translate/core";
@Component({
  selector: "app-admin-analytics",
  standalone: true,
  imports: [
    CommonModule,
    TabsModule,
    HeaderSection,
    MonthlyAnalytics,
    WeeklyAnalytics,
    TranslatePipe,
  ],
  templateUrl: "./analytics.html",
  styleUrl: "./analytics.scss",
})
export class AdminAnalyticsComponent {
  activeTab = signal(0);
}
