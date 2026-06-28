import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Subscription } from "rxjs";
import { TableModule } from "primeng/table";
import { DatePickerModule } from "primeng/datepicker";
import { ButtonModule } from "primeng/button";
import { TagModule } from "primeng/tag";
import { ApiService } from "../../services/api.service";
import { WorkSession } from "../../models/api.models";

@Component({
  selector: "app-sessions",
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    TableModule,
    DatePickerModule,
    ButtonModule,
    TagModule,
  ],
  templateUrl: "./sessions.html",
  styleUrl: "./sessions.scss",
})
export class SessionsComponent implements OnInit, OnDestroy {
  sessions: WorkSession[] = [];
  loading = true;
  fromDate: Date;
  toDate: Date;
  private sub?: Subscription;

  constructor(private api: ApiService) {
    const now = new Date();
    this.toDate = now;
    this.fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  ngOnInit(): void {
    this.load();
  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  load(): void {
    this.loading = true;
    this.sub?.unsubscribe();
    this.sub = this.api
      .listSessions(this.fmt(this.fromDate), this.fmt(this.toDate))
      .subscribe({
        next: (s) => {
          this.sessions = s;
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
  }

  get totalMinutes(): number {
    return this.sessions.reduce((s, x) => s + (x.totalMinutes ?? 0), 0);
  }

  fmtMins(mins?: number | null): string {
    const n = mins ?? 0;
    const h = Math.floor(n / 60),
      m = n % 60;
    return h === 0 ? `${m}m` : m === 0 ? `${h}h` : `${h}h ${m}m`;
  }

  fmt(d: Date): string {
    return d.toISOString().split("T")[0];
  }
}
