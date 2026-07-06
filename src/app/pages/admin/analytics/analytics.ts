import { Component, OnInit, inject, DestroyRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TabsModule } from "primeng/tabs";
import { ChartModule } from "primeng/chart";
import { TableModule } from "primeng/table";
import { HeaderSection } from "src/app/shared/header-section/header-section";
import { MonthlyAnalytics } from "./monthly-analytics/monthly-analytics";
import { WeeklyAnalytics } from "./weekly-analytics/weekly-analytics";
@Component({
  selector: "app-admin-analytics",
  standalone: true,
  imports: [
    CommonModule,
    TabsModule,
    ChartModule,
    TableModule,
    HeaderSection,
    MonthlyAnalytics,
    WeeklyAnalytics,
  ],
  templateUrl: "./analytics.html",
  styleUrl: "./analytics.scss",
})
export class AdminAnalyticsComponent {}
