import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { Subscription, interval } from "rxjs";
import { ButtonModule } from "primeng/button";
import { ProgressBarModule } from "primeng/progressbar";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { ApiService } from "../../services/api.service";
import { AuthService } from "../../services/auth.service";
import {
  TodayProgress,
  WorkSession,
  WeeklyReport,
  MonthlyReport,
} from "../../models/api.models";

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
  ],
  providers: [DatePipe],
  templateUrl: "./dashboard.html",
  styleUrl: "./dashboard.scss",
})
export class DashboardComponent implements OnInit, OnDestroy {
  progress?: TodayProgress;
  weekly?: WeeklyReport;
  todaySessions: WorkSession[] = [];
  loadingSessions = true;
  actionLoading = false;
  isRunning = false;
  elapsedSeconds = 0;
  today = new Date();

  private timerSub?: Subscription;
  private subs = new Subscription();

  constructor(
    private api: ApiService,
    public auth: AuthService,
    private msg: MessageService,
  ) {}

  get user() {
    return this.auth.currentUser;
  }

  ngOnInit(): void {
    this.loadAll();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.timerSub?.unsubscribe();
  }

  loadAll(): void {
    this.subs.add(
      this.api.getTodayProgress().subscribe((p) => (this.progress = p)),
    );
    this.subs.add(
      this.api.getWeeklyReport().subscribe((w) => (this.weekly = w)),
    );
    this.subs.add(
      this.api
        .listSessions(this.fmtDate(new Date()), this.fmtDate(new Date()))
        .subscribe((s) => {
          this.todaySessions = s;
          this.loadingSessions = false;
        }),
    );
    this.subs.add(
      this.api.getActiveSession().subscribe((s) => {
        if (s?.isActive) {
          this.isRunning = true;
          this.startTimer(s.startTime);
        }
      }),
    );
  }

  toggleSession(): void {
    this.actionLoading = true;
    if (this.isRunning) {
      this.api.endSession().subscribe({
        next: () => {
          this.isRunning = false;
          this.stopTimer();
          this.actionLoading = false;
          this.loadAll();
        },
        error: () => {
          this.actionLoading = false;
          this.msg.add({
            severity: "error",
            summary: "Error",
            detail: "Could not stop session.",
          });
        },
      });
    } else {
      this.api.startSession().subscribe({
        next: (s) => {
          this.isRunning = true;
          this.startTimer(s.startTime);
          this.actionLoading = false;
          this.loadAll();
        },
        error: () => {
          this.actionLoading = false;
          this.msg.add({
            severity: "error",
            summary: "Error",
            detail: "Could not start session.",
          });
        },
      });
    }
  }

  startTimer(startTime: string): void {
    const start = new Date(startTime);
    this.elapsedSeconds = Math.floor((Date.now() - start.getTime()) / 1000);
    this.timerSub = interval(1000).subscribe(() => this.elapsedSeconds++);
  }

  stopTimer(): void {
    this.timerSub?.unsubscribe();
    this.elapsedSeconds = 0;
  }

  get timerDisplay(): string {
    const h = Math.floor(this.elapsedSeconds / 3600);
    const m = Math.floor((this.elapsedSeconds % 3600) / 60);
    const s = this.elapsedSeconds % 60;
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }

  get weeklyPercent(): number {
    if (!this.weekly || !this.weekly.totalTargetMinutes) return 0;
    return Math.round(
      (this.weekly.totalWorkedMinutes / this.weekly.totalTargetMinutes) * 100,
    );
  }

  fmtMins(mins?: number | null): string {
    const n = mins ?? 0;
    const h = Math.floor(n / 60),
      m = n % 60;
    return h === 0 ? `${m}m` : m === 0 ? `${h}h` : `${h}h ${m}m`;
  }

  fmtDate(d: Date): string {
    return d.toISOString().split("T")[0];
  }
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}
