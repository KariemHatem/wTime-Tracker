import {
  Component,
  OnInit,
  inject,
  DestroyRef,
  signal,
  computed,
} from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { DatePickerModule } from "primeng/datepicker";
import { ButtonModule } from "primeng/button";
import { TagModule } from "primeng/tag";
import { ApiService } from "../../services/api.service";
import { WorkSession } from "../../models/api.models";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { formatMinutes } from "src/app/shared/utils/date-time.util";
import { HeaderSection } from "src/app/shared/header-section/header-section";
import { DataTable } from "src/app/shared/data-table/data-table/data-table";

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
    HeaderSection,
    DataTable,
  ],
  templateUrl: "./sessions.html",
  styleUrl: "./sessions.scss",
})
export class SessionsComponent implements OnInit {
  // Priv Properties
  private apiService = inject(ApiService);
  private destroyRef = inject(DestroyRef);

  // Data
  sessions = signal<WorkSession[]>([]);
  loading = signal(false);

  private readonly now = new Date();
  fromDate: Date = new Date(this.now.getFullYear(), this.now.getMonth(), 1);
  toDate: Date = this.now;

  // Helper Utils
  fmtMins = formatMinutes;

  // Lifecycle
  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.apiService
      .listSessions(this.fmt(this.fromDate), this.fmt(this.toDate))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.sessions.set(res);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  totalMinutes = computed(() => {
    const s = this.sessions();
    return s.reduce((r, x) => r + (x.totalMinutes ?? 0), 0);
  });

  fmt(d: Date): string {
    return d.toISOString().split("T")[0];
  }
}
