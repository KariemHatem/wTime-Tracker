import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  DestroyRef,
  signal,
  computed,
} from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { Subscription, interval } from "rxjs";
import { ButtonModule } from "primeng/button";
import { ProgressBarModule } from "primeng/progressbar";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { ToastModule } from "primeng/toast";
import { ApiService } from "../../services/api.service";
import { AuthService } from "../../services/auth/auth.service";
import { TodayProgress, WorkSession } from "../../models/api.models";
import { WeeklyReport } from "../..//services/reports/admin-report";
import { AdminReports } from "src/app/services/reports/admin-reports";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Toater } from "src/app/services/toater";
import {
  formatMinutes,
  formatDate,
  pad,
} from "src/app/shared/utils/date-time.util";
import { HeaderSection } from "src/app/shared/header-section/header-section";
import { DataTable } from "src/app/shared/data-table/data-table/data-table";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    ButtonModule,
    ProgressBarModule,
    TableModule,
    TagModule,
    ToastModule,
    HeaderSection,
    DataTable,
    TranslatePipe,
  ],
  providers: [DatePipe],
  templateUrl: "./dashboard.html",
  styleUrl: "./dashboard.scss",
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Priv Props
  private report = inject(AdminReports);
  private api = inject(ApiService);
  public auth = inject(AuthService);
  private toastServices = inject(Toater);
  private destroyref = inject(DestroyRef);
  private timerSub?: Subscription;

  // Data
  progress = signal<TodayProgress | undefined>(undefined);
  weekly = signal<WeeklyReport | undefined>(undefined);
  todaySessions = signal<WorkSession[]>([]);
  loadingSessions = signal(true);
  actionLoading = signal(false);
  isRunning = signal(false);
  elapsedSeconds = signal(0);
  numOfSessions = signal(0);
  today = new Date();

  // Helper Util
  fmtMins = formatMinutes;
  fmtDate = formatDate;
  pad = pad;

  get user() {
    return this.auth.currentUser;
  }

  // Lifecycle
  ngOnInit(): void {
    this.loadAll();
  }

  ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
  }

  // Priv Methods

  // Loadd All
  private loadAll() {
    this.loadProgress();
    this.weeklyReport();
    this.listSessions();
    this.activeSession();
  }

  // Today Progress
  private loadProgress() {
    this.api
      .getTodayProgress()
      .pipe(takeUntilDestroyed(this.destroyref))
      .subscribe({
        next: (res) => {
          this.progress.set(res);
        },
      });
  }

  // Weekly Report
  private weeklyReport() {
    this.report
      .getWeeklyReport()
      .pipe(takeUntilDestroyed(this.destroyref))
      .subscribe({
        next: (res) => {
          this.weekly.set(res);
        },
      });
  }

  // List sessions
  private listSessions() {
    this.api
      .listSessions(this.fmtDate(new Date()), this.fmtDate(new Date()))
      .pipe(takeUntilDestroyed(this.destroyref))
      .subscribe({
        next: (res) => {
          this.todaySessions.set(res);
          this.numOfSessions.set(res.length);
          this.loadingSessions.set(false);
        },
        error: () => {
          this.loadingSessions.set(false);
        },
      });
  }

  // Active Session
  private activeSession(): void {
    this.api
      .getActiveSession()
      .pipe(takeUntilDestroyed(this.destroyref))
      .subscribe({
        next: (res) => {
          const session = res.session;
          if (session && session.endTime === null) {
            this.isRunning.set(true);
            this.startTimer(session.startTime);
          } else {
            this.isRunning.set(false);
          }
        },
      });
  }

  // Stop Session
  private stopSession() {
    this.api
      .endSession()
      .pipe(takeUntilDestroyed(this.destroyref))
      .subscribe({
        next: () => {
          this.isRunning.set(false);
          this.stopTimer();
          this.actionLoading.set(false);
          this.loadAll();
          this.toastServices.infoToaster("Session Stopped.");
        },
        error: () => {
          this.actionLoading.set(false);
          this.toastServices.errorToaster("Could not stop session.");
        },
      });
  }

  // Start Session
  private startSession() {
    this.api
      .startSession()
      .pipe(takeUntilDestroyed(this.destroyref))
      .subscribe({
        next: (s) => {
          this.isRunning.set(true);
          this.startTimer(s.startTime);
          this.actionLoading.set(false);
          this.loadAll();
          this.toastServices.infoToaster("Session started.");
        },
        error: () => {
          this.actionLoading.set(false);
          this.toastServices.errorToaster("Could not start session.");
        },
      });
  }

  // Toggle Session
  toggleSession(): void {
    this.actionLoading.set(true);
    if (this.isRunning()) {
      this.stopSession();
    } else {
      this.startSession();
    }
  }

  // Start Timer
  startTimer(startTime: string): void {
    this.stopTimer();
    const start = new Date(startTime);
    this.elapsedSeconds.set(Math.floor((Date.now() - start.getTime()) / 1000));
    this.timerSub = interval(1000).subscribe(() =>
      this.elapsedSeconds.update((s) => s + 1),
    );
  }

  // Stop Timer
  stopTimer(): void {
    this.timerSub?.unsubscribe();
    this.timerSub = undefined;
    this.elapsedSeconds.set(0);
  }

  // Timer Display
  timerDisplay = computed(() => {
    const h = Math.floor(this.elapsedSeconds() / 3600);
    const m = Math.floor((this.elapsedSeconds() % 3600) / 60);
    const s = this.elapsedSeconds() % 60;
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  });

  // Weekly Percent
  weeklyPercent = computed(() => {
    const w = this.weekly();
    if (!w || !w.totalTargetMinutes) return 0;
    return Math.round((w.totalWorkedMinutes / w.totalTargetMinutes) * 100);
  });
}
